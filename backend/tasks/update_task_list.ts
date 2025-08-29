import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";
import type { TaskList, UpdateTaskListRequest } from "./types";

interface UpdateTaskListParams {
  id: string;
}

// Updates an existing task list.
export const updateTaskList = api<UpdateTaskListParams & UpdateTaskListRequest, TaskList>(
  { auth: true, expose: true, method: "PUT", path: "/task-lists/:id" },
  async (req) => {
    const auth = getAuthData()!;
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (req.name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(req.name);
    }
    if (req.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(req.description);
    }
    if (req.color !== undefined) {
      updates.push(`color = $${paramIndex++}`);
      values.push(req.color);
    }
    
    if (updates.length === 0) {
      throw APIError.invalidArgument("no fields to update");
    }
    
    values.push(req.id, auth.userID);
    
    const row = await tasksDB.rawQueryRow<TaskList>(
      `UPDATE task_lists SET ${updates.join(', ')} 
       WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
       RETURNING *`,
      ...values
    );
    
    if (!row) {
      throw APIError.notFound("task list not found");
    }
    
    return row;
  }
);
