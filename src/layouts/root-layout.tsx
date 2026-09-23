import { Outlet } from "react-router";

import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function RootLayout() {
  return (
    // <SidebarProvider> เป็นตัวกลางคอยควบคุมการเปิด-ปิดของแถบเมนูด้านซ้าย
    // <AppSidebar /> เรียกแถบเมนูด้านซ้ายที่เราเขียนไว้มาแสดงผล
    // < SidebarInset > คือพื้นที่หน้าต่างหลักทางฝั่งขวา(ฝั่งเนื้อหาเว็บทั้งหมด)
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-14 items-center justify-between gap-2 border-b px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger />
            <Separator orientation="vertical" className="h-4" />
            {/* ฝั่งซ้าย: มีปุ่มกดพับ/ขยาย Sidebar (SidebarTrigger) และข้อความชื่อระบบว่า "ระบบลงทะเบียนเรียน" */}
            <span className="text-sm font-medium">ระบบลงทะเบียนเรียน</span>
          </div>
          <ModeToggle />
        </header>

        <main className="flex-1 p-4">
          <Outlet />
        </main>

        {/* ข้อ 4: แก้เป็นชื่อ-นามสกุลจริงของตัวเอง */}
        <footer className="border-t p-4 text-center text-xs text-muted-foreground">
          จัดทำโดย ธัลวรัตน์ ศรีจันทร์ดร รหัสนักศึกษา 680610683
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}

