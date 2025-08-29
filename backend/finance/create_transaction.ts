import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { financeDB } from "./db";
import type { FinanceTransaction, CreateTransactionRequest } from "./types";

// Creates a new finance transaction.
export const createTransaction = api<CreateTransactionRequest, FinanceTransaction>(
  { auth: true, expose: true, method: "POST", path: "/finance/transactions" },
  async (req) => {
    const auth = getAuthData()!;
    
    const transaction = await financeDB.queryRow<FinanceTransaction>`
      INSERT INTO finance_transactions (
        user_id, account_id, to_account_id, category_id, type, amount, 
        description, status, transaction_date
      )
      VALUES (
        ${auth.userID}, ${req.account_id}, ${req.to_account_id || null}, 
        ${req.category_id || null}, ${req.type}, ${req.amount}, 
        ${req.description || null}, ${req.status || 'completed'}, ${req.transaction_date}
      )
      RETURNING *
    `;
    
    if (req.tag_ids && req.tag_ids.length > 0) {
      for (const tagId of req.tag_ids) {
        await financeDB.exec`
          INSERT INTO finance_transaction_tags (transaction_id, tag_id)
          VALUES (${transaction!.id}, ${tagId})
        `;
      }
    }
    
    return transaction!;
  }
);
