import { useCallback, useState } from "react";
import { Pagination, showMessageError, User, UserService } from "../api";

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const getUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await UserService.getUsers();

      const { data, pagination } = response.data;

      setUsers(data);
      setPagination(pagination);
    } catch (error) {
      showMessageError(error, "Gagal Ambil User");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    users,
    pagination,
    isLoading,
    getUsers,
  };
};
