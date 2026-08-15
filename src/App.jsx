import { useState } from "react";

import Sidebar from "./components/Sidebar";
import AddStudent from "./components/AddStudent";
import Attendance from "./components/Attendance";

function App() {

  // Saare students yahan store honge
  const [students, setStudents] = useState([]);

  // Kaunsa page show karna hai
  const [activePage, setActivePage] = useState("addStudent");


  // AddStudent se student receive hoga
  const handleAddStudent = (student) => {
    setStudents((prevStudents) => [
      ...prevStudents,
      student
    ]);

    // Student add hone ke baad Attendance page par jaana ho
    // to ye line use kar sakte ho
    // setActivePage("attendance");
  };


  return (
    <div className="h-screen flex flex-col">

      <div className="flex flex-1 min-h-0">

        <Sidebar
          onNavigate={setActivePage}
          activePage={activePage}
        />

        <main className="flex-1 p-4 overflow-auto">

          {activePage === "addStudent" && (
            <AddStudent onAddStudent={handleAddStudent} />
          )}

          {activePage === "attendance" && (
            <Attendance students={students} />
          )}

          {activePage === "dashboard" && (
            <h2 className="text-2xl font-bold">
              Dashboard
            </h2>
          )}

          {activePage === "records" && (
            <h2 className="text-2xl font-bold">
              Attendance Records
            </h2>
          )}

          {activePage === "reports" && (
            <h2 className="text-2xl font-bold">
              Reports
            </h2>
          )}

          {activePage === "settings" && (
            <h2 className="text-2xl font-bold">
              Settings
            </h2>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;