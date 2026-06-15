import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
