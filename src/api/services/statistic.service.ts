import { API_ENDPOINTS } from "@/src/constants/api.constants";
import { api } from "../config/axios.config";
import {
  GetStatisticsResponse,
  GetStuckTasksResponse,
} from "../types/statistic.types";

export class StatisticService {
  static async getStatistics(): Promise<GetStatisticsResponse> {
    const response = await api.get<GetStatisticsResponse>(
      API_ENDPOINTS.MONITOR.STATISTIC
    );
    return response.data;
  }

  static async getStuckTask(): Promise<GetStuckTasksResponse> {
    const response = await api.get<GetStuckTasksResponse>(
      API_ENDPOINTS.MONITOR.STUCK
    );
    return response.data;
  }
}
