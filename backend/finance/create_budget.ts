import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { financeDB } from "./db";
import type { FinanceBudget, CreateBudgetRequest } from "./types";

// Creates a new finance budget.
export const createBudget = api<CreateBudgetRequest, FinanceBudget>(
  { auth: true, expose: true, method: "POST", path: "/finance/budgets" },
  async (req) => {
    const auth = getAuthData()!;
    
    const row = await financeDB.queryRow<FinanceBudget>`
      INSERT INTO finance_budgets (user_id, category_id, amount, period_start, period_end)
      VALUES (${auth.userID}, ${req.category_id}, ${req.amount}, ${req.period_start}, ${req.period_end})
      RETURNING *
    `;
    
    return row!;
  }
);
