//---------------------------------------------------------
// -------------------------STATE--------------------------
//---------------------------------------------------------
let categories = null;
// data
const state = {
  entries: [],
  activeTab: "expense",
};
//-----------------------------------------------------------
// -------------------------HELPERS--------------------------
//-----------------------------------------------------------
//Create the date of added postentry
function getTodayDate() {
  return new Date().toISOString();
}
//Making the date pretty and swedish
function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleDateString("sv-SE", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
// generate ID for deletepost function
function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
// Set Category ID
function findCategoryById(categoryId) {
  return [...categories.income, ...categories.expense].find(
    (category) => category.id === categoryId,
  );
}
//-----------------------------------------------------------
// ------------------------UI FUNCTIONS----------------------
//-----------------------------------------------------------

//Radiobuttons
function getCheckedEntryType() {
  const checked = document.querySelector('input[name="entryType"]:checked');
  return checked && checked.value === "expense" ? "expense" : "income";
}
// get right categorylist for chosen radiobtn
function fillCategorySelect(type) {
  const select = document.querySelector("#category");
  if (!select || !categories) return;

  // reset the placeholder
  select.innerHTML =
    '<option value="" disabled selected>Välj Kategori </option>';

  const list = type === "income" ? categories.income : categories.expense;

  list.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.label;
    select.appendChild(option);
  });
}
function initCategorySwitch() {
  fillCategorySelect(getCheckedEntryType());

  // uppdates radio when changed
  document.querySelectorAll('input[name="entryType"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      fillCategorySelect(getCheckedEntryType());
    });
  });
}
//formsubmit ui
function initFormSubmit() {
  const form = document.querySelector("#entry-form");
  if (!form) return;

  form.addEventListener("submit", onFormSubmit);
}
// what to pull from submitted entry
function onFormSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const fd = new FormData(form);

  const type = fd.get("entryType");
  const amount = Number(fd.get("amount"));
  const categoryId = String(fd.get("category") || "");
  const note = String(fd.get("note") || "");

  // validation
  const typeOk = type === "income" || type === "expense";
  const amountOk = Number.isFinite(amount) && amount > 0;
  const categoryOk = categoryId !== "";

  if (!typeOk || !amountOk || !categoryOk) return;
  //inside entry
  const entry = {
    id: generateId(),
    type,
    amount,
    categoryId,
    note,
    createdAt: getTodayDate(),
  };

  state.entries.push(entry);
  renderEntry(entry);

  console.log("Ny entry:", entry);
}

// Render list by chosen category
function renderEntry(entry) {
  const listEl =
    entry.type === "income"
      ? document.querySelector("#income-list")
      : document.querySelector("#expense-list");
  if (!listEl) return;

  const category = findCategoryById(entry.categoryId);
  if (!category) return;

  const li = document.createElement("li");
  li.classList.add("entry");
  li.dataset.id = entry.id;

  const iconUrl = `${import.meta.env.BASE_URL}icons/${category.icon}`;
  //HTML
  li.innerHTML = `
    <div class="entry-column-1">
        <img class="entry-icon" src="${iconUrl}.svg" width="30" height="30" alt="" aria-hidden="true"/>
        <div class="entry-summary">
            <span class="entry-category">${category.label}</span>
            <div class="entry-meta">
                <span class="entry-note">${entry.note || ""}</span>
                <time class="entry-date" datetime="${entry.createdAt}">
                    ${formatDate(entry.createdAt)}
                </time>
            </div>
        </div>
    </div>    
    <div class="entry-column-2">
        <span class="entry-amount">${entry.type === "expense" ? "-" : ""}${entry.amount} kr</span>
        <button type="button" class="entry-delete" aria-label="Radera post">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6875 3.83333L11.9831 13.9517C11.9539 14.3722 11.7704 14.7657 11.4697 15.053C11.1689 15.3403 10.7731 15.5 10.3621 15.5H3.63787C3.22686 15.5 2.83112 15.3403 2.53034 15.053C2.22957 14.7657 2.04612 14.3722 2.01694 13.9517L1.3125 3.83333M5.375 7.16667V12.1667M8.625 7.16667V12.1667M9.4375 3.83333V1.33333C9.4375 1.11232 9.3519 0.900358 9.19952 0.744078C9.04715 0.587797 8.84049 0.5 8.625 0.5H5.375C5.15951 0.5 4.95285 0.587797 4.80048 0.744078C4.6481 0.900358 4.5625 1.11232 4.5625 1.33333V3.83333M0.5 3.83333H13.5" stroke="#FEFEFE" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div> 
    `;
  listEl.appendChild(li);
}

//-----------------------------------------------------------
// -------------------------INITS & FETCH--------------------
//-----------------------------------------------------------

fetch(`${import.meta.env.BASE_URL}data/categories.json`)
  .then((res) => res.json())
  .then((data) => {
    categories = data;
    initCategorySwitch();
    initFormSubmit();
  })
  .catch((err) => {
    console.error("Kunde inte ladda categories.json", err);
  });
