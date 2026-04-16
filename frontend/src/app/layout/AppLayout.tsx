import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div>
      {/* Will add navbar/sidebar/footer etc... later*/}
      <Outlet />
    </div>
  );
}
