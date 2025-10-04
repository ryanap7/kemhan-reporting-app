import {
  showMessageError,
  StatisticsData,
  StatisticService,
  StuckTask,
} from "@/src/api";
import { useCallback, useState } from "react";

export function useStatistics() {
  const [stucks, setStucks] = useState<StuckTask[] | null>([]);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const getStatistics = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await StatisticService.getStatistics();

      const { data } = response;

      setStatistics(data);
    } catch (error) {
      showMessageError(error, "Gagal Ambil Data Statistik");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getStuckTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await StatisticService.getStuckTask();

      const { data } = response;

      setStucks(data);
    } catch (error) {
      showMessageError(error, "Gagal Ambil Data Statistik");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    statistics,
    stucks,
    isLoading,

    // Operations
    getStatistics,
    getStuckTasks,
  };
}
