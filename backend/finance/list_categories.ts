import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { financeDB } from "./db";
import type { FinanceCategory, TransactionType } from "./types";

interface ListCategoriesParams {
  type?: Query<TransactionType>;
}

interface ListCategoriesResponse {
  categories: FinanceCategory[];
}

// Retrieves finance categories with optional type filtering.
export const listCategories = api<ListCategoriesParams, ListCategoriesResponse>(
  { auth: true, expose: true, method: "GET", path: "/finance/categories" },
  async (req) => {
    const auth = getAuthData()!;
    
    let query = `
      SELECT * FROM finance_categories 
      WHERE user_id = $1
    `;
    const values: any[] = [auth.userID];
    
    if (req.type) {
      query += ` AND type = $2`;
      values.push(req.type);
    }
    
    query += ` ORDER BY name`;
    
    const rows = await financeDB.rawQueryAll<FinanceCategory>(query, ...values);
    
    return { categories: rows };
  }
);
