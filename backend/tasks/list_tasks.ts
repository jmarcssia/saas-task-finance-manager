import { api } from "encore.dev/api";
import { Query } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { tasksDB } from "./db";
import type { Task, TaskStatus, TaskPriority } from "./types";

interface ListTasksParams {
  list_id?: Query<string>;
  status?: Query<TaskStatus>;
  priority?: Query<TaskPriority>;
  search?: Query<string>;
  tag?: Query<string>;
}

interface ListTasksResponse {
  tasks: Task[];
}

// Retrieves tasks with optional filtering.
export const listTasks = api<ListTasksParams, ListTasksResponse>(
  { auth: true, expose: true, method: "GET", path: "/tasks" },
  async (req) => {
    const auth = getAuthData()!;
    
    let whereConditions = ["t.user_id = $1"];
    const values: any[] = [auth.userID];
    let paramIndex = 2;
    
    if (req.list_id) {
      whereConditions.push(`t.list_id = $${paramIndex++}`);
      values.push(req.list_id);
    }
    
    if (req.status) {
      whereConditions.push(`t.status = $${paramIndex++}`);
      values.push(req.status);
    }
    
    if (req.priority) {
      whereConditions.push(`t.priority = $${paramIndex++}`);
      values.push(req.priority);
    }
    
    if (req.search) {
      whereConditions.push(`(t.title ILIKE $${paramIndex++} OR t.description ILIKE $${paramIndex++})`);
      values.push(`%${req.search}%`, `%${req.search}%`);
      paramIndex++;
    }
    
    if (req.tag) {
      whereConditions.push(`EXISTS (
        SELECT 1 FROM task_tag_assignments tta 
        JOIN task_tags tt ON tta.tag_id = tt.id 
        WHERE tta.task_id = t.id AND tt.name = $${paramIndex++}
      )`);
      values.push(req.tag);
    }
    
    const query = `
      SELECT t.*, 
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', s.id,
                   'user_id', s.user_id,
                   'task_id', s.task_id,
                   'title', s.title,
                   'completed', s.completed,
                   'completed_at', s.completed_at,
                   'created_at', s.created_at,
                   'updated_at', s.updated_at
                 ) ORDER BY s.created_at
               ) FILTER (WHERE s.id IS NOT NULL), 
               '[]'
             ) as subtasks,
             COALESCE(
               json_agg(
                 DISTINCT json_build_object(
                   'id', tt.id,
                   'user_id', tt.user_id,
                   'name', tt.name,
                   'color', tt.color,
                   'created_at', tt.created_at,
                   'updated_at', tt.updated_at
                 ) ORDER BY tt.name
               ) FILTER (WHERE tt.id IS NOT NULL),
               '[]'
             ) as tags
      FROM tasks t
      LEFT JOIN subtasks s ON t.id = s.task_id
      LEFT JOIN task_tag_assignments tta ON t.id = tta.task_id
      LEFT JOIN task_tags tt ON tta.tag_id = tt.id
      WHERE ${whereConditions.join(' AND ')}
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `;
    
    const rows = await tasksDB.rawQueryAll<Task>(query, ...values);
    
    return { tasks: rows };
  }
);
