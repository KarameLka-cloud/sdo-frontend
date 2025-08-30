import {useCallback} from "react";

export const useDelete = <T extends (id: number) => any>(
    mutation: T,
    message = "Вы хотите удалить запись?"
) => {
    return useCallback(
        async (id: Parameters<T>[0]) => {
            const isConfirm = confirm(message);
            if (!isConfirm) return;
            await mutation(id).unwrap();
        },
        [mutation, message]
    )
}
