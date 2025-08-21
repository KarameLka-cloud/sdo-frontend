import {useCallback} from "react";

export const useDelete = <T extends (id: number) => any>(
    mutation: T,
    message = "Вы хотите удалить запись?"
) => {
    return useCallback(
        async (id: Parameters<T>[0]) => {
            const isConfirm = confirm(message);
            if (!isConfirm) return;
            // try {
            await mutation(id).unwrap();
            // } catch (e) {
            //     console.error("Ошибка при выполнении мутации:", e);
            // }
        },
        [mutation, message]
    )
}
