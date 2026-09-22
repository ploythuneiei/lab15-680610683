import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center py-6 px-4">
      <Card className="w-full max-w-md">
        <CardHeader >
          <CardTitle>
            ระบบลงทะเบียนเรียน CPE & ISNE
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Button asChild size="sm">
            <Link to="/enrollment">ไปหน้าลงทะเบียนเรียน</Link>
          </Button>
        </CardContent>
      </Card>
      <footer className="border-t p-4 text-center text-xs text-muted-foreground">
        จัดทำโดย ธัลวรัตน์ ศรีจันทร์ดร รหัสนักศึกษา 680610683
      </footer>
    </div>
  );
}