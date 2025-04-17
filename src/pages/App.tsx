import { JSX } from "react";
import { RouterProvider } from "react-router-dom";
import AppRoutes from "../routes/AppRoutes.tsx";

function App(): JSX.Element {
  return <RouterProvider router={AppRoutes} />;
}

export default App;
