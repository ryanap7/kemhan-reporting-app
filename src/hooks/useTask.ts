import {
  CreateTaskPayload,
  DispositionTaskPayload,
  Pagination,
  showMessageError,
  Task,
  TaskService,
  UpdateProgressPayload,
} from "@/src/api";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Keyboard } from "react-native";

export function useTask() {
  const [task, setTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[] | []>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const createTask = useCallback(async (payload: CreateTaskPayload) => {
    Keyboard.dismiss();
    setIsLoading(true);

    try {
      const response = await TaskService.createTask(payload);

      const { message } = response;

      if (response.success) {
        Alert.alert("Berhasil", message || "Tugas berhasil dibuat", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
      }
    } catch (error) {
      showMessageError(error, "Gagal Membuat Tugas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const dispositionTask = useCallback(
    async (taskId: string, payload: DispositionTaskPayload) => {
      Keyboard.dismiss();
      setIsLoading(true);

      try {
        const response = await TaskService.dispositionTask(taskId, payload);

        const { message } = response;

        if (response.success) {
          Alert.alert("Berhasil", message, [
            {
              text: "OK",
              onPress: () => router.back(),
            },
          ]);
        }
      } catch (error) {
        showMessageError(error, "Gagal Disposisikan Tugas");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await TaskService.getTasks();

      const { data, pagination } = response.data;

      setTasks(data);
      setPagination(pagination);
    } catch (error) {
      showMessageError(error, "Gagal Ambil Data Tugas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDraftTasks = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await TaskService.getDraftTasks();

      const { data, pagination } = response.data;

      setTasks(data);
      setPagination(pagination);
    } catch (error) {
      showMessageError(error, "Gagal Ambil Data Draft Tugas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTasksBySubdit = useCallback(async (subditRole: string) => {
    setIsLoading(true);

    try {
      const response = await TaskService.getTasksBySubdit(subditRole);

      const { data, pagination } = response.data;

      setTasks(data);
      setPagination(pagination);
    } catch (error) {
      showMessageError(error, "Gagal Ambil Data Tugas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTaskById = useCallback(async (taskId: string) => {
    setIsLoading(true);

    try {
      const response = await TaskService.getTaskById(taskId);

      const { data } = response;

      setTask(data);
    } catch (error) {
      showMessageError(error, "Gagal Ambil Data Tugas");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProgress = useCallback(
    async (
      taskId: string,
      checklistId: string,
      payload: UpdateProgressPayload
    ) => {
      setIsLoading(true);

      try {
        const response = await TaskService.updateProgress(
          taskId,
          checklistId,
          payload
        );

        const { success } = response;

        if (success) {
          getTaskById(taskId);
        }
      } catch (error) {
        showMessageError(error, "Gagal Memperbarui Tugas");
      } finally {
        setIsLoading(false);
      }
    },
    [getTaskById]
  );

  return {
    // State
    task,
    tasks,
    pagination,
    isLoading,

    // Operations
    getTasks,
    getDraftTasks,
    getTasksBySubdit,
    getTaskById,
    createTask,
    dispositionTask,
    updateProgress,
  };
}
