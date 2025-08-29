import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";
import type { TaskTag } from "./types";

interface ListTaskTagsResponse {
  tags: TaskTag[];
}

// Retrieves all task tags for the authenticated user.
export const listTaskTags = api<void, ListTaskTagsResponse>(
  { auth: true, expose: true, method: "GET", path: "/task-tags" },
  async () => {
    const auth = getAuthData()!;
    
    const rows = await tasksDB.queryAll<TaskTag>`
      SELECT * FROM task_tags 
      WHERE user_id = ${auth.userID}
      ORDER BY name
    `;
    
    return { tags: rows };
  }
);
