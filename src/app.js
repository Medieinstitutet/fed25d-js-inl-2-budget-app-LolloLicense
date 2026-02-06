//---------------------------------------------------------
//--------------------------STATE--------------------------
//---------------------------------------------------------

let categories = null;
//localStorage
const LS_DB_ID = "ikapp_entries";
// data
const now = new Date();
const state = {
  entries: [],
  activeTab: "income",

  periodMode: "month",
  periodYear: now.getFullYear(),
  periodMonth: now.getMonth(),
};

//-----------------------------------------------------------
//--------------------------HELPERS--------------------------
//-----------------------------------------------------------

//Making the date pretty and swedish
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("sv-SE", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
}
// generate ID for deletepost function
function generateId() {
  return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}
// Set Category ID
function findCategoryById(categoryId) {
  return [
    ...categories.income,
    ...categories.expense,
    ...categories.savings,
  ].find((category) => category.id === categoryId);
}
//reset entryfields(inputs/select) to default
function resetEntryFields(form) {
  const amountInput = form.querySelector("#amount");
  const categorySelect = form.querySelector("#category");
  const noteInput = form.querySelector("#note");

  if (amountInput) amountInput.value = "";
  if (noteInput) noteInput.value = "";
  if (categorySelect) categorySelect.selectedIndex = 0;
}
// Formatting amouts
function formatMoney(amount) {
  if (!Number.isFinite(amount)) return "0 kr";

  const rounded = Math.round(amount);

  // formatting number to show thousands as 1 000kr
  const formatted = Math.abs(rounded).toLocaleString("sv-SE");

  const sign = rounded < 0 ? "-" : "";
  return `${sign}${formatted} kr`;
}
//-----------------------------------------------------------
//-----------------------PERIOD HELPERS----------------------
//-----------------------------------------------------------

// Create a stabil date string
function formatDateKey(date) {
  return date.toISOString().slice(0, 10);
}
//Create the date of added postentry
function getTodayDate() {
  return formatDateKey(new Date());
}
// function to count the month in increasing value
function getMonthPeriodIndex(year, month) {
  return year * 12 + month;
}

// Defining whats this period is / prevous period / future
function getNowPeriodIndex() {
  const currentDate = new Date();

  if (state.periodMode === "month") {
    return getMonthPeriodIndex(
      currentDate.getFullYear(),
      currentDate.getMonth(),
    );
  }
  // If user chooses to view full year :
  return currentDate.getFullYear();
}

function getViewedPeriodIndex() {
  if (state.periodMode === "month") {
    return getMonthPeriodIndex(state.periodYear, state.periodMonth);
  }
  return state.periodYear;
}

function comparePeriod() {
  const nowIndex = getNowPeriodIndex();
  const viewedIndex = getViewedPeriodIndex();

  if (viewedIndex === nowIndex) return "current";
  return viewedIndex < nowIndex ? "past" : "future";
}
// Set the date for submitt post
function getCreatedAtForNewEntry() {
  const where = comparePeriod();
  //if post is make real time - set todays date
  if (where === "current") {
    return getTodayDate();
  }
  // if user views past period, store entry on day one of that period
  if (where === "past") {
    const day =
      state.periodMode === "month"
        ? new Date(state.periodYear, state.periodMonth, 1)
        : new Date(state.periodYear, 0, 1);
    return formatDateKey(day);
  }
  // viewing future period - entrys not possible
  return null;
}
// Period filter function
function isEntryInViewedPeriod(entry) {
  // splitting up the ["2026"(y),"02"(m), "01"]
  const [y, m] = entry.createdAt.split("-").map(Number);
  const entryYear = y;
  const entryMonthIndex = m - 1;

  if (state.periodMode === "year") {
    return entryYear === state.periodYear;
  }
  return (
    entryYear === state.periodYear && entryMonthIndex === state.periodMonth
  );
}

// add click evenet to modebuttons in header
function initPeriodModeBtns() {
  const btns = document.querySelectorAll(".mode-btn");
  if (!btns.length) return;

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.dataset.mode;
      if (mode !== "month" && mode !== "year") return;

      state.periodMode = mode;
      // classes for UI
      btns.forEach((b) => {
        const isActive = b.dataset.mode === state.periodMode;
        b.classList.toggle("is-active", isActive);
        b.setAttribute("aria-pressed", String(isActive));
      });
      console.log("periodMode är nu:", state.periodMode);
      refreshUIforPeriodChange();
    });
  });
}
// Period nav Helpers

// changes periodlabel state
function changeViewdPeriod(direction) {
  // if we chose year jump year/year on click
  if (state.periodMode === "year") {
    state.periodYear += direction;
    return;
  }
  // Monthly jumps on click
  state.periodMonth += direction;
  //if we go back monthly to a different year > change year buy -1
  if (state.periodMonth < 0) {
    state.periodMonth = 11;
    state.periodYear -= 1;
  }
  //if we go forward monthly to a different year > change year buy +1
  if (state.periodMonth > 11) {
    state.periodMonth = 0;
    state.periodYear += 1;
  }
}
// connection the buttons to to period state
function initPeriodNavbtns() {
  const prevBtn = document.querySelector("#period-prev");
  const nextBtn = document.querySelector("#period-next");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      changeViewdPeriod(-1); //going back one step
      updatePeriodLabel();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      changeViewdPeriod(+1); //going forward one step
      updatePeriodLabel();
    });
  }
}

//-----------------------------------------------------------
//-----------------------LOCAL STORAGE STUFF-----------------
//-----------------------------------------------------------

// make enteries array to string function
function saveEntriesToLocalStorage() {
  //acuallay makes the string
  const stringified = JSON.stringify(state.entries);
  // saves the strin
  localStorage.setItem(LS_DB_ID, stringified);
}
// takes the string and reverse it backs to array
function loadEntriesFromLocalStorage() {
  const saved = localStorage.getItem(LS_DB_ID);
  if (saved === null) return;

  const parsed = JSON.parse(saved);

  state.entries = parsed.map((entry) => {
    // Om createdAt redan är YYYY-MM-DD, behåll.
    // Annars: försök parse:a och normalisera till YYYY-MM-DD.
    const date = new Date(entry.createdAt);

    return {
      ...entry,
      createdAt: Number.isNaN(date.getTime())
        ? getTodayDate()
        : formatDateKey(date),
    };
  });
}

//-----------------------------------------------------------
//-------------------------UI FUNCTIONS----------------------
//-----------------------------------------------------------

//Radiobuttons
function getCheckedEntryType() {
  const checked = document.querySelector('input[name="entryType"]:checked');
  const value = checked ? checked.value : "income";

  return value === "income" || value === "expense" || value === "savings"
    ? value
    : "income";
}

// get right categorylist for chosen radiobtn
function fillCategorySelect(type) {
  const select = document.querySelector("#category");
  if (!select || !categories) return;

  // reset the placeholder
  select.innerHTML =
    '<option value="" disabled selected>Välj Kategori </option>';

  const list =
    type === "income"
      ? categories.income
      : type === "expense"
        ? categories.expense
        : categories.savings;

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

// function for delete buttons - event delegation
// listitems renders by js therefor this function
function initDeleteBtns() {
  const incomeList = document.querySelector("#income-list");
  const expenseList = document.querySelector("#expense-list");
  const savingsList = document.querySelector("#savings-list");

  if (incomeList) incomeList.addEventListener("click", onDeleteClick);
  if (expenseList) expenseList.addEventListener("click", onDeleteClick);
  if (savingsList) savingsList.addEventListener("click", onDeleteClick);
}
function onDeleteClick(e) {
  const btn = e.target.closest(".entry-delete");
  if (!btn) return;

  const li = btn.closest("li");
  if (!li) return;

  const entryId = li.dataset.id;
  if (!entryId) return;

  deleteEntryById(entryId);
}
//removes the deleted entry from state + saves + rerenders
function deleteEntryById(entryId) {
  state.entries = state.entries.filter((entry) => entry.id !== entryId);

  saveEntriesToLocalStorage();
  renderAllEntries();
  updateTotalAmount();
  updateBalanceSummary();
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
  const typeOk = type === "income" || type === "expense" || type === "savings";
  const amountOk = Number.isFinite(amount) && amount > 0;
  const categoryOk = categoryId !== "";

  if (!typeOk || !amountOk || !categoryOk) return;
  // future post blocket and send info to user
  const createdAt = getCreatedAtForNewEntry();
  if (!createdAt) {
    alert("Du kan inte logga framtida poster");
    return;
  }
  //inside entry
  const entry = {
    id: generateId(),
    type,
    amount,
    categoryId,
    note,
    createdAt,
  };

  state.entries.push(entry);
  renderEntry(entry);
  saveEntriesToLocalStorage();
  updateTotalAmount();
  updateBalanceSummary();
  resetEntryFields(form);
}
// Totalamout function conects to the chosen type(income/expense)
function getTotalAmountForType(type) {
  return state.entries
    .filter(isEntryInViewedPeriod)
    .filter((entry) => entry.type === type)
    .reduce((sum, entry) => sum + entry.amount, 0);
}
// Period Label UI
function updatePeriodLabel() {
  const labelEl = document.querySelector("#period-label");
  if (!labelEl) return;

  // If year - show only 2026 ( Numbers)
  if (state.periodMode === "year") {
    labelEl.textContent = String(state.periodYear);
    return;
  }

  // if month - show m + y
  const date = new Date(state.periodYear, state.periodMonth, 1);
  //formatting month to ex. feb
  const formatter = new Intl.DateTimeFormat("sv-SE", {
    month: "short",
    year: "numeric",
  });
  // make first letter capital -> Feb
  const formatted = formatter.format(date);
  const noDot = formatted.replace(".", "");
  labelEl.textContent = noDot.charAt(0).toUpperCase() + noDot.slice(1);
}
// Balans summary
function updateBalanceSummary() {
  const saldoEl = document.querySelector("#balance-saldo");
  const expenseEl = document.querySelector("#balance-expense");
  const savingsEl = document.querySelector("#balance-savings");
  if (!saldoEl && !expenseEl && !savingsEl) return;

  //getting the amounts from getTotalAmount function
  const incomeTotal = getTotalAmountForType("income");
  const expenseTotal = getTotalAmountForType("expense");
  const savingsTotal = getTotalAmountForType("savings");

  // calc the saldo
  const saldo = incomeTotal - expenseTotal - savingsTotal;

  //toggle for css / UX
  if (saldoEl) {
    saldoEl.textContent = formatMoney(saldo);
    saldoEl.classList.toggle("is-positive", saldo > 0);
    saldoEl.classList.toggle("is-negative", saldo < 0);
  }

  // formatting negative value UX
  if (expenseEl) {
    expenseEl.textContent = `- ${formatMoney(Math.abs(expenseTotal))}`;
    expenseEl.classList.add("is-negative");
  }
  // svaings output
  if (savingsEl) {
    savingsEl.textContent = formatMoney(savingsTotal);
  }
}

// updating total amount and adds class for UX
function updateTotalAmount() {
  const totalEl = document.querySelector("#total-amount");
  if (!totalEl) return;

  const total = getTotalAmountForType(state.activeTab);
  if (state.activeTab === "expense") {
    totalEl.textContent = `-${formatMoney(total)}`;
  } else {
    totalEl.textContent = formatMoney(total);
  }

  totalEl.classList.toggle("is-income", state.activeTab === "income");
  totalEl.classList.toggle("is-expense", state.activeTab === "expense");
  totalEl.classList.toggle("is-savings", state.activeTab === "savings");
}

// show/hide tabs+panels depending witch is chosen
function updateTabsUI() {
  const incomeTab = document.querySelector("#tab-income");
  const expenseTab = document.querySelector("#tab-expense");
  const savingsTab = document.querySelector("#tab-savings");
  const incomePanel = document.querySelector("#panel-income");
  const expensePanel = document.querySelector("#panel-expense");
  const savingsPanel = document.querySelector("#panel-savings");

  // state
  const isIncome = state.activeTab === "income";
  const isExpense = state.activeTab === "expense";
  const isSavings = state.activeTab === "savings";

  if (incomeTab) incomeTab.setAttribute("aria-selected", String(isIncome));
  if (expenseTab) expenseTab.setAttribute("aria-selected", String(isExpense));
  if (savingsTab) savingsTab.setAttribute("aria-selected", String(isSavings));
  //styling
  if (incomeTab) incomeTab.classList.toggle("is-active", isIncome);
  if (expenseTab) expenseTab.classList.toggle("is-active", isExpense);
  if (savingsTab) savingsTab.classList.toggle("is-active", isSavings);

  const entriesEl = document.querySelector(".entries");
  if (entriesEl) {
    entriesEl.classList.toggle("is-income-active", isIncome);
    entriesEl.classList.toggle("is-expense-active", isExpense);
    entriesEl.classList.toggle("is-savings-active", isSavings);
  }
  // show / hide panels
  if (incomePanel) incomePanel.classList.toggle("is-hidden", !isIncome);
  if (expensePanel) expensePanel.classList.toggle("is-hidden", !isExpense);
  if (savingsPanel) savingsPanel.classList.toggle("is-hidden", !isSavings);

  // hidden attribute
  if (incomePanel) incomePanel.toggleAttribute("hidden", !isIncome);
  if (expensePanel) expensePanel.toggleAttribute("hidden", !isExpense);
  if (savingsPanel) savingsPanel.toggleAttribute("hidden", !isSavings);

  updateTotalAmount();
}

// sets clickevent to typetabs
function initTabs() {
  const incomeTab = document.querySelector("#tab-income");
  const expenseTab = document.querySelector("#tab-expense");
  const savingsTab = document.querySelector("#tab-savings");

  if (incomeTab) {
    incomeTab.addEventListener("click", () => {
      state.activeTab = "income";
      updateTabsUI();
    });
  }
  if (expenseTab) {
    expenseTab.addEventListener("click", () => {
      state.activeTab = "expense";
      updateTabsUI();
    });
  }
  if (savingsTab) {
    savingsTab.addEventListener("click", () => {
      state.activeTab = "savings";
      updateTabsUI();
    });
  }
  updateTabsUI();
}

//  INIT FUNCTION FOR UI
function refreshUIforPeriodChange() {
  renderAllEntries();
  updateTotalAmount();
  updateBalanceSummary();
  updatePeriodLabel();
}

//-----------------------------------------------------------
//-------------------------RENDER UI-------------------------
//-----------------------------------------------------------

// Render list by chosen category
function renderEntry(entry) {
  const listEl =
    entry.type === "income"
      ? document.querySelector("#income-list")
      : entry.type === "expense"
        ? document.querySelector("#expense-list")
        : document.querySelector("#savings-list");
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
        <span class="entry-amount">${entry.type === "expense" ? "- " : ""}${formatMoney(Math.abs(entry.amount))}</span>
        <button type="button" class="entry-delete" aria-label="Radera post">
            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12.6875 3.83333L11.9831 13.9517C11.9539 14.3722 11.7704 14.7657 11.4697 15.053C11.1689 15.3403 10.7731 15.5 10.3621 15.5H3.63787C3.22686 15.5 2.83112 15.3403 2.53034 15.053C2.22957 14.7657 2.04612 14.3722 2.01694 13.9517L1.3125 3.83333M5.375 7.16667V12.1667M8.625 7.16667V12.1667M9.4375 3.83333V1.33333C9.4375 1.11232 9.3519 0.900358 9.19952 0.744078C9.04715 0.587797 8.84049 0.5 8.625 0.5H5.375C5.15951 0.5 4.95285 0.587797 4.80048 0.744078C4.6481 0.900358 4.5625 1.11232 4.5625 1.33333V3.83333M0.5 3.83333H13.5" stroke="#FEFEFE" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        </button>
    </div> 
    `;
  listEl.appendChild(li);
}
// Render list after its loaded to local storage
function renderAllEntries() {
  const incomeList = document.querySelector("#income-list");
  const expenseList = document.querySelector("#expense-list");
  const savingsList = document.querySelector("#savings-list");
  // if empty list - return
  if (!incomeList || !expenseList || !savingsList) return;
  // emptys list so we dont have two of the same
  incomeList.innerHTML = "";
  expenseList.innerHTML = "";
  savingsList.innerHTML = "";
  // renders all after checking all
  state.entries.filter(isEntryInViewedPeriod).forEach((entry) => {
    renderEntry(entry);
  });
}

//-----------------------------------------------------------
//-------------------------INITS & FETCH---------------------
//-----------------------------------------------------------

fetch(`${import.meta.env.BASE_URL}data/categories.json`)
  .then((res) => res.json())
  .then((data) => {
    categories = data;
    initCategorySwitch();
    initFormSubmit();
    initDeleteBtns();

    loadEntriesFromLocalStorage();
    renderAllEntries();
    initTabs();
    updateTotalAmount();
    updateBalanceSummary();
    updatePeriodLabel();
    initPeriodModeBtns();
    initPeriodNavbtns();
  })
  .catch((err) => {
    console.error("Kunde inte ladda categories.json", err);
  });
