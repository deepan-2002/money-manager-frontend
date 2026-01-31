export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Account {
  _id: string;
  userId: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface CreateAccountDto {
  name: string;
  type: string;
  balance: number;
  currency: string;
}

export interface UpdateAccountDto {
  name?: string;
  type?: string;
  balance?: number;
  currency?: string;
}

export interface Transaction {
  _id: string;
  userId: string;
  accountId: string | Account;
  type: string;
  amount: number;
  category: string;
  division: string;
  description: string;
  date: string;
  toAccountId: string;
  transferType: string;
  isEditable: boolean;
}

export interface CreateTransactionDto {
  accountId: string,
  type: string,
  amount: number,
  category: string,
  division: string,
  description: string,
  date: string,
  toAccountId: string
}

export interface UpdateTransactionDto {
  accountId: string,
  type: string,
  amount: number,
  category: string,
  division: string,
  description: string,
  date: string,
  toAccountId: string
}

export interface CategorySummary {
  category: string;
  amount: number;
}
