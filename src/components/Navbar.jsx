import { CalendarCheck } from "lucide-react";

const Navbar = () => {
  return (
    <header className="w-full py-6">
      <div className="flex items-center justify-center gap-4">
        
        <CalendarCheck className="w-10 h-10 text-blue-600" />

        <h1 className="text-2xl md:text-4xl font-bold text-slate-900">
          Attendance Management System
        </h1>

      </div>
    </header>
  );
};

export default Navbar;