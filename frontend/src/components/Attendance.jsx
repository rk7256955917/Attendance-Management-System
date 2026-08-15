import { useState } from "react";

const Attendance = ({ students }) => {

  const [selectedDate, setSelectedDate] = useState("");
  const [attendance, setAttendance] = useState({});


  // P / L / A select karne ka function
  const handleAttendance = (rollNo, status) => {
    setAttendance((prev) => ({
      ...prev,
      [rollNo]: status,
    }));
  };


  // Submit button
  const handleSubmit = () => {

    const attendanceData = {
      date: selectedDate,
      attendance: attendance,
    };

    console.log(attendanceData);
  };


  return (
    <div className="bg-white rounded-xl p-3 md:p-5">


      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">


        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Mark Attendance
        </h2>


        <div className="flex items-center gap-3">


          {/* Date */}
          <div className="flex items-center gap-2">

            <label className="text-sm text-slate-700">
              Date:
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          {/* Submit */}
          <button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Submit
          </button>


        </div>

      </div>


      {/* Table */}
      <div className="overflow-x-auto">


        <table className="w-full min-w-[700px]">


          <thead>

            <tr className="bg-slate-100 text-left">

              <th className="p-3">#</th>

              <th className="p-3">
                Student
              </th>

              <th className="p-3">
                Roll Number
              </th>

              <th className="p-3 text-center">
                Present
              </th>

              <th className="p-3 text-center">
                Late
              </th>

              <th className="p-3 text-center">
                Absent
              </th>

            </tr>

          </thead>


          <tbody>

            {students.map((student, index) => (

              <tr
                key={index}
                className="border-b"
              >

                <td className="p-3">
                  {index + 1}
                </td>

                <td className="p-3">
                  {student.name}
                </td>

                <td className="p-3">
                  {student.rollNo}
                </td>


                {/* Present */}
                <td className="p-3 text-center">

                  <button
                    onClick={() =>
                      handleAttendance(student.rollNo, "P")
                    }
                    className={`text-white px-4 py-2 rounded-lg ${
                      attendance[student.rollNo] === "P"
                        ? "bg-green-700"
                        : "bg-green-500"
                    }`}
                  >
                    P
                  </button>

                </td>


                {/* Late */}
                <td className="p-3 text-center">

                  <button
                    onClick={() =>
                      handleAttendance(student.rollNo, "L")
                    }
                    className={`text-white px-4 py-2 rounded-lg ${
                      attendance[student.rollNo] === "L"
                        ? "bg-orange-700"
                        : "bg-orange-500"
                    }`}
                  >
                    L
                  </button>

                </td>


                {/* Absent */}
                <td className="p-3 text-center">

                  <button
                    onClick={() =>
                      handleAttendance(student.rollNo, "A")
                    }
                    className={`text-white px-4 py-2 rounded-lg ${
                      attendance[student.rollNo] === "A"
                        ? "bg-red-700"
                        : "bg-red-500"
                    }`}
                  >
                    A
                  </button>

                </td>


              </tr>

            ))}

          </tbody>

        </table>


      </div>

    </div>
  );
};

export default Attendance;