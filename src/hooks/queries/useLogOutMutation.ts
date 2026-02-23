import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestLogOut } from "../../api";
import { QUERY_KEY_WHOAMI } from "./useWhoAmIQuery";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestLogOut,
    onSuccess: () => {
      queryClient.setQueryData(QUERY_KEY_WHOAMI, null);
      queryClient.removeQueries({ queryKey: QUERY_KEY_WHOAMI });
    },
  });
};
