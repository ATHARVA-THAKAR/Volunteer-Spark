import { Outlet } from "react-router-dom";
import AppNavbar from "@/components/AppNavbar";

const AppLayout = () => (
  <div className="min-h-screen bg-background">
    <AppNavbar />
    <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
      <Outlet />
    </main>
  </div>
);

export default AppLayout;
