export enum TransactionType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export enum Category {
  FOOD = 'Food',
  TRANSPORT = 'Transport',
  RENT = 'Rent',
  UTILITIES = 'Utilities',
  INTERNET = 'Internet',
  TRANSFER = 'Transfer',
  FEES = 'Fees',
  INCOME = 'Income',
  OTHER = 'Other',
}

export interface Transaction {
  id: string;
  originalSms: string;
  bankName: string;
  amount: number;
  currency: string;
  type: TransactionType;
  date: string; // ISO string
  description: string;
  category: Category;
  isAiClassified: boolean;
}

export interface BankProfile {
  id: string;
  name: string;
  senderIds: string[]; // SMS Sender IDs (e.g., "CBE", "Dashen")
  currency: string;
}

export interface AppSettings {
  isOnboarded: boolean;
  selectedBanks: string[]; // IDs of selected banks
  currencySymbol: string;
}

export const INITIAL_SETTINGS: AppSettings = {
  isOnboarded: false,
  selectedBanks: [],
  currencySymbol: 'ETB',
};