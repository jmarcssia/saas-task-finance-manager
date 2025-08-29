export type AccountType = "checking" | "savings" | "credit_card" | "cash" | "investment";
export type TransactionType = "income" | "expense" | "transfer";
export type TransactionStatus = "pending" | "completed" | "cancelled";
export type RecurrenceFrequency = "daily" | "weekly" | "monthly" | "yearly";

export interface FinanceAccount {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FinanceCategory {
  id: string;
  user_id: string;
  name: string;
  parent_id?: string;
  type: TransactionType;
  color: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceTag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceTransaction {
  id: string;
  user_id: string;
  account_id: string;
  to_account_id?: string;
  category_id?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  status: TransactionStatus;
  transaction_date: string;
  created_at: string;
  updated_at: string;
  tags?: FinanceTag[];
}

export interface FinanceBudget {
  id: string;
  user_id: string;
  category_id: string;
  amount: number;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
}

export interface FinanceRecurrence {
  id: string;
  user_id: string;
  account_id: string;
  to_account_id?: string;
  category_id?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  frequency: RecurrenceFrequency;
  start_date: string;
  end_date?: string;
  next_occurrence: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateAccountRequest {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
  description?: string;
}

export interface UpdateAccountRequest {
  name?: string;
  type?: AccountType;
  balance?: number;
  currency?: string;
  description?: string;
  is_active?: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  parent_id?: string;
  type: TransactionType;
  color?: string;
  icon?: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  parent_id?: string;
  color?: string;
  icon?: string;
}

export interface CreateTransactionRequest {
  account_id: string;
  to_account_id?: string;
  category_id?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  status?: TransactionStatus;
  transaction_date: string;
  tag_ids?: string[];
}

export interface UpdateTransactionRequest {
  account_id?: string;
  to_account_id?: string;
  category_id?: string;
  type?: TransactionType;
  amount?: number;
  description?: string;
  status?: TransactionStatus;
  transaction_date?: string;
  tag_ids?: string[];
}

export interface CreateBudgetRequest {
  category_id: string;
  amount: number;
  period_start: string;
  period_end: string;
}

export interface UpdateBudgetRequest {
  amount?: number;
  period_start?: string;
  period_end?: string;
}

export interface CreateRecurrenceRequest {
  account_id: string;
  to_account_id?: string;
  category_id?: string;
  type: TransactionType;
  amount: number;
  description?: string;
  frequency: RecurrenceFrequency;
  start_date: string;
  end_date?: string;
}

export interface UpdateRecurrenceRequest {
  account_id?: string;
  to_account_id?: string;
  category_id?: string;
  type?: TransactionType;
  amount?: number;
  description?: string;
  frequency?: RecurrenceFrequency;
  start_date?: string;
  end_date?: string;
  is_active?: boolean;
}
