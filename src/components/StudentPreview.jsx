const StudentPreview = ({ student = {} }) => {
  return (
 <div className="border border-slate-200 rounded-lg p-4 min-h-[310px] w-[330px] mt-25">

      <h3 className="text-center text-sm font-medium mb-4">
        Preview
      </h3>

      {/* Image */}
      <div className="w-24 h-24 rounded-full bg-slate-100 mx-auto mb-4 flex items-center justify-center overflow-hidden">

        {student.photo ? (
          <img
            src={student.photo}
            alt="Student"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-slate-400 text-sm">
            Photo
          </span>
        )}

      </div>

      {/* Student Name */}
      <h3 className="text-center font-bold text-lg mb-4">
        {student.name || "Student Name"}
      </h3>

      {/* Student Details */}
      <div className="space-y-2 text-sm">

        <div className="flex">
          <span className="w-20 shrink-0">
            Roll No.
          </span>

          <span>
            : {student.rollNo || "23CS001"}
          </span>
        </div>

        <div className="flex">
          <span className="w-20 shrink-0">
            Email
          </span>

          <span className="break-all">
            : {student.email || "student@email.com"}
          </span>
        </div>

        <div className="flex">
          <span className="w-20 shrink-0">
            Course
          </span>

          <span>
            : {student.course || "B.Tech CSE"}
          </span>
        </div>

        <div className="flex">
          <span className="w-20 shrink-0">
            Semester
          </span>

          <span>
            : {student.semester || "4"}
          </span>
        </div>

      </div>

    </div>
  );
};

export default StudentPreview;