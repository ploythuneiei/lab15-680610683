import { useState } from "react";
import { UserPlus } from "lucide-react";

import type { Course, Student } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type RegisterDialogProps = {
  /** เฉพาะวิชาที่ยังไม่ได้ลงทะเบียน */
  availableCourses: Course[];
  student: Student;
  onEnroll: (courseId: string, enrolledAt: string) => void;
};

// เวลาปัจจุบันในรูปแบบที่ input type="time" ต้องการ เช่น "14:15"
function currentTimeValue() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// รวมวันที่วันนี้กับเวลาที่เลือก ให้เป็น ISO 8601 เช่น "2026-09-21T14:15:00"
function toIsoDateTime(time: string) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${time}:00`;
}

export function RegisterDialog({
  availableCourses,
  student,
  onEnroll,
}: RegisterDialogProps) {
  const [open, setOpen] = useState(false);
  const [courseId, setCourseId] = useState("");
  const [time, setTime] = useState(currentTimeValue);

  const selectedCourse = availableCourses.find((c) => c.courseId === courseId);

  // เปิดฟอร์มใหม่ทุกครั้งให้เคลียร์ค่าเดิม และตั้งเวลาเป็นเวลาปัจจุบัน
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setCourseId("");
      setTime(currentTimeValue());
    }
    setOpen(nextOpen);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!courseId) return;

    onEnroll(courseId, toIsoDateTime(time));
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button />}>
        <UserPlus />
        ลงทะเบียน
      </DialogTrigger>

      <DialogContent className="[&>*]:min-w-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>ลงทะเบียนรายวิชา</DialogTitle>
            <DialogDescription>กรอกข้อมูลเพื่อลงทะเบียน</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="courseId">วิชา</Label>
            <Select
              value={courseId}
              onValueChange={(value) => setCourseId((value as string) ?? "")}
            >
              <SelectTrigger
                id="courseId"
                className="w-full! min-w-0! [&>span]:min-w-0 [&>span]:truncate"
              >
                <SelectValue>
                  {selectedCourse ? (
                    `${selectedCourse.courseId} – ${selectedCourse.courseTitle}`
                  ) : (
                    <span className="text-muted-foreground">เลือกวิชา</span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                alignItemWithTrigger={false}
                className="[&_*]:whitespace-normal"
              >
                {availableCourses.map((course) => (
                  <SelectItem key={course.courseId} value={course.courseId}>
                    {course.courseId} – {course.courseTitle}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">เวลา</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="studentName">ชื่อ นศ.</Label>
            <Input
              id="studentName"
              readOnly
              value={`${student.firstName} ${student.lastName}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">โปรแกรม</Label>
            <Input id="program" readOnly value={student.program} />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={!courseId}>
              ยืนยันการลงทะเบียน
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}