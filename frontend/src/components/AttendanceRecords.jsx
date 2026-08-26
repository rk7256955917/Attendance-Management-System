import { useEffect, useState } from "react";
import API_URL from "./api/api";

const AttendanceRecords = () => {

  const [records, setRecords] = useState([]);

  useEffect(() => {

    const fetchAttendance = async () => {
      try {

        const response = await fetch(
         `${API_URL}/api/attendance`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Attendance fetch nahi hui");
        }

        setRecords(data);

      } catch (error) {
        console.log("Error:", error.message);
      }
    };

    fetchAttendance();

  }, []);


  return (
    <div className="bg-white rounded-xl p-5">

      <h2 className="text-2xl font-bold text-slate-900 mb-5">
        Attendance Records
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead>
            <tr className="bg-slate-100 text-left">

              <th className="p-3">
                Date
              </th>

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

            {records.map((record) => (

              <tr
                key={record._id}
                className="border-b"
              >

                <td className="p-3">
                  {new Date(record.date).toLocaleDateString()}
                </td>

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

          </tbody>

        </table>

      </div>

    </div>
  );
};

export default AttendanceRecords;