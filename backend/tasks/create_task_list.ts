import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";
import type { TaskList, CreateTaskListRequest } from "./types";

// Creates a new task list.
export const createTaskList = api<CreateTaskListRequest, TaskList>(
  { auth: true, expose: true, method: "POST", path: "/task-lists" },
  async (req) => {
    const auth = getAuthData()!;
    
    const row = await tasksDB.queryRow<TaskList>`
      INSERT INTO task_lists (user_id, name, description, color)
      VALUES (${auth.userID}, ${req.name}, ${req.description || null}, ${req.color || '#3B82F6'})
      RETURNING *
    `;
    
    return row!;
  }
);
