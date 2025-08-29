import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";
import type { TaskTag, CreateTaskTagRequest } from "./types";

// Creates a new task tag.
export const createTaskTag = api<CreateTaskTagRequest, TaskTag>(
  { auth: true, expose: true, method: "POST", path: "/task-tags" },
  async (req) => {
    const auth = getAuthData()!;
    
    const row = await tasksDB.queryRow<TaskTag>`
      INSERT INTO task_tags (user_id, name, color)
      VALUES (${auth.userID}, ${req.name}, ${req.color || '#6B7280'})
      RETURNING *
    `;
    
    return row!;
  }
);
