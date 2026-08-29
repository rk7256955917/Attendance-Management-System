import { useEffect, useState } from "react";
import API_URL from "../api/api";

const Attendance = ({ students }) => {

  // ===============================
  // FILTER STATES
  // ===============================

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");


  // ===============================
  // ATTENDANCE STATE
  // ===============================

  const [attendance, setAttendance] = useState({});


  // ===============================
  // SUBMIT LOADING
  // ===============================

  const [isSubmitting, setIsSubmitting] = useState(false);


  // ===============================
  // PAGINATION
  // ===============================

  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 10;


  // ===============================
  // FILTER STUDENTS
  // ===============================

  const filteredStudents = students.filter((student) => {

    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      student.name
        ?.toLowerCase()
        .includes(searchText) ||

      student.rollNo
        ?.toLowerCase()
        .includes(searchText) ||

      student.email
        ?.toLowerCase()
        .includes(searchText);


    const matchesCourse =
      courseFilter === "All" ||
      student.course === courseFilter;


    const matchesSemester =
      semesterFilter === "All" ||
      String(student.semester) === semesterFilter;


    return (
      matchesSearch &&
      matchesCourse &&
      matchesSemester
    );
  });


  // ===============================
  // PAGINATION CALCULATION
  // ===============================

  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const startIndex =
    (currentPage - 1) * studentsPerPage;

  const endIndex =
    startIndex + studentsPerPage;

  const currentStudents =
    filteredStudents.slice(
      startIndex,
      endIndex
    );


  // ===============================
  // SEARCH / FILTER CHANGE
  // PAGE 1 PAR LE JAANA
  // ===============================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    courseFilter,
    semesterFilter
  ]);


  // ===============================
  // FETCH ATTENDANCE BY DATE
  // ===============================

  useEffect(() => {

    if (!selectedDate) {
      setAttendance({});
      return;
    }


    const fetchAttendance = async () => {

      try {

        const response = await fetch(
          `http://localhost:5000/api/attendance/date/${selectedDate}`
        );

        const data = await response.json();


        if (!response.ok) {
          throw new Error(
            data.message ||
            "Attendance fetch nahi ho payi"
          );
        }


        const attendanceMap = {};


        data.forEach((item) => {

          const studentId =
            typeof item.student === "object"
              ? item.student._id
              : item.student;


          attendanceMap[studentId] =
            item.status;

        });


        setAttendance(attendanceMap);


      } catch (error) {

        console.log(
          "Attendance Fetch Error:",
          error.message
        );

        setAttendance({});

      }

    };


    fetchAttendance();

  }, [selectedDate]);


  // ===============================
  // SELECT P / L / A
  // ===============================

  const handleAttendance = (
    studentId,
    status
  ) => {

    if (!selectedDate) {
      alert(
        "Pehle attendance date select karo"
      );
      return;
    }


    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));

  };


  // ===============================
  // SUBMIT ATTENDANCE
  // ===============================

  const handleSubmit = async () => {

    if (!selectedDate) {
      alert("Pehle date select karo");
      return;
    }


    if (filteredStudents.length === 0) {
      alert("Koi student nahi mila");
      return;
    }


    // Check unmarked students

    const unmarkedStudents =
      filteredStudents.filter(
        (student) =>
          !attendance[student._id]
      );


    if (unmarkedStudents.length > 0) {

      alert(
        `${unmarkedStudents.length} student ki attendance mark nahi hui hai`
      );

      return;
    }


    try {

      setIsSubmitting(true);


      // ===============================
      // SAVE / UPDATE ATTENDANCE
      // ===============================

      for (const student of filteredStudents) {

        const response = await fetch(
           `${API_URL}/api/students`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              date: selectedDate,
              student: student._id,
              status: attendance[student._id],
            }),
          }
        );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            `${student.name} ki attendance save nahi hui`
          );

        }

      }


      alert(
        "Attendance successfully submit ho gayi"
      );


      // ===============================
      // LATEST ATTENDANCE FETCH
      // ===============================

      const response = await fetch(
        `${API_URL}/api/attendance/date/${selectedDate}`
      );


      const data =
        await response.json();


      if (response.ok) {

        const attendanceMap = {};


        data.forEach((item) => {

          const studentId =
            typeof item.student === "object"
              ? item.student._id
              : item.student;


          attendanceMap[studentId] =
            item.status;

        });


        setAttendance(
          attendanceMap
        );

      }


    } catch (error) {

      console.log(
        "Submit Attendance Error:",
        error.message
      );

      alert(error.message);


    } finally {

      setIsSubmitting(false);

    }

  };


  // ===============================
  // CLEAR FILTERS
  // ===============================

  const clearFilters = () => {

    setSearch("");
    setCourseFilter("All");
    setSemesterFilter("All");
    setSelectedDate("");
    setCurrentPage(1);

  };


  // ===============================
  // RETURN
  // ===============================

  return (

    <div className="bg-white rounded-xl p-3 md:p-5">


      {/* ===============================
          HEADING
      =============================== */}

      <div className="mb-5">

        <h2 className="text-xl md:text-2xl font-bold text-slate-900">
          Mark Attendance
        </h2>

      </div>


      {/* ===============================
          SEARCH + FILTER
      =============================== */}

      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5">


        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Search & Filter
        </h3>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">


          {/* SEARCH */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Search Student
            </label>


            <input
              type="text"
              placeholder="Name, Roll No. or Email"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>


          {/* COURSE */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Course
            </label>


            <select
              value={courseFilter}
              onChange={(e) =>
                setCourseFilter(e.target.value)
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none"
            >

              <option value="All">
                All Courses
              </option>

              <option value="B.Tech CSE">
                B.Tech CSE
              </option>

              <option value="B.Tech IT">
                B.Tech IT
              </option>

              <option value="BCA">
                BCA
              </option>

              <option value="MCA">
                MCA
              </option>

            </select>

          </div>


          {/* SEMESTER */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Semester
            </label>


            <select
              value={semesterFilter}
              onChange={(e) =>
                setSemesterFilter(e.target.value)
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none"
            >

              <option value="All">
                All Semesters
              </option>

              <option value="1">
                Semester 1
              </option>

              <option value="2">
                Semester 2
              </option>

              <option value="3">
                Semester 3
              </option>

              <option value="4">
                Semester 4
              </option>

              <option value="5">
                Semester 5
              </option>

              <option value="6">
                Semester 6
              </option>

              <option value="7">
                Semester 7
              </option>

              <option value="8">
                Semester 8
              </option>

            </select>

          </div>


          {/* DATE */}

          <div>

            <label className="block text-sm font-medium mb-1">
              Attendance Date
            </label>


            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

        </div>


        {/* FILTER BOTTOM */}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">


          <p className="text-sm text-slate-500">

            Showing{" "}
            <span className="font-medium text-slate-700">
              {filteredStudents.length}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {students.length}
            </span>{" "}
            students

          </p>


          <button
            type="button"
            onClick={clearFilters}
            className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
          >
            Clear Filters
          </button>

        </div>

      </div>


      {/* ===============================
          DATE + SUBMIT
      =============================== */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">


        <div>

          {selectedDate && (

            <p className="text-sm text-slate-500">

              Attendance for:{" "}
              <span className="font-medium text-slate-700">
                {selectedDate}
              </span>

            </p>

          )}

        </div>


        <button
          type="button"
          onClick={handleSubmit}
          disabled={
            !selectedDate ||
            isSubmitting
          }
          className={`px-5 py-2 rounded-lg text-white font-medium ${
            !selectedDate || isSubmitting
              ? "bg-slate-300 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >

          {isSubmitting
            ? "Submitting..."
            : "Submit Attendance"}

        </button>

      </div>


      {/* ===============================
          TABLE
      =============================== */}

      <div className="overflow-x-auto">


        <table className="w-full min-w-[850px]">


          <thead>

            <tr className="bg-slate-100 text-left">

              <th className="p-3">
                #
              </th>

              <th className="p-3">
                Student
              </th>

              <th className="p-3">
                Roll Number
              </th>

              <th className="p-3">
                Course
              </th>

              <th className="p-3">
                Semester
              </th>

              <th className="p-3 text-center">
                Attendance
              </th>

            </tr>

          </thead>


          <tbody>


            {currentStudents.map(
              (student, index) => {

                const status =
                  attendance[student._id];


                return (

                  <tr
                    key={student._id}
                    className="border-b"
                  >


                    {/* NUMBER */}

                    <td className="p-3">
                      {startIndex + index + 1}
                    </td>


                    {/* STUDENT */}

                    <td className="p-3">

                      <div className="flex items-center gap-3">


                        <div className="w-9 h-9 rounded-full bg-slate-100 overflow-hidden">


                          {student.photo ? (

                            <img
                              src={`${API_URL}${student.photo}`}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />

                          ) : (

                            <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                              Photo
                            </div>

                          )}

                        </div>


                        <span className="font-medium">
                          {student.name}
                        </span>


                      </div>

                    </td>


                    {/* ROLL NUMBER */}

                    <td className="p-3">
                      {student.rollNo}
                    </td>


                    {/* COURSE */}

                    <td className="p-3">
                      {student.course}
                    </td>


                    {/* SEMESTER */}

                    <td className="p-3">
                      {student.semester}
                    </td>


                    {/* ATTENDANCE */}

                    <td className="p-3">


                      <div className="flex justify-center gap-2">


                        {/* PRESENT */}

                        <button
                          type="button"
                          disabled={!selectedDate}
                          onClick={() =>
                            handleAttendance(
                              student._id,
                              "P"
                            )
                          }
                          className={`px-4 py-2 rounded-lg font-semibold border ${
                            status === "P"
                              ? "bg-green-600 text-white border-green-600"
                              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                          } ${
                            !selectedDate
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          P
                        </button>


                        {/* LATE */}

                        <button
                          type="button"
                          disabled={!selectedDate}
                          onClick={() =>
                            handleAttendance(
                              student._id,
                              "L"
                            )
                          }
                          className={`px-4 py-2 rounded-lg font-semibold border ${
                            status === "L"
                              ? "bg-orange-500 text-white border-orange-500"
                              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                          } ${
                            !selectedDate
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          L
                        </button>


                        {/* ABSENT */}

                        <button
                          type="button"
                          disabled={!selectedDate}
                          onClick={() =>
                            handleAttendance(
                              student._id,
                              "A"
                            )
                          }
                          className={`px-4 py-2 rounded-lg font-semibold border ${
                            status === "A"
                              ? "bg-red-600 text-white border-red-600"
                              : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                          } ${
                            !selectedDate
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          A
                        </button>


                      </div>

                    </td>


                  </tr>

                );

              }

            )}


            {/* NO STUDENTS */}

            {filteredStudents.length === 0 && (

              <tr>

                <td
                  colSpan="6"
                  className="p-5 text-center text-slate-500"
                >
                  No students found
                </td>

              </tr>

            )}


          </tbody>

        </table>

      </div>


      {/* ===============================
          PAGINATION
      =============================== */}

      {filteredStudents.length > 0 && totalPages > 1 && (

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">

          {/* Showing Range */}

          <p className="text-sm text-slate-500">

            Showing{" "}
            <span className="font-medium text-slate-700">
              {startIndex + 1}
            </span>{" "}
            -
            {" "}
            <span className="font-medium text-slate-700">
              {Math.min(
                endIndex,
                filteredStudents.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-slate-700">
              {filteredStudents.length}
            </span>

          </p>


          {/* Pagination Buttons */}

          <div className="flex items-center gap-2">

            {/* Previous */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (prev) => prev - 1
                )
              }
              disabled={currentPage === 1}
              className={`px-3 py-2 rounded-lg border text-sm ${
                currentPage === 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Previous
            </button>


            {/* Page Numbers */}

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (

              <button
                key={page}
                type="button"
                onClick={() =>
                  setCurrentPage(page)
                }
                className={`w-9 h-9 rounded-lg text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>

            ))}


            {/* Next */}

            <button
              type="button"
              onClick={() =>
                setCurrentPage(
                  (prev) => prev + 1
                )
              }
              disabled={
                currentPage === totalPages
              }
              className={`px-3 py-2 rounded-lg border text-sm ${
                currentPage === totalPages
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              Next
            </button>

          </div>

        </div>

      )}

    </div>

  );

};

export default Attendance;