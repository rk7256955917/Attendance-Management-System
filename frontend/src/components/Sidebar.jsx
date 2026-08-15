import {
  UsersRound,
  LayoutDashboard,
  UserPlus,
  ClipboardCheck,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

const Sidebar = ({ onNavigate, activePage }) => {
  return (
    <aside className="w-57 h-full bg-slate-900 text-white p-4 ml-3 rounded-l-xl flex flex-col">

      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <UsersRound size={32} className="text-blue-400" />

        <div>
          <h2 className="text-xl font-bold">AMS</h2>

          <p className="text-sm text-slate-300">
            Attendance System
          </p>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-2">

        {/* Dashboard */}
        <button
          onClick={() => onNavigate("dashboard")}
          className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg ${
            activePage === "dashboard"
              ? "bg-blue-600"
              : "hover:bg-blue-600"
          }`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </button>

        {/* Add Student */}
        <button
          onClick={() => onNavigate("addStudent")}
          className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg ${
            activePage === "addStudent"
              ? "bg-blue-600"
              : "hover:bg-blue-600"
          }`}
        >
          <UserPlus size={18} />
          Add Student
        </button>

        {/* Mark Attendance */}
        <button
          onClick={() => onNavigate("attendance")}
          className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg ${
            activePage === "attendance"
              ? "bg-blue-600"
              : "hover:bg-blue-600"
          }`}
        >
          <ClipboardCheck size={18} />
          Mark Attendance
        </button>

        {/* Attendance Records */}
        <button
          onClick={() => onNavigate("records")}
          className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg ${
            activePage === "records"
              ? "bg-blue-600"
              : "hover:bg-blue-600"
          }`}
        >
          <FileText size={18} />
          Attendance Records
        </button>

        {/* Reports */}
        <button
          onClick={() => onNavigate("reports")}
          className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg ${
            activePage === "reports"
              ? "bg-blue-600"
              : "hover:bg-blue-600"
          }`}
        >
          <BarChart3 size={18} />
          Reports
        </button>

        {/* Settings */}
        <button
          onClick={() => onNavigate("settings")}
          className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg ${
            activePage === "settings"
              ? "bg-blue-600"
              : "hover:bg-blue-600"
          }`}
        >
          <Settings size={18} />
          Settings
        </button>

      </nav>

      {/* Logout */}
      <button className="mt-auto w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg hover:bg-red-600">
        <LogOut size={18} />
        Logout
      </button>

    </aside>
  );
};

export default Sidebar;