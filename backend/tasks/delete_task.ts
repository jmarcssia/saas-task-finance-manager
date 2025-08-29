import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";

interface DeleteTaskParams {
  id: string;
}

// Deletes a task and all its subtasks.
export const deleteTask = api<DeleteTaskParams, void>(
  { auth: true, expose: true, method: "DELETE", path: "/tasks/:id" },
  async (req) => {
    const auth = getAuthData()!;
    
    const result = await tasksDB.queryRow<{ count: number }>`
      DELETE FROM tasks 
      WHERE id = ${req.id} AND user_id = ${auth.userID}
      RETURNING 1 as count
    `;
    
    if (!result) {
      throw APIError.notFound("task not found");
    }
  }
);
