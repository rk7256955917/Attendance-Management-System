import API_URL from "../api/api";
const StudentForm = ({ onSubmit }) => {

  const handleSubmit = async (e) => {
    e.preventDefault();

    const photoFile = e.target.photo.files[0];

    // ===============================
    // Preview ke liye temporary URL
    // ===============================
    const previewPhoto = photoFile
      ? URL.createObjectURL(photoFile)
      : "";

    // ===============================
    // Backend FormData
    // ===============================
    const formData = new FormData();

    formData.append("name", e.target.name.value);
    formData.append("rollNo", e.target.rollNo.value);
    formData.append("email", e.target.email.value);
    formData.append("course", e.target.course.value);

    formData.append(
      "semester",
      Number(e.target.semester.value)
    );

    if (photoFile) {
      formData.append("photo", photoFile);
    }

    try {

      const response = await fetch(
        `${API_URL}/api/students`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Student add nahi hua"
        );
      }

      console.log("Student added:", data);

      // ===============================
      // PreviewCard ke liye
      // ===============================
      const studentData = {
        ...data,
        photo: previewPhoto || data.photo,
      };

      onSubmit(studentData);

      // Form clear
      e.target.reset();

    } catch (error) {

      console.log(
        "Error:",
        error.message
      );

      alert(error.message);
    }
  };


  return (
    <div>

      <h2 className="text-2xl font-bold text-slate-900 mb-5">
        Add New Student
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-3"
      >

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter full name"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* Roll Number */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Roll Number
          </label>

          <input
            type="text"
            name="rollNo"
            placeholder="Enter roll number"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email
          </label>

          <input
            type="email"
            name="email"
            placeholder="Enter email address"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>


        {/* Course */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Course
          </label>

          <select
            name="course"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="">
              Select course
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
            name="semester"
            required
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="">
              Select semester
            </option>

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

          <input
            type="file"
            name="photo"
            accept="image/*"
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5"
          />
        </div>


        {/* Button */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Add Student
        </button>

      </form>

    </div>
  );
};

export default StudentForm;