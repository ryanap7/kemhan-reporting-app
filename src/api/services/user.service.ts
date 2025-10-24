import { API_ENDPOINTS } from "@/src/constants/api.constants";
import { api } from "../config/axios.config";
import { GetUsersResponse } from "../types";

export class UserService {
  static async getUsers(): Promise<GetUsersResponse> {
    const response = await api.get<GetUsersResponse>(
      API_ENDPOINTS.USER.GET_ALL
    );
    return response.data;
  }
}
