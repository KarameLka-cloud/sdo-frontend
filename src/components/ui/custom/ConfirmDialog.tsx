import { ReactNode, useCallback, useRef, useState } from "react";
import { TriangleAlertIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/shadcn/alert-dialog";
import { Button } from "@/components/ui/shadcn/button";
import { ConfirmContext, ConfirmOptions } from "@/hooks/useConfirm.ts";

export function ConfirmDialogProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);
  const openTimeoutRef = useRef<number | null>(null);

  const finish = useCallback((value: boolean) => {
    if (openTimeoutRef.current != null) {
      window.clearTimeout(openTimeoutRef.current);
      openTimeoutRef.current = null;
    }
    resolveRef.current?.(value);
    resolveRef.current = null;
    setOptions(null);
  }, []);

  const confirm = useCallback((nextOptions: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      if (openTimeoutRef.current != null) {
        window.clearTimeout(openTimeoutRef.current);
      }
      resolveRef.current?.(false);
      resolveRef.current = resolve;
      // Let dropdown menus close before the dialog takes focus.
      openTimeoutRef.current = window.setTimeout(() => {
        openTimeoutRef.current = null;
        setOptions(nextOptions);
      }, 0);
    });
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      <AlertDialog
        open={options != null}
        onOpenChange={(open) => {
          if (!open) finish(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive">
              <TriangleAlertIcon />
            </AlertDialogMedia>
            <AlertDialogTitle>{options?.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {options?.description ?? "Это действие нельзя отменить."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {options?.cancelLabel ?? "Отмена"}
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              onClick={() => finish(true)}
            >
              {options?.confirmLabel ?? "Удалить"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  );
}
