import { useCallback } from "react";

type MutationWithUnwrap<Arg> = (arg: Arg) => { unwrap: () => Promise<unknown> };

export const useUpdate = <Arg>(
  mutation: MutationWithUnwrap<Arg>,
  message = "Вы хотите обновить запись?",
) => {
  return useCallback(
    async (args: Arg) => {
      const isConfirm = confirm(message);
      if (!isConfirm) return;
      await mutation(args).unwrap();
    },
    [mutation, message],
  );
};
