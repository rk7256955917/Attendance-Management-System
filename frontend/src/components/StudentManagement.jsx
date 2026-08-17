import { useEffect, useState } from "react";

const StudentManagement = () => {
  const [students, setStudents] = useState([]);

  // Edit ke liye selected student
  const [editingStudent, setEditingStudent] = useState(null);

  // ===============================
  // GET - Students fetch
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
  // EDIT - Student
  // ===============================
  const handleEdit = (student) => {
    setEditingStudent({
      ...student,
    });
  };

  // ===============================
  // UPDATE - Student
  // ===============================
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${editingStudent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: editingStudent.name,
            rollNo: editingStudent.rollNo,
            email: editingStudent.email,
            course: editingStudent.course,
            semester: Number(editingStudent.semester),
            photo: editingStudent.photo,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Student update nahi hua"
        );
      }

      // Table me updated student
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === data._id
            ? data
            : student
        )
      );

      // Edit mode close
      setEditingStudent(null);

      alert("Student successfully update ho gaya");

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
          data.message || "Student delete nahi hua"
        );
      }

      console.log(data.message);

      // Frontend table se student remove
      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student._id !== id
        )
      );

    } catch (error) {
      console.log(
        "Delete Error:",
        error.message
      );

      alert(error.message);
    }
  };

  return (
    <div>

      {/* ===============================
          Heading
      =============================== */}
      <h2 className="text-2xl font-bold text-slate-900 mb-5">
        Student Management
      </h2>

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
                    semester: e.target.value,
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
                onClick={() => setEditingStudent(null)}
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

        <h3 className="text-lg font-bold text-slate-900 mb-4">
          All Students
        </h3>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

            {/* Table Head */}
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
                  Action
                </th>

              </tr>
            </thead>

            {/* Table Body */}
            <tbody>

              {students.map((student, index) => (

                <tr
                  key={student._id}
                  className="border-b"
                >

                  {/* Number */}
                  <td className="p-3">
                    {index + 1}
                  </td>

                  {/* Student */}
                  <td className="p-3">

                    <div className="flex items-center gap-3">

                      {/* Profile Image */}
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">

                        {student.photo ? (

                          <img
                            src={`http://localhost:5000${student.photo}`}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />

                        ) : (

                          <span className="text-xs text-slate-400">
                            Photo
                          </span>

                        )}

                      </div>

                      {/* Name */}
                      <span className="font-medium">
                        {student.name}
                      </span>

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

                  {/* Action */}
                  <td className="p-3 text-center">

                    {/* Edit */}
                    <button
                      onClick={() =>
                        handleEdit(student)
                      }
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg mr-2"
                    >
                      Edit
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        handleDelete(student._id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

              {/* No Students */}
              {students.length === 0 && (

                <tr>

                  <td
                    colSpan="7"
                    className="p-5 text-center text-slate-500"
                  >
                    No students found
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

export default StudentManagement;