import { API_ENDPOINTS } from "@/src/constants/api.constants";
import { api } from "../config/axios.config";
import {
  CreateTaskPayload,
  CreateTaskResponse,
  GetTaskByIdResponse,
  GetTasksResponse,
  UpdateProgressResponse,
} from "../types";

export class TaskService {
  static async createTask(
    data: CreateTaskPayload
  ): Promise<CreateTaskResponse> {
    const response = await api.post<CreateTaskResponse>(
      API_ENDPOINTS.TASK.CREATE,
      data
    );
    return response.data;
  }

  static async getTasks(): Promise<GetTasksResponse> {
    const response = await api.get<GetTasksResponse>(
      API_ENDPOINTS.TASK.GET_ALL
    );
    return response.data;
  }

  static async getTaskById(taskId: string): Promise<GetTaskByIdResponse> {
    const response = await api.get<GetTaskByIdResponse>(
      API_ENDPOINTS.TASK.GET_BY_ID(taskId)
    );
    return response.data;
  }

  static async updateProgress(
    taskId: string,
    checklistId: string,
    payload: any
  ): Promise<UpdateProgressResponse> {
    const response = await api.patch<UpdateProgressResponse>(
      API_ENDPOINTS.TASK.UPDATE_PROGRESS(taskId, checklistId),
      payload
    );
    return response.data;
  }
}
