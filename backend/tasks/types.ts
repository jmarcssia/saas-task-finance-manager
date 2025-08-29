export type TaskPriority = "low" | "medium" | "high" | "urgent";
export type TaskStatus = "pending" | "in_progress" | "completed" | "cancelled";

export interface TaskList {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  list_id?: string;
  title: string;
  description?: string;
  priority: TaskPriority;
  status: TaskStatus;
  due_date?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
  tags?: TaskTag[];
}

export interface Subtask {
  id: string;
  user_id: string;
  task_id: string;
  title: string;
  completed: boolean;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface TaskTag {
  id: string;
  user_id: string;
  name: string;
  color: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskListRequest {
  name: string;
  description?: string;
  color?: string;
}

export interface UpdateTaskListRequest {
  name?: string;
  description?: string;
  color?: string;
}

export interface CreateTaskRequest {
  list_id?: string;
  title: string;
  description?: string;
  priority?: TaskPriority;
  due_date?: string;
  tag_ids?: string[];
}

export interface UpdateTaskRequest {
  list_id?: string;
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  due_date?: string;
  tag_ids?: string[];
}

export interface CreateSubtaskRequest {
  title: string;
}

export interface UpdateSubtaskRequest {
  title?: string;
  completed?: boolean;
}

export interface CreateTaskTagRequest {
  name: string;
  color?: string;
}

export interface UpdateTaskTagRequest {
  name?: string;
  color?: string;
}
