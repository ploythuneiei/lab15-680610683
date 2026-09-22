import { useState } from "react";

import { CourseCard } from "@/components/course-card";
import { RegisterDialog } from "@/components/register-dialog";
import {
  CURRENT_STUDENT_ID,
  courses,
  currentStudent,
  enrollments as initialEnrollments,
} from "@/lib/mock-data";

export default function EnrollmentPage() {
  const [enrollments, setEnrollments] = useState(initialEnrollments);

  // การลงทะเบียนของนักศึกษาที่ล็อกอินอยู่เท่านั้น
  const myEnrollments = enrollments.filter(
    (e) => e.studentId === CURRENT_STUDENT_ID,
  );

  const findEnrollment = (courseId: string) =>
    myEnrollments.find((e) => e.courseId === courseId);

  // วิชาที่ยังไม่ได้ลงทะเบียน — ส่งให้ Select ในฟอร์ม
  const availableCourses = courses.filter(
    (course) => !findEnrollment(course.courseId),
  );

  function handleEnroll(courseId: string, enrolledAt: string) {
    setEnrollments((prev) => [
      ...prev,
      { studentId: CURRENT_STUDENT_ID, courseId, enrolledAt },
    ]);
  }

  function handleCancel(courseId: string) {
    setEnrollments((prev) =>
      prev.filter(
        (e) => !(e.studentId === CURRENT_STUDENT_ID && e.courseId === courseId),
      ),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">รายวิชาทั้งหมด</h1>
          <p className="text-sm text-muted-foreground">
            {currentStudent.firstName} {currentStudent.lastName} (
            {currentStudent.studentId})
          </p>
        </div>

        <RegisterDialog
          availableCourses={availableCourses}
          student={currentStudent}
          onEnroll={handleEnroll}
        />
      </div>

      <div className="flex flex-col gap-4">
        {courses.map((course) => (
          <CourseCard
            key={course.courseId}
            course={course}
            student={currentStudent}
            enrolledAt={findEnrollment(course.courseId)?.enrolledAt}
            onCancel={handleCancel}
          />
        ))}
      </div>
    </div>
  );
}