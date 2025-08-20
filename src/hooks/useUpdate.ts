import {useCallback} from "react";

export const useUpdate = <T extends (args: any) => any>(
    mutation: T,
    message = "Вы хотите обновить запись?"
) => {
    return useCallback(
        async (args: Parameters<T>[0]) => {
            const isConfirm = confirm(message);
            if (!isConfirm) return;
            await mutation(args).unwrap();
        },
        [mutation, message]
    );
};
