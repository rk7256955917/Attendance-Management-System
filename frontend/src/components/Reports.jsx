import { useEffect, useState } from "react";
import API_URL from "../api/api";

const Reports = () => {
  const [attendance, setAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");

  // Attendance fetch
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/attendance`
        );

        const data = await response.json();

        console.log("REPORTS ATTENDANCE DATA:", data);

        setAttendance(data);
      } catch (error) {
        console.log("Reports Error:", error.message);
      }
    };

    fetchAttendance();
  }, []);

  // Selected date ki attendance
  const filteredAttendance = attendance.filter((record) => {
    if (!selectedDate) return true;

    return record.date?.startsWith(selectedDate);
  });

  return (
    <div>
      {/* Heading */}
      <h2 className="text-2xl font-bold text-slate-900 mb-5">
        Attendance Reports
      </h2>

      {/* Date Filter */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 mb-5">
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Select Date
        </label>

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl p-5 border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Attendance Records
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100 text-left">
                <th className="p-3">Student</th>
                <th className="p-3">Roll Number</th>
                <th className="p-3">Date</th>
                <th className="p-3 text-center">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredAttendance.map((record) => (
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

                  <td className="p-3">
                    {record.date
                      ? new Date(record.date).toLocaleDateString()
                      : "No date"}
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

              {filteredAttendance.length === 0 && (
                <tr>
                  <td
                    colSpan="4"
                    className="p-5 text-center text-slate-500"
                  >
                    No attendance records found
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

export default Reports;