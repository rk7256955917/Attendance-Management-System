import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import AddStudent from "./components/AddStudent";
import Attendance from "./components/Attendance";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Records from "./components/Records";
import StudentManagement from "./components/StudentManagement";

function App() {

  // Saare students yahan store honge
  const [students, setStudents] = useState([]);

  // Kaunsa page show karna hai
  const [activePage, setActivePage] = useState("addStudent");


  // MongoDB se students fetch
  useEffect(() => {

    const fetchStudents = async () => {

      try {

        const response = await fetch(
          "http://localhost:5000/api/students"
        );

        const data = await response.json();

        setStudents(data);

      } catch (error) {

        console.log(
          "Students fetch error:",
          error.message
        );

      }

    };

    fetchStudents();

  }, []);


  // AddStudent se student receive hoga
  const handleAddStudent = (student) => {

    setStudents((prevStudents) => [
      ...prevStudents,
      student
    ]);

  };


  return (
    <div className="h-screen flex flex-col">

      <div className="flex flex-1 min-h-0">

        {/* Sidebar */}
        <Sidebar
          onNavigate={setActivePage}
          activePage={activePage}
        />


        {/* Main Content */}
        <main className="flex-1 p-4 overflow-auto">


          {/* Add Student */}
          {activePage === "addStudent" && (
            <AddStudent
              onAddStudent={handleAddStudent}
            />
          )}


          {/* Dashboard */}
          {activePage === "dashboard" && (
            <Dashboard />
          )}


          {/* Student Management */}
          {activePage === "students" && (
            <StudentManagement />
          )}


          {/* Attendance */}
          {activePage === "attendance" && (
            <Attendance
              students={students}
            />
          )}


          {/* Records */}
          {activePage === "records" && (
            <Records />
          )}


          {/* Reports */}
          {activePage === "reports" && (
            <Reports />
          )}


          {/* Settings */}
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