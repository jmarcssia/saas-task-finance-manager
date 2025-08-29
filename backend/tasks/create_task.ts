import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";
import type { Task, CreateTaskRequest } from "./types";

// Creates a new task.
export const createTask = api<CreateTaskRequest, Task>(
  { auth: true, expose: true, method: "POST", path: "/tasks" },
  async (req) => {
    const auth = getAuthData()!;
    
    await tasksDB.begin();
    
    try {
      const task = await tasksDB.queryRow<Task>`
        INSERT INTO tasks (user_id, list_id, title, description, priority, due_date)
        VALUES (${auth.userID}, ${req.list_id || null}, ${req.title}, ${req.description || null}, ${req.priority || 'medium'}, ${req.due_date || null})
        RETURNING *
      `;
      
      if (req.tag_ids && req.tag_ids.length > 0) {
        for (const tagId of req.tag_ids) {
          await tasksDB.exec`
            INSERT INTO task_tag_assignments (task_id, tag_id)
            VALUES (${task!.id}, ${tagId})
          `;
        }
      }
      
      return task!;
    } catch (error) {
      throw error;
    }
  }
);
