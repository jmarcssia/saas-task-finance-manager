import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { financeDB } from "./db";
import type { FinanceAccount, CreateAccountRequest } from "./types";

// Creates a new finance account.
export const createAccount = api<CreateAccountRequest, FinanceAccount>(
  { auth: true, expose: true, method: "POST", path: "/finance/accounts" },
  async (req) => {
    const auth = getAuthData()!;
    
    const row = await financeDB.queryRow<FinanceAccount>`
      INSERT INTO finance_accounts (user_id, name, type, balance, currency, description)
      VALUES (${auth.userID}, ${req.name}, ${req.type}, ${req.balance || 0}, ${req.currency || 'BRL'}, ${req.description || null})
      RETURNING *
    `;
    
    return row!;
  }
);
