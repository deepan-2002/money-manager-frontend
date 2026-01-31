export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
}

export interface Account {
  _id: string;
  name: string;
  type: string;
  balance: number;
  currency: string;
  user: string;
  createdAt: string;
  updatedAt: string;
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