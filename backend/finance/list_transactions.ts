import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { financeDB } from "./db";
import type { FinanceTransaction, TransactionType, TransactionStatus } from "./types";

interface ListTransactionsParams {
  account_id?: Query<string>;
  category_id?: Query<string>;
  type?: Query<TransactionType>;
  status?: Query<TransactionStatus>;
  start_date?: Query<string>;
  end_date?: Query<string>;
  limit?: Query<number>;
  offset?: Query<number>;
}

interface ListTransactionsResponse {
  transactions: FinanceTransaction[];
  total: number;
}

// Retrieves finance transactions with optional filtering and pagination.
export const listTransactions = api<ListTransactionsParams, ListTransactionsResponse>(
  { auth: true, expose: true, method: "GET", path: "/finance/transactions" },
  async (req) => {
    const auth = getAuthData()!;
    
    let whereConditions = ["t.user_id = $1"];
    const values: any[] = [auth.userID];
    let paramIndex = 2;
    
    if (req.account_id) {
      whereConditions.push(`(t.account_id = $${paramIndex++} OR t.to_account_id = $${paramIndex++})`);
      values.push(req.account_id, req.account_id);
    }
    
    if (req.category_id) {
      whereConditions.push(`t.category_id = $${paramIndex++}`);
      values.push(req.category_id);
    }
    
    if (req.type) {
      whereConditions.push(`t.type = $${paramIndex++}`);
      values.push(req.type);
    }
    
    if (req.status) {
      whereConditions.push(`t.status = $${paramIndex++}`);
      values.push(req.status);
    }
    
    if (req.start_date) {
      whereConditions.push(`t.transaction_date >= $${paramIndex++}`);
      values.push(req.start_date);
    }
    
    if (req.end_date) {
      whereConditions.push(`t.transaction_date <= $${paramIndex++}`);
      values.push(req.end_date);
    }
    
    const whereClause = whereConditions.join(' AND ');
    
    // Count total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM finance_transactions t
      WHERE ${whereClause}
    `;
    
    const countResult = await financeDB.rawQueryRow<{ total: number }>(countQuery, ...values);
    const total = countResult?.total || 0;
    
    // Get transactions with tags
    const limit = req.limit || 50;
    const offset = req.offset || 0;
    
    const query = `
      SELECT t.*,
             COALESCE(
               json_agg(
                 DISTINCT json_build_object(
                   'id', ft.id,
                   'user_id', ft.user_id,
                   'name', ft.name,
                   'color', ft.color,
                   'created_at', ft.created_at,
                   'updated_at', ft.updated_at
                 ) ORDER BY ft.name
               ) FILTER (WHERE ft.id IS NOT NULL),
               '[]'
             ) as tags
      FROM finance_transactions t
      LEFT JOIN finance_transaction_tags ftt ON t.id = ftt.transaction_id
      LEFT JOIN finance_tags ft ON ftt.tag_id = ft.id
      WHERE ${whereClause}
      GROUP BY t.id
      ORDER BY t.transaction_date DESC, t.created_at DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    
    values.push(limit, offset);
    
    const rows = await financeDB.rawQueryAll<FinanceTransaction>(query, ...values);
    
    return { transactions: rows, total };
  }
);
