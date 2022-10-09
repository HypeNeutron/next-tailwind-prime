import axios from "axios";
import { useMutation, useQueryClient } from "react-query";

export function usePostAPI(key, url) {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      const { data } = await axios.post(url, payload);
      return data;
    },
    { onSuccess: () => queryClient.invalidateQueries(key) }
  );
}

export function usePatchAPI(key, url) {
  const queryClient = useQueryClient();
  return useMutation(
    async (payload) => {
      await axios.patch(url, payload);
    },
    {
      onSuccess: () => {
        if (key instanceof Array) {
          key.map((item) => queryClient.invalidateQueries(item));
          return;
        }
        return queryClient.invalidateQueries(key);
      },
    }
  );
}

export function useDeleteAPI(key, url) {
  const queryClient = useQueryClient();
  return useMutation(
    async (id) => {
      await axios.delete(`${url}/${id}`);
    },
    { onSuccess: () => queryClient.invalidateQueries(key) }
  );
}
