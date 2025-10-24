import { ApiResponse } from ".";

export interface CreateTaskPayload {
  title: string;
  description: string;
  priority: number;
  dueDate: string;
}

export interface DispositionTaskPayload {
  assignedToRole: string;
  dispositionNote: string;
}

export type CreateTaskResponse = ApiResponse<null>;

export interface TaskCreator {
  id: string;
  name: string;
  username: string;
}

export interface ChecklistItem {
  id: string;
  taskId: string;
  title: string;
  description: string;
  order: number;
  status: "NOT_STARTED" | "IN_PROGRESS" | "BLOCKED" | "COMPLETED";
  startedAt: string | null;
  completedAt: string | null;
  blockedNote: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskProgress {
  total: number;
  completed: number;
  percentage: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status:
    | "DRAFT"
    | "DISPOSITIONED"
    | "IN_PROGRESS"
    | "STUCK"
    | "COMPLETED"
    | "CANCELLED";
  priority: number;
  creatorId: string;
  creator: TaskUser;
  assignedToId?: string | null;
  assignedTo?: TaskUser | null;
  assignedToRole?: string | null;
  ccUsers?: TaskUser[];
  dispositionNote?: string | null;
  dispositionedAt?: string | null;
  dispositionedBy?: string | null;
  dispositioner?: TaskUser | null;
  subditRole?: string | null;
  startDate: string | null;
  dueDate: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  checklistItems: ChecklistItem[];
  progress: TaskProgress;
}

export interface TaskUser {
  id: string;
  name: string;
  email: string;
  role: string;
  addedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetTasksData {
  data: Task[];
  pagination: Pagination;
}

export type GetTasksResponse = ApiResponse<GetTasksData>;

export interface UpdateProgressPayload {
  status: string;
  blockedNote?: string;
}

export type UpdateProgressResponse = ApiResponse<null>;

export type GetTaskByIdResponse = ApiResponse<Task>;
