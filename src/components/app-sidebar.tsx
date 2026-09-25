import { BookOpen, Home } from "lucide-react";
import { Link, useLocation } from "react-router";

import { currentUser } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "หน้าแรก", url: "/", icon: Home },
  { title: "ลงทะเบียนเรียน", url: "/enrollment", icon: BookOpen },
  // { title: "ตารางเรียน", url: "/schedule", icon: Calendar },
  // { title: "ตั้งค่า", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-1 text-sm font-semibold">CPE &amp; ISNE</div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>เมนูหลัก</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={location.pathname === item.url}
                    render={<Link to={item.url} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <div className="flex items-center gap-2 px-2 py-1">
          {/* จัดเลย์เอาต์แบบแนวนอน (Flexbox) ให้รูปโปรไฟล์กับข้อความอยู่บรรทัดเดียวกัน เว้นระยะห่างระหว่างกันนิดหน่อย (gap-2) และเว้นขอบรอบๆ (px-2 py-1) */}
          <Avatar>
            <AvatarImage src={currentUser.avatar} alt={currentUser.nickname} />
            {/* alt (ย่อมาจากคำว่า Alternative text หรือข้อความทางเลือก) ในบรรทัดนี้คือ "ข้อความอธิบายรูปภาพ" ครับ */}
            <AvatarFallback>{currentUser.nickname.charAt(0)}</AvatarFallback>
            {/* <AvatarFallback>: ถ้าเกิดรูปภาพโหลดไม่ขึ้นหรือไม่มีรูป ระบบจะแสดงตัวอักษรสำรองแทน โดยใช้คำสั่ง {currentUser.nickname.charAt(0)} 
            เพื่อ "ดึงตัวอักษรตัวแรกของชื่อเล่น" มาแสดงเป็นตัวย่อ (เช่น ชื่อ "Bank" จะแสดงตัวอักษร "B") */}
          </Avatar>
          <div className="flex flex-col items-start ">
            {/* จัดเรียงข้อความในแนวตั้ง (ชื่ออยู่ด้านบน, ป้ายสถานะอยู่ด้านล่าง) */}
            <span className="text-sm font-medium">{currentUser.nickname}</span>
            <Badge variant="outline">{currentUser.role}</Badge>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}