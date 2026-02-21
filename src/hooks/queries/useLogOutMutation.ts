import { useMutation, useQueryClient } from "@tanstack/react-query";
import { requestLogOut } from "../../api";
import { QUERY_KEY_WHOAMI } from "./useWhoAmIQuery";

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestLogOut,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY_WHOAMI });
    },
  });
};
