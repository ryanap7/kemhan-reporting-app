import { ApiResponse, Pagination } from ".";

export interface User {
  id: string;
  username: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersData {
  data: User[];
  pagination: Pagination;
}

export type GetUsersResponse = ApiResponse<UsersData>;
