import * as React from "react";
import { useState } from "react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";

const ThaiMemoForm = () => {
  const { toast } = useToast();
  
  const initialData = {
    department: "",
    referenceNumber: "",
    date: undefined as Date | undefined,
    subject: "",
    salutation: "",
    referenceTo: "",
    attachments: "",
    reason: "",
    objective: "",
    conclusion: "",
    signerPrefix: "",
    signerName: "",
    signerPosition: ""
  };

  const [formData, setFormData] = useState(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        date
      }));
    }
  };

  const handleGeneratePdf = () => {
    console.log("Generating PDF with data:", JSON.stringify(formData, null, 2));
    toast({
      title: "เตรียมสร้าง PDF",
      description: "ข้อมูลถูกรวบรวมในคอนโซล และพร้อมส่งไปยังระบบหลังบ้านเพื่อสร้างเป็นไฟล์ PDF"
    });
  };

  const handleSaveData = () => {
    console.log("Saving data:", JSON.stringify(formData, null, 2));
    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      description: "ข้อมูลถูกบันทึกเรียบร้อยแล้ว (จำลอง)"
    });
  };

  const handleClearForm = () => {
    setFormData(initialData);
    toast({
      title: "ล้างข้อมูล",
      description: "ข้อมูลในฟอร์มทั้งหมดถูกล้างแล้ว"
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const inputStyle = "text-[23px] flex-1 ml-2 p-0 h-auto border-0 border-b border-dotted border-black rounded-none focus-visible:ring-0 shadow-none bg-transparent focus:bg-transparent bg-transparent";
  const placeholderStyle = "placeholder:italic placeholder:text-gray-400/80";

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-800 p-8 pt-[1.5cm] flex justify-center items-start font-sarabun relative print:bg-white">
      {/* A4 PAPER FRAME */}
      <div className="relative w-[21cm] min-h-[29.7cm] bg-white dark:bg-gray-900 shadow-2xl pt-[1.5cm] pr-[2cm] pb-[2.5cm] pl-[3cm] text-black dark:text-white print:shadow-none print:pt-[1.5cm] print:pr-[2cm] print:pb-[2.5cm] print:pl-[3cm] print:text-black print:dark:text-black print:mx-0 print:my-0">
        
        {/* เอกสารเนื้อหาทั้งหมด */}
        <header className="relative mb-4">
          <img src="/lovable-uploads/d64c17a9-6046-4448-8853-8d2e2b3cd47c.png" alt="ตราครุฑ" className="absolute -top-[0.2cm] -left-[0.2cm] h-[1.5cm] w-auto" />
          <h1 className="text-[25pt] font-bold text-center pt-[0.5cm]">บันทึกข้อความ</h1>
        </header>

        {/* MAIN CONTENT */}
        <main className="text-[16pt]">
          <div className="space-y-1">
            <div className="flex items-baseline">
              <Label htmlFor="department" className="shrink-0 text-[17pt] font-bold">ส่วนราชการ</Label>
              <Input 
                id="department" 
                name="department" 
                value={formData.department} 
                onChange={handleInputChange}
                className={cn(inputStyle, placeholderStyle)}
                placeholder="กรอกข้อมูล"
              />
            </div>

            <div className="flex items-baseline gap-8">
              <div className="flex items-baseline w-1/2">
                <Label htmlFor="referenceNumber" className="shrink-0 text-[17pt] font-bold">ที่</Label>
                <Input 
                  id="referenceNumber" 
                  name="referenceNumber" 
                  value={formData.referenceNumber} 
                  onChange={handleInputChange}
                  className={cn(inputStyle, placeholderStyle)}
                  placeholder="กรอกข้อมูล"
                />
              </div>
              <div className="flex items-baseline w-1/2">
                <Label htmlFor="date" className="shrink-0 text-[17pt] font-bold">วันที่</Label>
                <div className="flex-1 ml-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"ghost"}
                        className={cn(
                          "w-full justify-start text-left font-normal text-[23px] p-0 h-auto border-b border-dotted border-black rounded-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent",
                          !formData.date && "text-muted-foreground"
                        )}
                      >
                        {formData.date ? (
                          format(formData.date, "d MMMM yyyy", { locale: th })
                        ) : (
                          <span className={cn("italic text-gray-400/80", placeholderStyle)}>วัน เดือน ปี</span>
                        )}
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
              </div>
            </div>

            <div className="flex items-baseline">
              <Label htmlFor="subject" className="shrink-0 text-[17pt] font-bold">เรื่อง</Label>
              <Input 
                id="subject" 
                name="subject" 
                value={formData.subject} 
                onChange={handleInputChange}
                className={cn(inputStyle, placeholderStyle)}
                placeholder="กรอกข้อมูล"
              />
            </div>

            <div className="flex items-baseline">
              <Label htmlFor="salutation" className="shrink-0 text-[17pt] font-bold">เรียน</Label>
              <Input 
                id="salutation" 
                name="salutation" 
                value={formData.salutation} 
                onChange={handleInputChange}
                className={cn(inputStyle, placeholderStyle)}
                placeholder="กรอกข้อมูล"
              />
            </div>

            <div className="flex items-baseline">
              <Label htmlFor="referenceTo" className="shrink-0 text-[17pt]">อ้างถึง</Label>
              <Input 
                id="referenceTo" 
                name="referenceTo" 
                value={formData.referenceTo} 
                onChange={handleInputChange}
                className={cn(inputStyle, placeholderStyle)}
                placeholder="กรอกข้อมูล"
              />
            </div>

            <div className="flex items-baseline">
              <Label htmlFor="attachments" className="shrink-0 text-[17pt]">สิ่งที่ส่งมาด้วย</Label>
              <Input 
                id="attachments" 
                name="attachments" 
                value={formData.attachments} 
                onChange={handleInputChange}
                className={cn(inputStyle, placeholderStyle)}
                placeholder="กรอกข้อมูล"
              />
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
            <Textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="กรอกข้อมูล..."
              rows={4}
              maxLength={600}
              className={cn(
                "w-full text-[17pt] leading-[2.5] border-none focus:ring-0 shadow-none bg-transparent p-0 [text-indent:1cm] max-h-[5.5em] resize-none overflow-y-auto print:overflow-hidden",
                placeholderStyle
              )}
              style={{ minHeight: "4em", maxHeight: "5.5em", lineHeight: "2.5" }}
            />
            <Textarea
              name="objective"
              value={formData.objective}
              onChange={handleInputChange}
              placeholder="กรอกข้อมูล..."
              rows={4}
              maxLength={600}
              className={cn(
                "w-full text-[17pt] leading-[2.5] border-none focus:ring-0 shadow-none bg-transparent p-0 [text-indent:1cm] max-h-[5.5em] resize-none overflow-y-auto print:overflow-hidden",
                placeholderStyle
              )}
              style={{ minHeight: "4em", maxHeight: "5.5em", lineHeight: "2.5" }}
            />
            <Textarea
              name="conclusion"
              value={formData.conclusion}
              onChange={handleInputChange}
              placeholder="กรอกข้อมูล..."
              rows={4}
              maxLength={600}
              className={cn(
                "w-full text-[17pt] leading-[2.5] border-none focus:ring-0 shadow-none bg-transparent p-0 [text-indent:1cm] max-h-[5.5em] resize-none overflow-y-auto print:overflow-hidden",
                placeholderStyle
              )}
              style={{ minHeight: "4em", maxHeight: "5.5em", lineHeight: "2.5" }}
            />
          </div>

          <div className="flex justify-end mt-8">
            <div className="w-2/5 text-center space-y-2">
              <div className="flex justify-center items-baseline">
                <span className="text-[17pt]">(</span>
                <Input 
                  name="signerPrefix" 
                  value={formData.signerPrefix} 
                  onChange={handleInputChange}
                  className="text-center text-[23px] border-none shadow-none focus:ring-0 p-0 bg-transparent focus:bg-transparent w-16"
                  placeholder="คำนำหน้า"
                />
                <Input 
                  name="signerName" 
                  value={formData.signerName} 
                  onChange={handleInputChange}
                  className="text-center text-[23px] border-none shadow-none focus:ring-0 p-0 bg-transparent focus:bg-transparent"
                  placeholder="กรอกข้อมูล"
                />
                <span className="text-[17pt]">)</span>
              </div>
              <div>
                <Input 
                  name="signerPosition" 
                  value={formData.signerPosition} 
                  onChange={handleInputChange}
                  className="text-center text-[23px] border-none shadow-none focus:ring-0 p-0 bg-transparent focus:bg-transparent"
                  placeholder="กรอกข้อมูล"
                />
              </div>
            </div>
          </div>
        </main>

        {/* LOGO + APP NAME (VISIBLE ONLY ON PRINT AT BOTTOM LEFT) */}
        
      </div>

      {/* ปุ่มเมนู UI (ไม่แสดงตอนพิมพ์) */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-3 print:hidden">
        <Button onClick={handleClearForm} variant="destructive">ล้างข้อมูล</Button>
        <Button onClick={handlePrint} className="bg-zinc-600 hover:bg-zinc-700">พิมพ์</Button>
      </div>
    </div>
  );
};

export default ThaiMemoForm;
