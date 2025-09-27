// ===== 3. UPDATED AdminLayout.jsx =====
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function AdminLayout() {
  const layoutStyles = {
    backgroundColor: 'var(--bg-secondary)',
    color: 'var(--text-primary)',
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main 
        className="flex-1 overflow-y-auto p-6"
        style={layoutStyles}
      >
        <Outlet />
      </main>
    </div>
  );
}