const StudentForm = ({ onSubmit }) => {

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = {
      name: e.target.name.value,
      rollNo: e.target.rollNo.value,
      email: e.target.email.value,
      course: e.target.course.value,
      semester: e.target.semester.value,
      photo: "",
    };

    onSubmit(formData);
  };

  return (
    <div className="w-full">

      <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-5">
        Add New Student
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3">

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Full Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter full name"
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
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="">Select course</option>
            <option value="B.Tech CSE">B.Tech CSE</option>
            <option value="B.Tech IT">B.Tech IT</option>
            <option value="BCA">BCA</option>
            <option value="MCA">MCA</option>
          </select>
        </div>

        {/* Semester */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Semester
          </label>

          <select
            name="semester"
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 outline-none"
          >
            <option value="">Select semester</option>
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
            accept="image/*"
            className="w-full border border-slate-200 rounded-lg px-3 py-1.5 text-sm"
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          Add Student
        </button>

      </form>
    </div>
  );
};

export default StudentForm;