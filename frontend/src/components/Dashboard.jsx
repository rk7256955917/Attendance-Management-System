import { useEffect, useState } from "react";
import API_URL from "../api/api";

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Students fetch
        const studentResponse = await fetch(
          `${API_URL}/api/students`
        );

        const studentData = await studentResponse.json();

        // Attendance fetch
        const attendanceResponse = await fetch(
          `${API_URL}/api/students`
        );

        const attendanceData = await attendanceResponse.json();

        setStudents(studentData);
        setAttendance(attendanceData);

      } catch (error) {
        console.log("Dashboard Error:", error.message);
      }
    };

    fetchData();
  }, []);


  // Aaj ki date
  const today = new Date().toISOString().split("T")[0];


  // Sirf aaj ki attendance
  const todayAttendance = attendance.filter((record) => {
    return record.date.startsWith(today);
  });


  // P / L / A count
  const presentCount = todayAttendance.filter(
    (record) => record.status === "P"
  ).length;

  const lateCount = todayAttendance.filter(
    (record) => record.status === "L"
  ).length;

  const absentCount = todayAttendance.filter(
    (record) => record.status === "A"
  ).length;


  // Attendance percentage
  const attendancePercentage =
    students.length > 0
      ? Math.round(
          ((presentCount + lateCount) / students.length) * 100
        )
      : 0;


  return (
    <div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-slate-900 mb-5">
        Dashboard
      </h2>


      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


        {/* Total Students */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">

          <p className="text-sm text-slate-500">
            Total Students
          </p>

          <h3 className="text-3xl font-bold text-slate-900 mt-2">
            {students.length}
          </h3>

        </div>


        {/* Present */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">

          <p className="text-sm text-slate-500">
            Present Today
          </p>

          <h3 className="text-3xl font-bold text-green-600 mt-2">
            {presentCount}
          </h3>

        </div>


        {/* Late */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">

          <p className="text-sm text-slate-500">
            Late Today
          </p>

          <h3 className="text-3xl font-bold text-orange-500 mt-2">
            {lateCount}
          </h3>

        </div>


        {/* Absent */}
        <div className="bg-white rounded-xl p-5 border border-slate-200">

          <p className="text-sm text-slate-500">
            Absent Today
          </p>

          <h3 className="text-3xl font-bold text-red-500 mt-2">
            {absentCount}
          </h3>

        </div>

      </div>


      {/* Attendance Percentage */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mt-5">

        <p className="text-sm text-slate-500">
          Today's Attendance
        </p>

        <h3 className="text-3xl font-bold text-blue-600 mt-2">
          {attendancePercentage}%
        </h3>

      </div>


      {/* Today's Attendance Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mt-5">

        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Today's Attendance
        </h3>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="bg-slate-100 text-left">

                <th className="p-3">
                  Student
                </th>

                <th className="p-3">
                  Roll Number
                </th>

                <th className="p-3 text-center">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {todayAttendance.map((record) => (

                <tr
                  key={record._id}
                  className="border-b"
                >

                  <td className="p-3">
                    {record.student?.name}
                  </td>

                  <td className="p-3">
                    {record.student?.rollNo}
                  </td>

                  <td className="p-3 text-center">

                    <span
                      className={`px-3 py-1 rounded-lg text-white ${
                        record.status === "P"
                          ? "bg-green-500"
                          : record.status === "L"
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                    >
                      {record.status}
                    </span>

                  </td>

                </tr>

              ))}


              {/* Agar aaj attendance nahi hai */}
              {todayAttendance.length === 0 && (

                <tr>

                  <td
                    colSpan="3"
                    className="p-5 text-center text-slate-500"
                  >
                    No attendance marked today

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;