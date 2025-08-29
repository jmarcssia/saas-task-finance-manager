import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";
import type { Task, UpdateTaskRequest } from "./types";

interface UpdateTaskParams {
  id: string;
}

// Updates an existing task.
export const updateTask = api<UpdateTaskParams & UpdateTaskRequest, Task>(
  { auth: true, expose: true, method: "PUT", path: "/tasks/:id" },
  async (req) => {
    const auth = getAuthData()!;
    
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;
    
    if (req.list_id !== undefined) {
      updates.push(`list_id = $${paramIndex++}`);
      values.push(req.list_id);
    }
    if (req.title !== undefined) {
      updates.push(`title = $${paramIndex++}`);
      values.push(req.title);
    }
    if (req.description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(req.description);
    }
    if (req.priority !== undefined) {
      updates.push(`priority = $${paramIndex++}`);
      values.push(req.priority);
    }
    if (req.status !== undefined) {
      updates.push(`status = $${paramIndex++}`);
      values.push(req.status);
      if (req.status === 'completed') {
        updates.push(`completed_at = NOW()`);
      } else {
        updates.push(`completed_at = NULL`);
      }
    }
    if (req.due_date !== undefined) {
      updates.push(`due_date = $${paramIndex++}`);
      values.push(req.due_date);
    }
    
    if (updates.length === 0 && !req.tag_ids) {
      throw APIError.invalidArgument("no fields to update");
    }
    
    if (updates.length > 0) {
      values.push(req.id, auth.userID);
      
      const task = await tasksDB.rawQueryRow<Task>(
        `UPDATE tasks SET ${updates.join(', ')} 
         WHERE id = $${paramIndex++} AND user_id = $${paramIndex++}
         RETURNING *`,
        ...values
      );
      
      if (!task) {
        throw APIError.notFound("task not found");
      }
    }
    
    if (req.tag_ids !== undefined) {
      await tasksDB.exec`
        DELETE FROM task_tag_assignments 
        WHERE task_id = ${req.id}
      `;
      
      for (const tagId of req.tag_ids) {
        await tasksDB.exec`
          INSERT INTO task_tag_assignments (task_id, tag_id)
          VALUES (${req.id}, ${tagId})
        `;
      }
    }
    
    const updatedTask = await tasksDB.queryRow<Task>`
      SELECT * FROM tasks 
      WHERE id = ${req.id} AND user_id = ${auth.userID}
    `;
    
    return updatedTask!;
  }
);
