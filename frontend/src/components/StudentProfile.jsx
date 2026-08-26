import { useEffect, useState } from "react";
import API_URL from "../api/api";

const StudentProfile = ({ student, onBack }) => {

  // Attendance data
  const [attendance, setAttendance] = useState([]);

  // Loading
  const [loading, setLoading] = useState(true);

  // Calendar month
  const [currentMonth, setCurrentMonth] = useState(new Date());


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
          `${API_URL}/api/attendance/student/${student._id}`
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


  // ===============================
  // Total Attendance
  // ===============================

  const totalAttendance =
    presentCount +
    lateCount +
    absentCount;


  // ===============================
  // Attendance Percentage
  // ===============================

  const attendancePercentage =
    totalAttendance > 0
      ? ((presentCount / totalAttendance) * 100).toFixed(0)
      : 0;


  // ===============================
  // CALENDAR DATA
  // ===============================

  const year = currentMonth.getFullYear();

  const month = currentMonth.getMonth();

  const monthName = currentMonth.toLocaleDateString(
    "en-US",
    {
      month: "long",
      year: "numeric",
    }
  );


  // First day of month
  const firstDay = new Date(
    year,
    month,
    1
  ).getDay();


  // Total days in month
  const daysInMonth = new Date(
    year,
    month + 1,
    0
  ).getDate();


  // Create calendar days
  const calendarDays = [];

  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }


  // ===============================
  // GET ATTENDANCE STATUS
  // ===============================

  const getAttendanceStatus = (day) => {

    const calendarDate = new Date(
      year,
      month,
      day
    );

    return attendance.find((item) => {

      const attendanceDate =
        new Date(item.date);

      return (
        attendanceDate.getFullYear() ===
          calendarDate.getFullYear() &&
        attendanceDate.getMonth() ===
          calendarDate.getMonth() &&
        attendanceDate.getDate() ===
          calendarDate.getDate()
      );

    })?.status;

  };


  // ===============================
  // CHECK TODAY
  // ===============================

  const isToday = (day) => {

    const today = new Date();

    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );

  };


  // ===============================
  // PREVIOUS MONTH
  // ===============================

  const previousMonth = () => {

    setCurrentMonth(
      new Date(
        year,
        month - 1,
        1
      )
    );

  };


  // ===============================
  // NEXT MONTH
  // ===============================

  const nextMonth = () => {

    setCurrentMonth(
      new Date(
        year,
        month + 1,
        1
      )
    );

  };


  // ===============================
  // STUDENT NOT FOUND
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
          HEADING + BACK BUTTON
      =============================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">

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
          PROFILE CARD
      =============================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-6">


        {/* ===============================
            PROFILE TOP
        =============================== */}

        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">


          {/* Profile Image */}

          <div className="w-32 h-32 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center">

            {student.photo ? (

              <img
                src={`${API_URL}${student.photo}`}
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
            STUDENT DETAILS
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
            ATTENDANCE SUMMARY
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
                  ATTENDANCE PERCENTAGE
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


              {/* ===============================
                  ATTENDANCE CALENDAR
              =============================== */}

              <div className="mt-8">


                {/* Calendar Heading */}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">

                  <div>

                    <h3 className="text-lg font-bold text-slate-900">
                      Attendance Calendar
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Daily attendance overview
                    </p>

                  </div>


                  {/* Legend */}

                  <div className="flex flex-wrap items-center gap-2">

                    {/* Present */}

                    <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">

                      <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>

                      <span className="text-xs font-medium text-green-700">
                        Present
                      </span>

                    </div>


                    {/* Late */}

                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-100 px-3 py-1.5 rounded-full">

                      <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>

                      <span className="text-xs font-medium text-orange-700">
                        Late
                      </span>

                    </div>


                    {/* Absent */}

                    <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-full">

                      <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>

                      <span className="text-xs font-medium text-red-700">
                        Absent
                      </span>

                    </div>


                    {/* Today */}

                    <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 px-3 py-1.5 rounded-full">

                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>

                      <span className="text-xs font-medium text-yellow-700">
                        Today
                      </span>

                    </div>

                  </div>

                </div>


                {/* Calendar Card */}

                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">


                  {/* Calendar Header */}

                  <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-100 bg-slate-50/70">


                    {/* Previous */}

                    <button
                      type="button"
                      onClick={previousMonth}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      ←
                    </button>


                    {/* Month */}

                    <div className="text-center">

                      <h4 className="text-lg md:text-xl font-bold text-slate-900">
                        {monthName}
                      </h4>

                      <p className="text-xs text-slate-500 mt-0.5">
                        Attendance overview
                      </p>

                    </div>


                    {/* Next */}

                    <button
                      type="button"
                      onClick={nextMonth}
                      className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                      →
                    </button>

                  </div>


                  {/* Calendar Body */}

                  <div className="p-3 md:p-6">


                    {/* Week Days */}

                    <div className="grid grid-cols-7 mb-2">

                      {[
                        "Sun",
                        "Mon",
                        "Tue",
                        "Wed",
                        "Thu",
                        "Fri",
                        "Sat",
                      ].map((day) => (

                        <div
                          key={day}
                          className="text-center py-2 text-[11px] md:text-xs font-semibold uppercase tracking-wide text-slate-400"
                        >
                          {day}
                        </div>

                      ))}

                    </div>


                    {/* Dates */}

                    <div className="grid grid-cols-7 gap-1.5 md:gap-2">

                      {calendarDays.map(
                        (day, index) => {

                          // Empty date

                          if (!day) {

                            return (
                              <div
                                key={`empty-${index}`}
                                className="aspect-square"
                              ></div>
                            );

                          }


                          const status =
                            getAttendanceStatus(day);

                          const todayDate =
                            isToday(day);


                          // Default

                          let dateClass =
                            "bg-slate-50 border-slate-100 text-slate-700 hover:bg-slate-100";


                          // Present

                          if (status === "P") {

                            dateClass =
                              "bg-green-500 border-green-500 text-white hover:bg-green-600";

                          }


                          // Late

                          else if (status === "L") {

                            dateClass =
                              "bg-orange-500 border-orange-500 text-white hover:bg-orange-600";

                          }


                          // Absent

                          else if (status === "A") {

                            dateClass =
                              "bg-red-500 border-red-500 text-white hover:bg-red-600";

                          }


                          // Today

                          else if (todayDate) {

                            dateClass =
                              "bg-yellow-400 border-yellow-400 text-slate-900 ring-2 ring-yellow-200";

                          }


                          return (

                            <div
                              key={day}
                              title={
                                status === "P"
                                  ? `${day} ${monthName} - Present`
                                  : status === "L"
                                  ? `${day} ${monthName} - Late`
                                  : status === "A"
                                  ? `${day} ${monthName} - Absent`
                                  : todayDate
                                  ? `${day} ${monthName} - Today`
                                  : `${day} ${monthName}`
                              }
                              className={`
                                aspect-square
                                min-h-[45px]
                                md:min-h-[70px]
                                rounded-xl
                                border
                                flex
                                flex-col
                                items-center
                                justify-center
                                transition-all
                                duration-200
                                cursor-default
                                ${dateClass}
                              `}
                            >


                              {/* Date Number */}

                              <span className="text-sm md:text-base font-bold">
                                {day}
                              </span>


                              {/* Status */}

                              {status && (

                                <span
                                  className={`
                                    mt-1
                                    text-[9px]
                                    md:text-[10px]
                                    font-bold
                                    px-1.5
                                    py-0.5
                                    rounded-md
                                    ${
                                      status === "P"
                                        ? "bg-green-700/30"
                                        : status === "L"
                                        ? "bg-orange-700/30"
                                        : "bg-red-700/30"
                                    }
                                  `}
                                >
                                  {status}
                                </span>

                              )}


                              {/* Today */}

                              {todayDate && !status && (

                                <span className="mt-1 text-[8px] md:text-[9px] font-bold uppercase tracking-wide">
                                  Today
                                </span>

                              )}

                            </div>

                          );

                        }
                      )}

                    </div>

                  </div>

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