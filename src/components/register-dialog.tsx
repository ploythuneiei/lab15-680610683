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
  // คำสั่งนี้เป็นการสร้างตัวแปรเก็บเวลาปัจจุบันของเครื่อง 
  // (เช่น ได้วันที่และเวลาปัจจุบันทั้งหมดมา เช่น 2026-06-06T14:5:3.123Z)
  const hh = String(now.getHours()).padStart(2, "0");
  //now.getHours(): ดึงเฉพาะ "ชั่วโมง" ออกมา (ระบบ 24 ชั่วโมง เช่น บ่ายสองโมง จะได้เลข 14)
  // String(...): แปลงเลขนั้นให้เป็นตัวอักษร(String)
  // .padStart(2, "0"): ตรงนี้สำคัญมาก! คือคำสั่งบอกว่า "ถ้าความยาวของตัวอักษรยังไม่ถึง 2 หลัก ให้เติมเลข 0 ข้างหน้า"
  // เช่น ถ้าตอนนี้คือตี 3(3) จะถูกเติมเลข 0 กลายเป็น "03"
  // ถ้าตอนนี้คือบ่ายสอง(14) ครบ 2 หลักแล้ว ก็ปล่อยไว้เป็น "14"
  const mm = String(now.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
  // จับชั่วโมงและนาทีมาเชื่อมต่อกันด้วยเครื่องหมายโคลอน :
}

// เอาวันที่ปัจจุบันมารวมกับเวลาที่เลือก แปลงเป็นรูปแบบมาตรฐาน ISO เช่น "2026-09-21T14:15:00"
// รวมวันที่วันนี้กับเวลาที่เลือก ให้เป็น ISO 8601 เช่น "2026-09-21T14:15:00"
function toIsoDateTime(time: string) {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  // ดึงเดือนปัจจุบัน (ต้อง +1 เสมอเพราะเดือนใน JavaScript นับตั้งแต่ 0-11
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
  // ถ้าผู้ใช้กดปุ่มเปิดฟอร์ม: ตัวแปร nextOpen จะมีค่าเป็น trueโค้ดจะเข้าไปทำในบล็อก 
  // if (nextOpen) สั่งเคลียร์ค่าวิชา (setCourseId("")) และดึงเวลาปัจจุบันมาใส่ (setTime(currentTimeValue()))
  // จากนั้นจึงสั่งเปลี่ยนสถานะจริง ๆ setOpen(true) เพื่อให้หน้าต่างเด้งขึ้นมา

  //ฟังก์ชันกดยืนยันการส่งฟอร์ม (handleSubmit)
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // ป้องกันไม่ให้เว็บรีเฟรชเองตามพฤติกรรมเดิมของ HTML Form
    if (!courseId) return; // ถ้ายังไม่ได้เลือกวิชา ให้หยุดทำงานทันที

    onEnroll(courseId, toIsoDateTime(time)); // ส่งรหัสวิชาและเวลาที่จัดรูปแบบแล้วกลับไปที่หน้าหลัก
    setOpen(false); // ปิดหน้าต่าง Dialog
  }
  //ทำงานตอนที่เรากดปุ่ม "ยืนยันการลงทะเบียน" โดยมันจะเช็คก่อนว่าเลือกวิชาหรือยัง
  //ถ้าเลือกแล้วจะส่งข้อมูลกลับไปบันทึกที่หน้าหลัก แล้วปิดหน้าต่างลง

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {/* ตัว open ตัวแรก (หน้าเครื่องหมาย =) คือ Prop หรือคุณสมบัติของคอมโพเนนต์ Dialog ที่บอกว่า "ตอนนี้หน้าต่างควรจะเปิดหรือปิดอยู่"
      ตัว {open} ตัวหลัง (ในปีกกา) คือ State ที่เราสร้างไว้ข้างบนด้วย const [open, setOpen] = useState(false) */}

      {/* หน้าที่: เป็นปุ่มที่แสดงอยู่บนหน้าจอหลัก (ที่มีไอคอนรูปคน UserPlus และคำว่า "ลงทะเบียน") เมื่อมีคนมากดปุ่มนี้ มันจะไปสั่งให้ตัว Dialog เปิดขึ้นมา
      render={<Button/>}: เป็นลูกเล่นของการเขียนคอมโพเนนต์ (เช่น ชิ้นส่วน UI จากไลบรารีอย่าง Shadcn UI) ที่บอกว่า 
      "ให้แปลงร่างตัวกระตุ้นนี้ให้กลายเป็นปุ่มกดปกติ (<Button/>) พร้อมรับดีไซน์และคุณสมบัติของปุ่มมาใช้เลย" */}
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
              //   หน้าที่:เป็นการบอกว่า "ตอนนี้กล่องดรอปดาวน์กำลังเลือกวิชาไหนอยู่"
              // โดยจะดึงค่ามาจากตัวแปร State courseId ที่เราเก็บไว้ (ถ้าผู้ใช้ยังไม่ได้เลือก ค่าจะเป็นข้อความว่าง "")
              onValueChange={(value) => setCourseId((value as string) ?? "")}
            //   (value) คือค่ารหัสวิชาอันใหม่ที่ผู้ใช้เพิ่งกดเลือก
            // (value as string) เป็นการบังคับบอก TypeScript ว่าค่านี้เป็นข้อความแน่ๆนะ
            // ?? "" เป็นเครื่องหมายป้องกันข้อผิดพลาด (Nullish Coalescing) แปลว่า "ถ้าเกิดบังเอิญค่าที่ส่งมามันดันเป็นค่าว่างหรือพัง ให้ใช้ค่าว่าง "" แทน"
            >
              <SelectTrigger
                id="courseId"
                className="w-full! min-w-0! [&>span]:min-w-0 [&>span]:truncate"
              >
                {/* แยกดูทีละคลาส (Tailwind CSS)
                w-full! = บังคับให้ปุ่มดรอปดาวน์นี้มีความกว้างเต็มพื้นที่ของกรอบที่มันอยู่ (100%)
                min-w-0! = จุดสำคัญมากใน Flexbox/Grid: ปกติแล้ว Element ลูกในเว็บมักจะมีขนาดขั้นต่ำบังคับไว้ (min-width) 
                ทำให้บางครั้งข้อความยาวๆ ไปดันจนกล่องพังหรือล้นจอ คลาสนี้สั่งลบขนาดขั้นต่ำนั้นทิ้งไป เพื่อให้มันยืดหดได้อย่างอิสระ
                [&>span]:min-w-0 = เครื่องหมาย [&>span] เป็นตัวเลือก (Selector) ของ Tailwind ที่หมายถึง "เลือกแท็ก <span> 
                ลูกตัวแรกที่อยู่ข้างในปุ่มนี้โดยตรง" แล้วสั่งให้ตัว <span> นั้นมี min-w-0 ด้วย เพื่อป้องกันไม่ให้ข้อความข้างในไปฝืนขยายกล่องจนเสียทรง
                [&>span]:truncate = คำว่า truncate คือการสั่งตัดข้อความให้เป็นจุดไข่ปลา (...) ทันทีถ้ายาวเกินกรอบช่อง
                ประโยชน์: ป้องกันไม่ให้ชื่อวิชาที่ยาวมากๆ มาเบียดจนหน้าจอหรือปุ่มพัง ถ้าพื้นที่ไม่พอ มันจะย่อเป็น ... ให้โดยอัตโนมัติ */}

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