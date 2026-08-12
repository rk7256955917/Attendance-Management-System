import { useState } from "react";
import StudentForm from "./StudentForm";
import StudentPreview from "./StudentPreview";

const AddStudent = () => {

  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    email: "",
    course: "",
    semester: "",
    photo: "",
  });

  const handleStudentSubmit = (data) => {
    setStudent(data);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* Form */}
      <div className="w-full lg:flex-1">
        <StudentForm onSubmit={handleStudentSubmit} />
      </div>

      {/* Preview */}
      <div className="w-full lg:w-[320px]">
        <StudentPreview student={student} />
      </div>

    </div>
  );
};

export default AddStudent;