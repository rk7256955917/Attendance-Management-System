import { useState } from "react";

import StudentForm from "./StudentForm";
import StudentPreview from "./StudentPreview";

const AddStudent = ({ onAddStudent }) => {

  const [student, setStudent] = useState({
    name: "",
    rollNo: "",
    email: "",
    course: "",
    semester: "",
    photo: "",
  });


  // Form se data receive hoga
  const handleFormSubmit = (formData) => {

    setStudent(formData);

    // App.jsx ko student bhejna
    onAddStudent(formData);
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

      {/* Form */}
      <StudentForm onSubmit={handleFormSubmit} />

      {/* Preview */}
      <StudentPreview student={student} />

    </div>
  );
};

export default AddStudent;