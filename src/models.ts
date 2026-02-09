// My models for data.

// allowed words for my entry types
export type EntryType = "income" | "expense" | "savings";

// sets the type for my categories (json)
export interface Category {
  id: string;
  label: string;
  icon: string;
}

// categories data needs to have these 3 keys
export interface CategoriesData {
  income: Category[];
  expense: Category[];
  savings: Category[];
}

//What my entrypost intails when its saved in localstorage
export interface Entry {
  id: string; // uniqe id for delete
  type: EntryType; // income | expense | savnings (EntryType)
  amount: number; // amout of money
  categoryId: string; // matches the exact id (salary | gift ...)
  note: string; // users own note
  createdAt: string; // date YYYY-MM-DD
}

export type Entries = Entry[];
