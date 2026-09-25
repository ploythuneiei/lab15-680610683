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
  // นื่องจากระบบจำลองนี้นักศึกษาหลายคนใช้ร่วมกัน โค้ดส่วนนี้จะทำหน้าที่กรองดูเฉพาะ 
  // "วิชาที่ฉัน (รหัสนักศึกษาปัจจุบัน) ลงทะเบียนไว้แล้วเท่านั้น" เพื่อเอามาแสดงผลในการ์ดของตัวเอง

  // เอาEnrollmentทั้งหมดของเรา(CURRENT_student) มากรองเอาเฉพาะที่ตรงกับcoureId ที่เราสนใจ
  const findEnrollment = (courseId: string) =>
    myEnrollments.find((e) => e.courseId === courseId);
  // ถ้าเจอ: จะคืนค่าเป็นข้อมูลการลงทะเบียนวิชานั้น (เช่น { studentId: "6501", courseId: "CS101", enrolledAt: "2026-06-01" })
  // ถ้าไม่เจอ: จะคืนค่าเป็น undefined(แปลว่ายังไม่ได้ลงทะเบียนวิชานี้)

  // วิชาที่ยังไม่ได้ลงทะเบียน — ส่งให้ Select ในฟอร์ม
  const availableCourses = courses.filter(
    (course) => !findEnrollment(course.courseId),
  );
  // เอาวิชาทั้งหมดลบออกด้วยวิชาที่เราลงทะเบียนไปแล้ว จะได้ "รายวิชาที่ยังไม่ได้ลงทะเบียน" 
  // เพื่อส่งต่อไปให้ตัวเลือก (Select) ในหน้าต่าง Dialog ตอนที่เราจะกดลงทะเบียนวิชาใหม่
  // ถ้าเจอว่ามีอยู่แล้วในของเราเราจะไม่เอาcourseนั้น

  function handleEnroll(courseId: string, enrolledAt: string) {
    setEnrollments((prev) => [
      ...prev,
      { studentId: CURRENT_STUDENT_ID, courseId, enrolledAt },
    ]);
  }
  // ทำงานตอนที่เรากดยืนยันในฟอร์ม Dialog โดยมันจะนำรหัสนักศึกษาของเรา รหัสวิชาที่เลือก และเวลาที่เลือก ไปเพิ่มต่อท้าย (...prev) 
  // เข้าไปในรายการลงทะเบียน ทำให้สถานะของวิชานั้นเปลี่ยนเป็น "ลงทะเบียนแล้ว" ทันที

  function handleCancel(courseId: string) {
    setEnrollments((prev) =>
      prev.filter(
        (e) => !(e.studentId === CURRENT_STUDENT_ID && e.courseId === courseId),
      ),
    );
  }
  // ทำงานตอนที่เรากดปุ่มรูปถังขยะ (Trash2) บนการ์ดวิชา เพื่อลบข้อมูลการลงทะเบียนวิชานั้นทิ้งไป ทำให้วิชากลับมาเป็นสถานะ "เปิดรับ" อีกครั้ง

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

        {/* ปุ่มเปิดฟอร์ม Dialog ลงทะเบียน */}
        <RegisterDialog
          availableCourses={availableCourses}
          student={currentStudent}
          onEnroll={handleEnroll}
        />
      </div>

      {/* วนลูปแสดงการ์ดรายวิชาทุกวิชา */}
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