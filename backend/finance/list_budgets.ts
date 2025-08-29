import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { financeDB } from "./db";
import type { FinanceBudget } from "./types";

interface ListBudgetsParams {
  period_start?: Query<string>;
  period_end?: Query<string>;
}

interface ListBudgetsResponse {
  budgets: FinanceBudget[];
}

// Retrieves finance budgets with optional period filtering.
export const listBudgets = api<ListBudgetsParams, ListBudgetsResponse>(
  { auth: true, expose: true, method: "GET", path: "/finance/budgets" },
  async (req) => {
    const auth = getAuthData()!;
    
    let whereConditions = ["user_id = $1"];
    const values: any[] = [auth.userID];
    let paramIndex = 2;
    
    if (req.period_start) {
      whereConditions.push(`period_start >= $${paramIndex++}`);
      values.push(req.period_start);
    }
    
    if (req.period_end) {
      whereConditions.push(`period_end <= $${paramIndex++}`);
      values.push(req.period_end);
    }
    
    const query = `
      SELECT * FROM finance_budgets 
      WHERE ${whereConditions.join(' AND ')}
      ORDER BY period_start DESC, created_at DESC
    `;
    
    const rows = await financeDB.rawQueryAll<FinanceBudget>(query, ...values);
    
    return { budgets: rows };
  }
);
