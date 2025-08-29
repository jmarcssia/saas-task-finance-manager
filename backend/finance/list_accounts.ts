import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { financeDB } from "./db";
import type { FinanceAccount } from "./types";

interface ListAccountsResponse {
  accounts: FinanceAccount[];
}

// Retrieves all finance accounts for the authenticated user.
export const listAccounts = api<void, ListAccountsResponse>(
  { auth: true, expose: true, method: "GET", path: "/finance/accounts" },
  async () => {
    const auth = getAuthData()!;
    
    const rows = await financeDB.queryAll<FinanceAccount>`
      SELECT * FROM finance_accounts 
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
    `;
    
    return { accounts: rows };
  }
);
