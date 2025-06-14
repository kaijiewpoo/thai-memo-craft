
import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

const ThaiMemoForm = () => {
  const { toast } = useToast();
  
  const initialData = {
    department: "",
    referenceNumber: "",
    date: new Date(),
    subject: "",
    recipient: "",
    referencedDoc: "",
    attachments: "",
    mainContent: "ตามที่ (ระบุเรื่องเดิม)... จึงเรียนมาเพื่อโปรดพิจารณา/ทราบ/ดำเนินการต่อไป",
    signerName: "",
    signerPosition: "",
  };

  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({ ...prev, date }));
    }
  };

  const handleGeneratePdf = () => {
    console.log("Generating PDF with data:", JSON.stringify(formData, null, 2));
    toast({
      title: "เตรียมสร้าง PDF",
      description: "ข้อมูลถูกรวบรวมในคอนโซล และพร้อมส่งไปยังระบบหลังบ้านเพื่อสร้างเป็นไฟล์ PDF",
    });
  };
  
  const handleSaveData = () => {
    console.log("Saving data:", JSON.stringify(formData, null, 2));
    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      description: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว (จำลอง)",
    });
  };

  const handleClearForm = () => {
    setFormData(initialData);
    toast({
      title: "ล้างข้อมูล",
      description: "ข้อมูลในฟอร์มทั้งหมดถูกล้างแล้ว",
    });
  };

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-800 p-4 sm:p-8 flex justify-center items-start font-sarabun">
      <div className="w-[21cm] min-h-[29.7cm] bg-white dark:bg-gray-900 shadow-2xl pt-[2.5cm] pr-[2cm] pb-[2.5cm] pl-[3cm] text-black dark:text-white">
        <header className="flex flex-col items-center">
          <img src="/garuda.svg" alt="ตราครุฑ" className="h-[3cm] w-auto" />
          <h1 className="text-[25pt] font-bold mt-[1.0cm]">บันทึกข้อความ</h1>
        </header>

        <main className="mt-[1.0cm] text-[16pt]">
          <div className="space-y-3">
            <div className="flex items-baseline gap-4">
              <Label htmlFor="department" className="w-[120px]">ส่วนราชการ</Label>
              <Input id="department" name="department" value={formData.department} onChange={handleInputChange} placeholder="ระบุหน่วยงาน" className="text-[16pt] flex-1"/>
            </div>
            <div className="flex items-baseline gap-4">
              <Label htmlFor="referenceNumber" className="w-[120px]">ที่</Label>
              <Input id="referenceNumber" name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} placeholder="ระบุเลขที่หนังสือ" className="text-[16pt] flex-1"/>
              <Label htmlFor="date" className="ml-8">วันที่</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[280px] justify-start text-left font-normal text-[16pt]",
                      !formData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? format(formData.date, "d MMMM yyyy", { locale: th }) : <span>เลือกวันที่</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={handleDateChange}
                    initialFocus
                    locale={th}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="flex items-baseline gap-4">
              <Label htmlFor="subject" className="w-[120px]">เรื่อง</Label>
              <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="ระบุเรื่องของบันทึกข้อความ" className="text-[16pt] flex-1"/>
            </div>
            <div className="flex items-baseline gap-4">
              <Label htmlFor="recipient" className="w-[120px]">เรียน</Label>
              <Input id="recipient" name="recipient" value={formData.recipient} onChange={handleInputChange} placeholder="ระบุผู้รับ" className="text-[16pt] flex-1"/>
            </div>
            <div className="flex items-baseline gap-4">
              <Label htmlFor="referencedDoc" className="w-[120px]">อ้างถึง</Label>
              <Input id="referencedDoc" name="referencedDoc" value={formData.referencedDoc} onChange={handleInputChange} placeholder="ระบุเอกสารอ้างถึง (ถ้ามี)" className="text-[16pt] flex-1"/>
            </div>
            <div className="flex items-baseline gap-4">
              <Label htmlFor="attachments" className="w-[120px]">สิ่งที่ส่งมาด้วย</Label>
              <Input id="attachments" name="attachments" value={formData.attachments} onChange={handleInputChange} placeholder="ระบุเอกสารแนบ (ถ้ามี)" className="text-[16pt] flex-1"/>
            </div>
          </div>
          
          <div className="mt-4">
             <Textarea
              name="mainContent"
              value={formData.mainContent}
              onChange={handleInputChange}
              className="w-full text-[16pt] leading-relaxed border-none focus:ring-0 shadow-none bg-transparent p-0 [text-indent:2.5cm]"
              rows={15}
            />
          </div>

          <div className="flex justify-end mt-8">
            <div className="w-2/5 text-center space-y-2">
               <p className="h-[2em]">(ลงชื่อ).....................................................</p>
              <div>
                <Input name="signerName" value={formData.signerName} onChange={handleInputChange} className="text-center text-[16pt] border-none shadow-none focus:ring-0 p-0" placeholder="(นาย/นาง/นางสาว....................................)"/>
              </div>
              <div>
                 <Input name="signerPosition" value={formData.signerPosition} onChange={handleInputChange} className="text-center text-[16pt] border-none shadow-none focus:ring-0 p-0" placeholder="(ตำแหน่ง....................................)"/>
              </div>
            </div>
          </div>
        </main>
      </div>
      <div className="fixed bottom-4 right-4 flex flex-col gap-3">
          <Button onClick={handleGeneratePdf} className="bg-blue-600 hover:bg-blue-700">สร้าง PDF</Button>
          <Button onClick={handleSaveData} className="bg-green-600 hover:bg-green-700">บันทึกข้อมูล</Button>
          <Button onClick={handleClearForm} variant="destructive">ล้างข้อมูล</Button>
      </div>
    </div>
  );
};

export default ThaiMemoForm;
