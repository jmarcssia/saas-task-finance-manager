import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { financeDB } from "./db";
import type { FinanceCategory, CreateCategoryRequest } from "./types";

// Creates a new finance category.
export const createCategory = api<CreateCategoryRequest, FinanceCategory>(
  { auth: true, expose: true, method: "POST", path: "/finance/categories" },
  async (req) => {
    const auth = getAuthData()!;
    
    const row = await financeDB.queryRow<FinanceCategory>`
      INSERT INTO finance_categories (user_id, name, parent_id, type, color, icon)
      VALUES (${auth.userID}, ${req.name}, ${req.parent_id || null}, ${req.type}, ${req.color || '#6B7280'}, ${req.icon || null})
      RETURNING *
    `;
    
    return row!;
  }
);
