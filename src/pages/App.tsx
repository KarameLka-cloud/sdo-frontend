import { JSX } from "react";
import { RouterProvider } from "react-router-dom";
import AppRoutes from "@/routes/AppRoutes.tsx";
import { Toaster } from "@/components/ui/shadcn/sonner";
import { ConfirmDialogProvider } from "@/components/ui/custom/ConfirmDialog";

function App(): JSX.Element {
  return (
    <ConfirmDialogProvider>
      <RouterProvider router={AppRoutes} />
      <Toaster />
    </ConfirmDialogProvider>
  );
}

export default App;
