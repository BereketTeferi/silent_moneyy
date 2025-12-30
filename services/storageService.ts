import { AppSettings, INITIAL_SETTINGS, Transaction } from '../types';

const KEYS = {
  SETTINGS: 'silent_money_settings',
  TRANSACTIONS: 'silent_money_transactions',
};

export const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

export const getSettings = (): AppSettings => {
  const data = localStorage.getItem(KEYS.SETTINGS);
  return data ? JSON.parse(data) : INITIAL_SETTINGS;
};

export const saveTransactions = (transactions: Transaction[]) => {
  localStorage.setItem(KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const getTransactions = (): Transaction[] => {
  const data = localStorage.getItem(KEYS.TRANSACTIONS);
  return data ? JSON.parse(data) : [];
};

export const addTransaction = (transaction: Transaction): Transaction[] => {
  const current = getTransactions();
  const updated = [transaction, ...current];
  saveTransactions(updated);
  return updated;
};

export const updateTransaction = (updatedTx: Transaction): Transaction[] => {
    const current = getTransactions();
    const updated = current.map(tx => tx.id === updatedTx.id ? updatedTx : tx);
    saveTransactions(updated);
    return updated;
};