import {useCallback} from "react";

type MutationWithUnwrap<Arg> = (arg: Arg) => { unwrap: () => Promise<unknown> };

export const useDelete = <Arg>(mutation: MutationWithUnwrap<Arg>,
    message = "Вы хотите удалить запись?"
) => {
    return useCallback(
        async (id: Arg) => {
            const isConfirm = confirm(message);
            if (!isConfirm) return;
            await mutation(id).unwrap();
        },
        [mutation, message]
    )
}
