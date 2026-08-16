import { useEffect, useState } from "react";

const Records = () => {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/attendance"
        );

        const data = await response.json();

        setAttendance(data);
      } catch (error) {
        console.log("Records Error:", error.message);
      }
    };

    fetchAttendance();
  }, []);

  // Counts
  const presentCount = attendance.filter(
    (record) => record.status === "P"
  ).length;

  const lateCount = attendance.filter(
    (record) => record.status === "L"
  ).length;

  const absentCount = attendance.filter(
    (record) => record.status === "A"
  ).length;

  return (
    <div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-slate-900 mb-5">
        Attendance Records
      </h2>


      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">

        {/* Present */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Total Present
          </p>

          <h3 className="text-3xl font-bold text-green-600 mt-2">
            {presentCount}
          </h3>

        </div>


        {/* Late */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Total Late
          </p>

          <h3 className="text-3xl font-bold text-orange-500 mt-2">
            {lateCount}
          </h3>

        </div>


        {/* Absent */}
        <div className="bg-white border border-slate-200 rounded-xl p-5">

          <p className="text-sm text-slate-500">
            Total Absent
          </p>

          <h3 className="text-3xl font-bold text-red-500 mt-2">
            {absentCount}
          </h3>

        </div>

      </div>


      {/* Records Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">

        <h3 className="text-lg font-bold text-slate-900 mb-4">
          All Attendance Records
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

                <th className="p-3">
                  Date
                </th>

                <th className="p-3 text-center">
                  Status
                </th>

              </tr>

            </thead>


            <tbody>

              {attendance.map((record) => (

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
                    {new Date(record.date).toLocaleDateString()}
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


              {attendance.length === 0 && (

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

export default Records;