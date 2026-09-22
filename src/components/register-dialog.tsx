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

// ดึงเวลาปัจจุบันในเครื่อง เช่น "14:15"
// เวลาปัจจุบันในรูปแบบที่ input type="time" ต้องการ เช่น "14:15"
function currentTimeValue() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

// เอาวันที่ปัจจุบันมารวมกับเวลาที่เลือก แปลงเป็นรูปแบบมาตรฐาน ISO เช่น "2026-09-21T14:15:00"
// รวมวันที่วันนี้กับเวลาที่เลือก ให้เป็น ISO 8601 เช่น "2026-09-21T14:15:00"
function toIsoDateTime(time: string) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${time}:00`;
}

//สองฟังก์ชันนี้มีไว้จัดการเรื่องเวลา โดยอันแรกจะคอยดึงเวลาปัจจุบันมาใส่ช่องกรอกเวลาให้อัตโนมัติเวลาเปิดฟอร์ม 
//ส่วนอันที่สองแปลงเวลาและวันที่ให้เป็นรูปแบบมาตรฐานสากล เพื่อส่งกลับไปบันทึกประวัติการลงทะเบียน

export function RegisterDialog({
  availableCourses,
  student,
  onEnroll,
}: RegisterDialogProps) {
  const [open, setOpen] = useState(false); // เปิด/ปิด หน้าต่าง Dialog
  const [courseId, setCourseId] = useState(""); // เก็บค่ารหัสวิชาที่ผู้ใช้เลือกจาก Dropdown
  const [time, setTime] = useState(currentTimeValue); // เก็บค่าเวลาที่กรอก

  const selectedCourse = availableCourses.find((c) => c.courseId === courseId);

  // เปิดฟอร์มใหม่ทุกครั้งให้เคลียร์ค่าเดิม และตั้งเวลาเป็นเวลาปัจจุบัน
  function handleOpenChange(nextOpen: boolean) {
    if (nextOpen) {
      setCourseId("");
      setTime(currentTimeValue());
    }
    setOpen(nextOpen);
  }
  //ทุกครั้งที่เรากดเปิดหน้าต่าง Dialog ขึ้นมาใหม่ โค้ดนี้จะสั่งเคลียร์ช่องเลือกวิชาให้ว่างเปล่า
  //และรีเซ็ตเวลาให้เป็นเวลาปัจจุบันเสมอ เพื่อไม่ให้มีข้อมูลเก่าค้างอยู่

  //ฟังก์ชันกดยืนยันการส่งฟอร์ม (handleSubmit)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!courseId) return; // ถ้ายังไม่ได้เลือกวิชา ให้หยุดทำงานทันที

    onEnroll(courseId, toIsoDateTime(time)); // ส่งรหัสวิชาและเวลาที่จัดรูปแบบแล้วกลับไปที่หน้าหลัก
    setOpen(false); // ปิดหน้าต่าง Dialog
  }
  //ทำงานตอนที่เรากดปุ่ม "ยืนยันการลงทะเบียน" โดยมันจะเช็คก่อนว่าเลือกวิชาหรือยัง
  //ถ้าเลือกแล้วจะส่งข้อมูลกลับไปบันทึกที่หน้าหลัก แล้วปิดหน้าต่างลง

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* ปุ่มกดเปิด Dialog: ใช้คอมโพเนนต์ <DialogTrigger> 
      ครอบปุ่มที่มีไอคอน <UserPlus /> และข้อความ "ลงทะเบียน" */}
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
            {/* ช่องเลือกวิชา (Select): วนลูปแสดงรายวิชาที่ยังไม่ได้ลง 
            (availableCourses) ออกมาเป็นตัวเลือกในดรอปดาวน์ */}
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

          {/* ช่องกรอกเวลา (Input type="time"): ให้ผู้ใช้เลือกหรือแก้ไขเวลาได้ตามต้องการ */}
          <div className="space-y-2">
            <Label htmlFor="time">เวลา</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          {/* ช่องชื่อ นศ. และโปรแกรม: ตั้งเป็น readOnly (อ่านอย่างเดียว แก้ไขไม่ได้) 
          โดยดึงชื่อและโปรแกรมของนักศึกษาปัจจุบันมาแสดงล็อกไว้ให้อัตโนมัติ */}
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
            {/* ปุ่มยืนยัน (DialogFooter): ปุ่ม "ยืนยันการลงทะเบียน" จะถูกตั้งค่า disabled={!courseId} เอาไว้ 
            หมายความว่า ถ้ายังไม่กดเลือกวิชา ปุ่มนี้จะกดไม่ได้ เพื่อป้องกันการกดส่งข้อมูลเปล่าๆ */}
            <Button type="submit" disabled={!courseId}>
              ยืนยันการลงทะเบียน
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}