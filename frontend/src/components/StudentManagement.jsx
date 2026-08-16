import { useEffect, useState } from "react";

const StudentManagement = () => {

  const [students, setStudents] = useState([]);


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
  // DELETE - Student
  // ===============================
  const handleDelete = async (id) => {

    // Confirmation
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


      // Frontend table se bhi student remove
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

    }

  };


  return (
    <div>

      {/* Heading */}
      <h2 className="text-2xl font-bold text-slate-900 mb-5">
        Student Management
      </h2>


      {/* Student Table */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">

        <h3 className="text-lg font-bold text-slate-900 mb-4">
          All Students
        </h3>


        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

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

                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">

                        {student.photo ? (

                          <img
                            src={student.photo}
                            alt={student.name}
                            className="w-full h-full object-cover"
                          />

                        ) : (

                          <span className="text-xs text-slate-400">
                            Photo
                          </span>

                        )}

                      </div>


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