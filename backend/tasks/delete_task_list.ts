import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";

interface DeleteTaskListParams {
  id: string;
}

// Deletes a task list and all its tasks.
export const deleteTaskList = api<DeleteTaskListParams, void>(
  { auth: true, expose: true, method: "DELETE", path: "/task-lists/:id" },
  async (req) => {
    const auth = getAuthData()!;
    
    const result = await tasksDB.queryRow<{ count: number }>`
      DELETE FROM task_lists 
      WHERE id = ${req.id} AND user_id = ${auth.userID}
      RETURNING 1 as count
    `;
    
    if (!result) {
      throw APIError.notFound("task list not found");
    }
  }
);
