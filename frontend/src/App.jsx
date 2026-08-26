import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import AddStudent from "./components/AddStudent";
import Attendance from "./components/Attendance";
import Dashboard from "./components/Dashboard";
import Reports from "./components/Reports";
import Records from "./components/Records";
import StudentManagement from "./components/StudentManagement";
import StudentProfile from "./components/StudentProfile";
import API_URL from "./api/api";

function App() {
  // Saare students yahan store honge
  const [students, setStudents] = useState([]);

  // Selected student ka profile
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Kaunsa page show karna hai
  const [activePage, setActivePage] = useState("addStudent");

  // ===============================
  // GET - MongoDB se students fetch
  // ===============================
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/students`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Students fetch nahi ho paye"
          );
        }

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

  // ===============================
  // ADD STUDENT
  // ===============================
  const handleAddStudent = (student) => {
    setStudents((prevStudents) => [
      ...prevStudents,
      student,
    ]);
  };

  // ===============================
  // STUDENT PROFILE
  // ===============================
  const handleProfileClick = (student) => {
    setSelectedStudent(student);
    setActivePage("studentProfile");
  };

  // ===============================
  // BACK TO STUDENT MANAGEMENT
  // ===============================
  const handleBackToStudents = () => {
    setSelectedStudent(null);
    setActivePage("students");
  };

  return (
    <div className="h-screen flex flex-col">
      <div className="flex flex-1 min-h-0">

        {/* ===============================
            Sidebar
        =============================== */}
        <Sidebar
          onNavigate={setActivePage}
          activePage={activePage}
        />

        {/* ===============================
            Main Content
        =============================== */}
        <main className="flex-1 p-4 overflow-auto">

          {/* ===============================
              Add Student
          =============================== */}
          {activePage === "addStudent" && (
            <AddStudent
              onAddStudent={handleAddStudent}
            />
          )}

          {/* ===============================
              Dashboard
          =============================== */}
          {activePage === "dashboard" && (
            <Dashboard />
          )}

          {/* ===============================
              Student Management
          =============================== */}
          {activePage === "students" && (
            <StudentManagement
              onProfileClick={handleProfileClick}
            />
          )}

          {/* ===============================
              Student Profile
          =============================== */}
          {activePage === "studentProfile" &&
            selectedStudent && (
              <StudentProfile
                student={selectedStudent}
                onBack={handleBackToStudents}
              />
            )}

          {/* ===============================
              Attendance
          =============================== */}
          {activePage === "attendance" && (
            <Attendance
              students={students}
            />
          )}

          {/* ===============================
              Records
          =============================== */}
          {activePage === "records" && (
            <Records />
          )}

          {/* ===============================
              Reports
          =============================== */}
          {activePage === "reports" && (
            <Reports />
          )}

          {/* ===============================
              Settings
          =============================== */}
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