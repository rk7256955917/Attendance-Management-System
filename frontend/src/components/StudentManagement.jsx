import { useEffect, useState } from "react";

const StudentManagement = ({ onProfileClick }) => {
  const [students, setStudents] = useState([]);

  // Edit ke liye selected student
  const [editingStudent, setEditingStudent] = useState(null);

  // New image ke liye
  const [newImage, setNewImage] = useState(null);

  // ===============================
  // SEARCH / FILTER STATES
  // ===============================

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  // ===============================
  // ATTENDANCE STATES
  // ===============================

  const [attendance, setAttendance] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ===============================
  // PAGINATION STATES
  // ===============================

  const [currentPage, setCurrentPage] = useState(1);

  // Ek page par kitne students
  const studentsPerPage = 5;

  // ===============================
  // GET - Students
  // ===============================

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/students"
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
          "Student Management Error:",
          error.message
        );
      }
    };

    fetchStudents();
  }, []);

  // ===============================
  // GET - Attendance By Date
  // ===============================

  useEffect(() => {
    if (!selectedDate) {
      setAttendance([]);
      setAttendanceStatus({});
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

        setAttendance(data);

        const statusMap = {};

        data.forEach((item) => {
          const studentId =
            typeof item.student === "object"
              ? item.student._id
              : item.student;

          statusMap[studentId] = item.status;
        });

        setAttendanceStatus(statusMap);
      } catch (error) {
        console.log(
          "Attendance Fetch Error:",
          error.message
        );

        setAttendance([]);
        setAttendanceStatus({});
      }
    };

    fetchAttendance();
  }, [selectedDate]);

  // ===============================
  // SELECT ATTENDANCE
  // ===============================

  const handleAttendanceChange = (
    studentId,
    status
  ) => {
    setAttendanceStatus((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  // ===============================
  // SUBMIT ATTENDANCE
  // ===============================

  const handleSubmitAttendance = async () => {
    if (!selectedDate) {
      alert("Pehle attendance date select karo");
      return;
    }

    if (filteredStudents.length === 0) {
      alert(
        "Attendance ke liye koi student nahi hai"
      );
      return;
    }

    const unmarkedStudents =
      filteredStudents.filter(
        (student) =>
          !attendanceStatus[student._id]
      );

    if (unmarkedStudents.length > 0) {
      alert(
        `${unmarkedStudents.length} student ki attendance abhi mark nahi hui hai`
      );
      return;
    }

    try {
      setIsSubmitting(true);

      for (const student of filteredStudents) {
        const response = await fetch(
          "http://localhost:5000/api/attendance",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              date: selectedDate,
              student: student._id,
              status:
                attendanceStatus[student._id],
            }),
          }
        );

        const data = await response.json();

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

      // Latest attendance dobara fetch
      const response = await fetch(
        `http://localhost:5000/api/attendance/date/${selectedDate}`
      );

      const data = await response.json();

      if (response.ok) {
        setAttendance(data);

        const statusMap = {};

        data.forEach((item) => {
          const studentId =
            typeof item.student === "object"
              ? item.student._id
              : item.student;

          statusMap[studentId] = item.status;
        });

        setAttendanceStatus(statusMap);
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
  // EDIT - Student
  // ===============================

  const handleEdit = (student) => {
    setEditingStudent({
      ...student,
    });

    setNewImage(null);
  };

  // ===============================
  // UPDATE - Student
  // ===============================

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append(
        "name",
        editingStudent.name
      );

      formData.append(
        "rollNo",
        editingStudent.rollNo
      );

      formData.append(
        "email",
        editingStudent.email
      );

      formData.append(
        "course",
        editingStudent.course
      );

      formData.append(
        "semester",
        Number(editingStudent.semester)
      );

      if (newImage) {
        formData.append("photo", newImage);
      }

      const response = await fetch(
        `http://localhost:5000/api/students/${editingStudent._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Student update nahi hua"
        );
      }

      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === data._id
            ? data
            : student
        )
      );

      setEditingStudent(null);
      setNewImage(null);

      alert(
        "Student successfully update ho gaya"
      );
    } catch (error) {
      console.log(
        "Update Error:",
        error.message
      );

      alert(error.message);
    }
  };

  // ===============================
  // DELETE - Student
  // ===============================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Kya aap is student ko delete karna chahte hain?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Student delete nahi hua"
        );
      }

      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) =>
            student._id !== id
        )
      );

      // Attendance state se bhi remove
      setAttendanceStatus((prev) => {
        const updated = { ...prev };

        delete updated[id];

        return updated;
      });
    } catch (error) {
      console.log(
        "Delete Error:",
        error.message
      );

      alert(error.message);
    }
  };

  // ===============================
  // FILTER STUDENTS
  // ===============================

  const filteredStudents = students.filter(
    (student) => {
      const searchText =
        search.toLowerCase();

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
        String(student.semester) ===
          semesterFilter;

      return (
        matchesSearch &&
        matchesCourse &&
        matchesSemester
      );
    }
  );

  // ===============================
  // PAGINATION CALCULATION
  // ===============================

  const totalPages = Math.ceil(
    filteredStudents.length /
      studentsPerPage
  );

  const startIndex =
    (currentPage - 1) *
    studentsPerPage;

  const endIndex =
    startIndex + studentsPerPage;

  const paginatedStudents =
    filteredStudents.slice(
      startIndex,
      endIndex
    );

  // ===============================
  // PAGE CHANGE
  // ===============================

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // ===============================
  // SEARCH / FILTER CHANGE
  // PAGE 1 PAR AAO
  // ===============================

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    courseFilter,
    semesterFilter,
  ]);

  // ===============================
  // AGAR CURRENT PAGE EMPTY HO
  // ===============================

  useEffect(() => {
    if (
      totalPages > 0 &&
      currentPage > totalPages
    ) {
      setCurrentPage(totalPages);
    }
  }, [
    currentPage,
    totalPages,
  ]);

  // ===============================
  // RETURN
  // ===============================

  return (
    <div>

      {/* ===============================
          HEADING
      =============================== */}

      <h2 className="text-2xl font-bold text-slate-900 mb-5">
        Student Management
      </h2>

      {/* ===============================
          SEARCH + FILTER
      =============================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">

        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Search & Filter
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Search */}

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

          {/* Course */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Course
            </label>

            <select
              value={courseFilter}
              onChange={(e) =>
                setCourseFilter(
                  e.target.value
                )
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

          {/* Semester */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Semester
            </label>

            <select
              value={semesterFilter}
              onChange={(e) =>
                setSemesterFilter(
                  e.target.value
                )
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

          {/* Date */}

          <div>
            <label className="block text-sm font-medium mb-1">
              Attendance Date
            </label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(
                  e.target.value
                )
              }
              className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none"
            />
          </div>

        </div>

        {/* Filter Bottom */}

        <div className="mt-4 flex items-center justify-between">

          <p className="text-sm text-slate-500">
            Showing{" "}
            {filteredStudents.length === 0
              ? 0
              : startIndex + 1}
            -
            {Math.min(
              endIndex,
              filteredStudents.length
            )}{" "}
            of{" "}
            {filteredStudents.length}{" "}
            students
          </p>

          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCourseFilter("All");
              setSemesterFilter("All");
              setSelectedDate("");
              setCurrentPage(1);
            }}
            className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
          >
            Clear Filters
          </button>

        </div>
      </div>

      {/* ===============================
          EDIT FORM
      =============================== */}

      {editingStudent && (
        <div className="bg-white border border-slate-200 rounded-xl p-5 mb-5">

          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Edit Student
          </h3>

          <form
            onSubmit={handleUpdate}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >

            {/* Name */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Full Name
              </label>

              <input
                type="text"
                value={editingStudent.name}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    name: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Roll Number */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Roll Number
              </label>

              <input
                type="text"
                value={editingStudent.rollNo}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    rollNo: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Email
              </label>

              <input
                type="email"
                value={editingStudent.email}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    email: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Course */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Course
              </label>

              <select
                value={editingStudent.course}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    course: e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none"
              >
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

            {/* Semester */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Semester
              </label>

              <select
                value={editingStudent.semester}
                onChange={(e) =>
                  setEditingStudent({
                    ...editingStudent,
                    semester:
                      e.target.value,
                  })
                }
                className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none"
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

            {/* Profile Photo */}

            <div>
              <label className="block text-sm font-medium mb-1">
                Profile Photo
              </label>

              <div className="flex items-center gap-4 mb-3">

                <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden">

                  {newImage ? (
                    <img
                      src={URL.createObjectURL(
                        newImage
                      )}
                      alt="New Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : editingStudent.photo ? (
                    <img
                      src={`http://localhost:5000${editingStudent.photo}`}
                      alt={
                        editingStudent.name
                      }
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-400">
                      No Photo
                    </div>
                  )}

                </div>

                <span className="text-sm text-slate-500">
                  {newImage
                    ? "New Photo"
                    : "Current Photo"}
                </span>

              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file =
                    e.target.files[0];

                  if (file) {
                    setNewImage(file);
                  }
                }}
                className="w-full border border-slate-200 rounded-lg px-3 py-2"
              />
            </div>

            {/* Buttons */}

            <div className="flex items-end gap-2">

              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                Update Student
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingStudent(null);
                  setNewImage(null);
                }}
                className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* ===============================
          STUDENT TABLE
      =============================== */}

      <div className="bg-white border border-slate-200 rounded-xl p-5">

        <div className="flex items-center justify-between mb-4">

          <div>

            <h3 className="text-lg font-bold text-slate-900">
              All Students
            </h3>

            {selectedDate && (
              <p className="text-sm text-slate-500 mt-1">
                Attendance for:{" "}
                {selectedDate}
              </p>
            )}

          </div>

          {/* Submit Attendance */}

          <button
            type="button"
            onClick={
              handleSubmitAttendance
            }
            disabled={
              !selectedDate ||
              isSubmitting
            }
            className={`px-5 py-2 rounded-lg text-white font-medium ${
              !selectedDate ||
              isSubmitting
                ? "bg-slate-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting
              ? "Submitting..."
              : "Submit Attendance"}
          </button>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[900px]">

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
                  Email
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

                <th className="p-3 text-center whitespace-nowrap">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {paginatedStudents.map(
                (student, index) => {

                  const status =
                    attendanceStatus[
                      student._id
                    ];

                  return (
                    <tr
                      key={student._id}
                      className="border-b"
                    >

                      {/* Number */}

                      <td className="p-3">
                        {startIndex +
                          index +
                          1}
                      </td>

                      {/* Student */}

                      <td className="p-3">

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              onProfileClick(
                                student
                              )
                            }
                            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden cursor-pointer"
                          >

                            {student.photo ? (
                              <img
                                src={`http://localhost:5000${student.photo}`}
                                alt={
                                  student.name
                                }
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-xs text-slate-400">
                                Photo
                              </span>
                            )}

                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              onProfileClick(
                                student
                              )
                            }
                            className="font-medium text-blue-600 hover:underline"
                          >
                            {student.name}
                          </button>

                        </div>

                      </td>

                      {/* Roll Number */}

                      <td className="p-3">
                        {student.rollNo}
                      </td>

                      {/* Email */}

                      <td className="p-3">
                        {student.email}
                      </td>

                      {/* Course */}

                      <td className="p-3">
                        {student.course}
                      </td>

                      {/* Semester */}

                      <td className="p-3">
                        {student.semester}
                      </td>

                      {/* Attendance */}

                      <td className="p-3">

                        <div className="flex justify-center gap-2">

                          {/* P */}

                          <button
                            type="button"
                            disabled={
                              !selectedDate
                            }
                            onClick={() =>
                              handleAttendanceChange(
                                student._id,
                                "P"
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg font-semibold ${
                              status === "P"
                                ? "bg-green-600 text-white"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                            } ${
                              !selectedDate
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            P
                          </button>

                          {/* L */}

                          <button
                            type="button"
                            disabled={
                              !selectedDate
                            }
                            onClick={() =>
                              handleAttendanceChange(
                                student._id,
                                "L"
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg font-semibold ${
                              status === "L"
                                ? "bg-yellow-500 text-white"
                                : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                            } ${
                              !selectedDate
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                          >
                            L
                          </button>

                          {/* A */}

                          <button
                            type="button"
                            disabled={
                              !selectedDate
                            }
                            onClick={() =>
                              handleAttendanceChange(
                                student._id,
                                "A"
                              )
                            }
                            className={`px-3 py-1.5 rounded-lg font-semibold ${
                              status === "A"
                                ? "bg-red-600 text-white"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
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

                      {/* Action */}

                      <td className="p-3 text-center whitespace-nowrap">

                        <div className="flex items-center justify-center gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              handleEdit(
                                student
                              )
                            }
                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg whitespace-nowrap"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                student._id
                              )
                            }
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg whitespace-nowrap"
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                }
              )}

              {/* No Students */}

              {filteredStudents.length ===
                0 && (
                <tr>
                  <td
                    colSpan="8"
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

        {totalPages > 0 && (

          <div className="flex items-center justify-between mt-5">

            {/* Previous */}

            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  currentPage - 1
                )
              }
              disabled={
                currentPage === 1
              }
              className={`px-4 py-2 rounded-lg border ${
                currentPage === 1
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Previous
            </button>

            {/* Page Numbers */}

            <div className="flex items-center gap-2">

              {Array.from(
                {
                  length: totalPages,
                },
                (_, index) =>
                  index + 1
              ).map((page) => (

                <button
                  key={page}
                  type="button"
                  onClick={() =>
                    handlePageChange(
                      page
                    )
                  }
                  className={`w-9 h-9 rounded-lg ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {page}
                </button>

              ))}

            </div>

            {/* Next */}

            <button
              type="button"
              onClick={() =>
                handlePageChange(
                  currentPage + 1
                )
              }
              disabled={
                currentPage ===
                totalPages
              }
              className={`px-4 py-2 rounded-lg border ${
                currentPage ===
                totalPages
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                  : "bg-white text-slate-700 hover:bg-slate-100"
              }`}
            >
              Next
            </button>

          </div>

        )}

      </div>

    </div>
  );
};

export default StudentManagement;