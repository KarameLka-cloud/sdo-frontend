import { JSX } from "react";
import { RouterProvider } from "react-router-dom";
import AppRoutes from "@routes/AppRoutes.tsx";
import { Toaster } from "@/components/ui/sonner";

function App(): JSX.Element {
  return (
    <>
      <RouterProvider router={AppRoutes} />
      <Toaster />
    </>
  );
}

export default App;
