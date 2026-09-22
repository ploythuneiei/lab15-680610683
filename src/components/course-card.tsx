import { Trash2 } from "lucide-react";

import type { Course, Student } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type CourseCardProps = {
  course: Course;
  student: Student;
  enrolledAt?: string;
  onCancel: (courseId: string) => void;
};

// แปลงเวลาแบบ ISO ให้เป็นวันที่ปี พ.ศ. เช่น "13 ก.ย. 2569 14:15"
function formatThaiDateTime(iso: string) {
  return new Intl.DateTimeFormat("th-TH-u-ca-buddhist", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(iso));
}

export function CourseCard({
  course,
  student,
  enrolledAt,
  onCancel,
}: CourseCardProps) {
  // ไม่มี enrolledAt = ยังไม่ได้ลงทะเบียนวิชานี้
  const isEnrolled = Boolean(enrolledAt);

  // ข้อ 3: Light = ลงทะเบียนแล้วสีอำพัน / เปิดรับสีม่วง, Dark = สลับกัน
  const badgeClassName = isEnrolled
    ? "bg-amber-100 text-amber-800 dark:bg-purple-500/20 dark:text-purple-300"
    : "bg-purple-100 text-purple-700 dark:bg-amber-500/20 dark:text-amber-300";

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <CardTitle className="text-base">{course.courseTitle}</CardTitle>
          <CardDescription>
            รหัสวิชา: {course.courseId} · ผู้สอน:{" "}
            {course.instructors.join(", ")}
          </CardDescription>
        </div>

        <Badge className={badgeClassName}>
          {isEnrolled ? "ลงทะเบียนแล้ว" : "เปิดรับ"}
        </Badge>
      </CardHeader>

      {/* ข้อมูลผู้ลงทะเบียนและปุ่มยกเลิก แสดงเฉพาะวิชาที่ลงทะเบียนแล้ว */}
      {isEnrolled && (
        <CardContent className="flex items-end justify-between">
          <div className="text-xs text-muted-foreground">
            <p>
              ชื่อ นศ.: {student.firstName} {student.lastName}
            </p>
            <p>โปรแกรม: {student.program}</p>
            <p>ลงทะเบียนเมื่อ: {formatThaiDateTime(enrolledAt!)}</p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            aria-label={`ยกเลิกการลงทะเบียน ${course.courseTitle}`}
            onClick={() => onCancel(course.courseId)}
          >
            <Trash2 className="text-destructive" />
          </Button>
        </CardContent>
      )}
    </Card>
  );
}