import { useEffect, useState } from "react";

const StudentProfile = ({ student, onBack }) => {

  // Attendance data
  const [attendance, setAttendance] = useState([]);

  // Loading
  const [loading, setLoading] = useState(true);


  // ===============================
  // GET - Student Attendance
  // ===============================
  useEffect(() => {

    if (!student?._id) {
      return;
    }

    const fetchAttendance = async () => {

      try {

        setLoading(true);

        const response = await fetch(
          `http://localhost:5000/api/attendance/student/${student._id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Attendance fetch nahi ho payi"
          );
        }

        setAttendance(data);

      } catch (error) {

        console.log(
          "Student Attendance Error:",
          error.message
        );

      } finally {

        setLoading(false);

      }

    };

    fetchAttendance();

  }, [student]);


  // ===============================
  // Attendance Count
  // ===============================

  const presentCount = attendance.filter(
    (item) => item.status === "P"
  ).length;

  const lateCount = attendance.filter(
    (item) => item.status === "L"
  ).length;

  const absentCount = attendance.filter(
    (item) => item.status === "A"
  ).length;


  // Total Attendance
  const totalAttendance =
    presentCount +
    lateCount +
    absentCount;


  // Attendance Percentage
  // Late ko Present nahi maana gaya hai
  const attendancePercentage =
    totalAttendance > 0
      ? ((presentCount / totalAttendance) * 100).toFixed(0)
      : 0;


  // ===============================
  // Student nahi mila
  // ===============================

  if (!student) {

    return (
      <div className="p-5">

        <p className="text-slate-500">
          Student details nahi mili.
        </p>

        <button
          onClick={onBack}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Back to Students
        </button>

      </div>
    );

  }


  return (

    <div>

      {/* ===============================
          Heading + Back Button
      =============================== */}

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-2xl font-bold text-slate-900">
          Student Profile
        </h2>

        <button
          onClick={onBack}
          className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-lg"
        >
          ← Back to Students
        </button>

      </div>


      {/* ===============================
          Profile Card
      =============================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-6">


        {/* ===============================
            Profile Top
        =============================== */}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">


          {/* Profile Image */}

          <div className="w-32 h-32 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">

            {student.photo ? (

              <img
                src={`http://localhost:5000${student.photo}`}
                alt={student.name}
                className="w-full h-full object-cover"
              />

            ) : (

              <span className="text-sm text-slate-400">
                No Photo
              </span>

            )}

          </div>


          {/* Name */}

          <div className="text-center md:text-left">

            <h3 className="text-2xl font-bold text-slate-900">
              {student.name}
            </h3>

            <p className="text-slate-500 mt-1">
              Roll No: {student.rollNo}
            </p>

          </div>

        </div>


        {/* ===============================
            Student Details
        =============================== */}

        <div className="mt-8">

          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Student Details
          </h3>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">


            {/* Roll Number */}

            <div className="bg-slate-50 rounded-lg p-4">

              <p className="text-sm text-slate-500">
                Roll Number
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {student.rollNo}
              </p>

            </div>


            {/* Email */}

            <div className="bg-slate-50 rounded-lg p-4">

              <p className="text-sm text-slate-500">
                Email
              </p>

              <p className="font-semibold text-slate-900 mt-1 break-words">
                {student.email}
              </p>

            </div>


            {/* Course */}

            <div className="bg-slate-50 rounded-lg p-4">

              <p className="text-sm text-slate-500">
                Course
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {student.course}
              </p>

            </div>


            {/* Semester */}

            <div className="bg-slate-50 rounded-lg p-4">

              <p className="text-sm text-slate-500">
                Semester
              </p>

              <p className="font-semibold text-slate-900 mt-1">
                {student.semester}
              </p>

            </div>

          </div>

        </div>


        {/* ===============================
            Attendance Summary
        =============================== */}

        <div className="mt-8">

          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Attendance Summary
          </h3>


          {loading ? (

            <p className="text-slate-500">
              Attendance loading...
            </p>

          ) : (

            <>

              {/* Attendance Cards */}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">


                {/* Present */}

                <div className="bg-green-50 border border-green-100 rounded-lg p-4">

                  <p className="text-sm text-green-600">
                    Present
                  </p>

                  <p className="text-2xl font-bold text-green-700 mt-1">
                    {presentCount}
                  </p>

                </div>


                {/* Late */}

                <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4">

                  <p className="text-sm text-yellow-600">
                    Late
                  </p>

                  <p className="text-2xl font-bold text-yellow-700 mt-1">
                    {lateCount}
                  </p>

                </div>


                {/* Absent */}

                <div className="bg-red-50 border border-red-100 rounded-lg p-4">

                  <p className="text-sm text-red-600">
                    Absent
                  </p>

                  <p className="text-2xl font-bold text-red-700 mt-1">
                    {absentCount}
                  </p>

                </div>

              </div>


              {/* ===============================
                  Attendance Percentage
              =============================== */}

              <div className="mt-5 bg-slate-50 rounded-lg p-5">

                <p className="text-sm text-slate-500">
                  Attendance Percentage
                </p>

                <div className="flex items-center gap-4 mt-2">

                  <p className="text-3xl font-bold text-slate-900">
                    {attendancePercentage}%
                  </p>

                </div>

              </div>

            </>

          )}

        </div>


      </div>

    </div>

  );

};

export default StudentProfile;