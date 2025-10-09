import { ApiResponse } from ".";

export interface TotalTasks {
  count: number;
  thisMonth: number;
}

export interface CompletedTasks {
  count: number;
  percentage: number;
}

export interface InProgressTasks {
  count: number;
  percentage: number;
}

export interface StuckTasks {
  count: number;
  thisMonth: number;
}

export interface PendingDispositionTasks {
  count: number;
  thisMonth: number;
}

export interface SubditStatistics {
  name: string;
  subdit: string;
  total: number;
  completed: number;
  inProgress: number;
  stuck: number;
  lastUpdate: string;
}

export interface StatisticsData {
  totalTasks: TotalTasks;
  completedTasks: CompletedTasks;
  inProgressTasks: InProgressTasks;
  stuckTasks: StuckTasks;
  pendingDispositionTasks: PendingDispositionTasks;
  bySubdit: SubditStatistics[];
}

export type GetStatisticsResponse = ApiResponse<StatisticsData>;

export interface StuckTask {
  id: string;
  title: string;
  subdit: string;
  assignee: string;
  stuckProgress: string;
  totalProgress: number;
  stuckSince: string;
  stuckDays: number;
}

export type GetStuckTasksResponse = ApiResponse<StuckTask[]>;
