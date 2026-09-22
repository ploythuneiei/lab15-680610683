import type { Student, Course, Enrollment } from "@/lib/types";

export const students: Student[] = [
  {
    studentId: "650610001",
    firstName: "Matt",
    lastName: "Damon",
    program: "CPE",
  },
  {
    studentId: "680610683",
    firstName: "Thunwarat",
    lastName: "Srijandon",
    program: "CPE",
    courses: ["261207", "261497"],
  },
  {
    studentId: "650610003", // ⚠️ ต้นฉบับพิมพ์ผิดเป็น "650615003" — ต้องตรงกับ enrollments ด้านล่าง
    firstName: "Emily",
    lastName: "Blunt",
    program: "ISNE",
    courses: ["269101", "261497"],
  },
];

export const courses: Course[] = [
  {
    courseId: "261207",
    courseTitle: "Basic Computer Engineering Lab",
    instructors: ["Dome", "Chanadda"],
  },
  {
    courseId: "261497",
    courseTitle: "Full Stack Development",
    instructors: ["Dome", "Nirand", "Chanadda"],
  },
  {
    courseId: "269101",
    courseTitle: "Introduction to Information Systems and Network Engineering",
    instructors: ["KENNETH COSH"],
  },
];

// enrolledAt: เวลาตัวอย่างที่ลงทะเบียนไว้แล้ว (ไว้แสดง "ลงทะเบียนเมื่อ" บนการ์ด)
export const enrollments: Enrollment[] = [
  {
    studentId: "680610683",
    courseId: "261207",
    enrolledAt: "2026-09-13T14:15:00",
  },
  {
    studentId: "680610683",
    courseId: "261497",
    enrolledAt: "2026-09-14T09:30:00",
  },
  {
    studentId: "650610003",
    courseId: "269101",
    enrolledAt: "2026-09-13T10:05:00",
  },
  {
    studentId: "650610003",
    courseId: "261497",
    enrolledAt: "2026-09-15T16:45:00",
  },
];

// นักศึกษาที่ "ล็อกอินอยู่" — ไม่มีระบบ Login/Role ในแลปนี้ จึงกำหนดไว้ที่นี่ที่เดียว
export const CURRENT_STUDENT_ID = "680610683";
export const currentStudent = students.find(
  (s) => s.studentId === CURRENT_STUDENT_ID,
)!;

// ข้อมูลส่วนแสดงสถานะผู้ใช้ที่ Sidebar (ข้อ 5 ของโจทย์) — แก้เป็นชื่อเล่นและรูปของตัวเอง
export const currentUser = {
  nickname: "Ploy",
  role: "STUDENT" as "STUDENT" | "ADMIN",
  avatar: "/profile.png", // วางรูปไว้ที่ public/
};
