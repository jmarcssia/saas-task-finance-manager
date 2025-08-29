import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";
import type { TaskList } from "./types";

interface ListTaskListsResponse {
  task_lists: TaskList[];
}

// Retrieves all task lists for the authenticated user.
export const listTaskLists = api<void, ListTaskListsResponse>(
  { auth: true, expose: true, method: "GET", path: "/task-lists" },
  async () => {
    const auth = getAuthData()!;
    
    const rows = await tasksDB.queryAll<TaskList>`
      SELECT * FROM task_lists 
      WHERE user_id = ${auth.userID}
      ORDER BY created_at DESC
    `;
    
    return { task_lists: rows };
  }
);
