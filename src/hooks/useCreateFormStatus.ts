import { useState } from "react";
import { FORM_STATUS_MESSAGES } from "@/constants/formStatus.ts";
import type { FormActionStatusType } from "@/components/ui/custom/FormActionStatus";

export function useCreateFormStatus() {
  const [type, setType] = useState<FormActionStatusType>("idle");
  const [message, setMessage] = useState("");

  const submit = async (action: () => Promise<void>, reset: () => void) => {
    setType("loading");
    setMessage(FORM_STATUS_MESSAGES.createLoading);

    try {
      await action();
      reset();
      setType("success");
      setMessage(FORM_STATUS_MESSAGES.createSuccess);
    } catch {
      setType("error");
      setMessage(FORM_STATUS_MESSAGES.createError);
    }
  };

  return { type, message, submit };
}
