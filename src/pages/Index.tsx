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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Document, Packer, Paragraph, TextRun, AlignmentType } from "docx";
import { saveAs } from "file-saver";

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
    signerName: "",
    signerPosition: ""
  };
  const [formData, setFormData] = useState(initialData);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
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
  const generatePdf = () => {
    const memoContent = document.getElementById("memo-content");
    const actionButtons = document.getElementById("action-buttons");
    if (!memoContent) return;

    toast({
      title: "กำลังสร้างไฟล์ PDF...",
      description: "กรุณารอสักครู่"
    });

    if (actionButtons) {
      actionButtons.style.display = "none";
    }

    html2canvas(memoContent, {
      scale: 3,
      useCORS: true
    }).then(canvas => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "cm",
        format: "a4"
      });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("บันทึกข้อความ.pdf");

      if (actionButtons) {
        actionButtons.style.display = "flex";
      }
    }).catch(err => {
      console.error("Error generating PDF:", err);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างไฟล์ PDF ได้"
      });
      if (actionButtons) {
        actionButtons.style.display = "flex";
      }
    });
  };

  const generateWord = () => {
    toast({
      title: "กำลังสร้างไฟล์ Word...",
      description: "กรุณารอสักครู่"
    });

    const formatThaiDate = (date: Date | undefined) => {
      if (!date) return "";
      return format(date, "d MMMM yyyy", {
        locale: th
      });
    };

    const doc = new Document({
      creator: "Lovable Thai Memo App",
      styles: {
        default: {
          document: {
            run: {
              font: "TH Sarabun New", // Requires user to have this font installed
              size: 32, // 16pt
            },
          },
        },
      },
      sections: [{
        properties: {
          page: {
            margin: {
              top: "1.5cm",
              right: "2cm",
              bottom: "2.5cm",
              left: "3cm"
            },
          },
        },
        children: [
          new Paragraph({
            children: [new TextRun({
              text: "บันทึกข้อความ",
              bold: true,
              size: 50
            })],
            alignment: AlignmentType.CENTER,
            spacing: {
              after: 400
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ส่วนราชการ",
                bold: true,
                size: 34
              }),
              new TextRun({
                text: `\t${formData.department}`,
                size: 40
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "ที่",
                bold: true,
                size: 34
              }),
              new TextRun({
                text: `\t${formData.referenceNumber}`,
                size: 40
              }),
              new TextRun({
                text: `\t\t\tวันที่`,
                bold: true,
                size: 34
              }),
              new TextRun({
                text: `\t${formatThaiDate(formData.date)}`,
                size: 40
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "เรื่อง",
                bold: true,
                size: 34
              }),
              new TextRun({
                text: `\t${formData.subject}`,
                size: 40
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "เรียน",
                bold: true,
                size: 34
              }),
              new TextRun({
                text: `\t${formData.salutation}`,
                size: 40
              }),
            ],
            spacing: {
              after: 200
            },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "อ้างถึง",
                size: 34
              }),
              new TextRun({
                text: `\t${formData.referenceTo}`,
                size: 40
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "สิ่งที่ส่งมาด้วย",
                size: 34
              }),
              new TextRun({
                text: `\t${formData.attachments}`,
                size: 40
              }),
            ],
            spacing: {
              after: 400
            },
          }),
          ...[formData.reason, formData.objective, formData.conclusion].flatMap(text =>
            text.split('\n').map(line => new Paragraph({
              children: [new TextRun({
                text: line || " ",
                size: 40
              })],
              indent: {
                firstLine: "2.5cm"
              },
            }))
          ),
          new Paragraph({
            text: "",
            spacing: {
              after: 600
            }
          }), // Spacer
          new Paragraph({
            children: [new TextRun({
              text: `( ${formData.signerName} )`,
              size: 40
            })],
            alignment: AlignmentType.CENTER,
            indent: {
              left: "50%"
            },
          }),
          new Paragraph({
            children: [new TextRun({
              text: `${formData.signerPosition}`,
              size: 40
            })],
            alignment: AlignmentType.CENTER,
            indent: {
              left: "50%"
            },
          }),
        ],
      }, ],
    });

    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "บันทึกข้อความ.docx");
    }).catch(err => {
      console.error("Error generating Word:", err);
      toast({
        variant: "destructive",
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างไฟล์ Word ได้"
      });
    });
  };

  const handleGeneratePdf = () => {
    generatePdf();
  };

  const handleSaveData = () => {
    generateWord();
    toast({
      title: "ไฟล์ Word กำลังถูกสร้าง",
      description: "ไฟล์ PDF จะถูกสร้างตามมาในอีกสักครู่"
    });
    setTimeout(() => {
      generatePdf();
    }, 2000);
  };

  const handleClearForm = () => {
    setFormData(initialData);
    toast({
      title: "ล้างข้อมูล",
      description: "ข้อมูลในฟอร์มทั้งหมดถูกล้างแล้ว"
    });
  };
  const inputStyle = "text-[20pt] flex-1 ml-2 p-0 h-auto border-0 border-b border-dotted border-black rounded-none focus-visible:ring-0 shadow-none bg-transparent";
  const placeholderStyle = "placeholder:italic placeholder:text-gray-400/80";
  return <div className="min-h-screen bg-gray-200 dark:bg-gray-800 p-8 pt-[1.5cm] flex justify-center items-start font-sarabun">
      <div id="memo-content" className="w-[21cm] min-h-[29.7cm] bg-white dark:bg-gray-900 shadow-2xl pt-[1.5cm] pr-[2cm] pb-[2.5cm] pl-[3cm] text-black dark:text-white">
        <header className="relative mb-4">
          <img src="/lovable-uploads/d64c17a9-6046-4448-8853-8d2e2b3cd47c.png" alt="ตราครุฑ" className="absolute -top-[0cm] -left-[0cm] h-[1.5cm] w-auto" />
          <h1 className="text-[25pt] font-bold text-center pt-[0.5cm]">บันทึกข้อความ</h1>
        </header>

        <main className="text-[16pt]">
          <div className="space-y-1">
            <div className="flex items-baseline">
              <Label htmlFor="department" className="shrink-0 text-[17pt] font-bold">ส่วนราชการ</Label>
              <Input id="department" name="department" value={formData.department} onChange={handleInputChange} className={cn(inputStyle, placeholderStyle)} placeholder="จงเติมข้อมูล" />
            </div>

            <div className="flex items-baseline gap-8">
              <div className="flex items-baseline w-1/2">
                <Label htmlFor="referenceNumber" className="shrink-0 text-[17pt] font-bold">ที่</Label>
                <Input id="referenceNumber" name="referenceNumber" value={formData.referenceNumber} onChange={handleInputChange} className={cn(inputStyle, placeholderStyle)} placeholder="จงเติมข้อมูล" />
              </div>
              <div className="flex items-baseline w-1/2">
                <Label htmlFor="date" className="shrink-0 text-[17pt] font-bold">วันที่</Label>
                <div className="flex-1 ml-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant={"ghost"} className={cn("w-full justify-start text-left font-normal text-[20pt] p-0 h-auto border-b border-dotted border-black rounded-none hover:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0", !formData.date && "text-muted-foreground")}>
                        {formData.date ? format(formData.date, "d MMMM yyyy", {
                        locale: th
                      }) : <span className={cn("italic text-gray-400/80", placeholderStyle)}>วัน เดือน ปี</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus locale={th} />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="flex items-baseline">
              <Label htmlFor="subject" className="shrink-0 text-[17pt] font-bold">เรื่อง</Label>
              <Input id="subject" name="subject" value={formData.subject} onChange={handleInputChange} className={cn(inputStyle, placeholderStyle)} placeholder="จงเติมข้อมูล" />
            </div>

            <div className="flex items-baseline">
              <Label htmlFor="salutation" className="shrink-0 text-[17pt] font-bold">เรียน</Label>
              <Input id="salutation" name="salutation" value={formData.salutation} onChange={handleInputChange} className={cn(inputStyle, placeholderStyle)} placeholder="จงเติมข้อมูล" />
            </div>

            <div className="flex items-baseline">
              <Label htmlFor="referenceTo" className="shrink-0 text-[17pt]">อ้างถึง</Label>
              <Input id="referenceTo" name="referenceTo" value={formData.referenceTo} onChange={handleInputChange} className={cn(inputStyle, placeholderStyle)} placeholder="จงเติมข้อมูล" />
            </div>

            <div className="flex items-baseline">
              <Label htmlFor="attachments" className="shrink-0 text-[17pt]">สิ่งที่ส่งมาด้วย</Label>
              <Input id="attachments" name="attachments" value={formData.attachments} onChange={handleInputChange} className={cn(inputStyle, placeholderStyle)} placeholder="จงเติมข้อมูล" />
            </div>
          </div>
          
          <div className="mt-4 space-y-2">
             <Textarea name="reason" value={formData.reason} onChange={handleInputChange} placeholder="จงเติมข้อมูล..." className={cn("w-full text-[20pt] leading-relaxed border-none focus:ring-0 shadow-none bg-transparent p-0 [text-indent:2.5cm]", placeholderStyle)} rows={7} />
            <Textarea name="objective" value={formData.objective} onChange={handleInputChange} placeholder="จงเติมข้อมูล..." className={cn("w-full text-[20pt] leading-relaxed border-none focus:ring-0 shadow-none bg-transparent p-0 [text-indent:2.5cm]", placeholderStyle)} rows={7} />
            <Textarea name="conclusion" value={formData.conclusion} onChange={handleInputChange} placeholder="จงเติมข้อมูล..." className={cn("w-full text-[20pt] leading-relaxed border-none focus:ring-0 shadow-none bg-transparent p-0 [text-indent:2.5cm]", placeholderStyle)} rows={7} />
          </div>

          <div className="flex justify-end mt-8">
            <div className="w-2/5 text-center space-y-2">
              <div className="flex justify-center items-baseline">
                <span className="text-[17pt]">(</span>
                <Input name="signerName" value={formData.signerName} onChange={handleInputChange} className="text-center text-[20pt] border-none shadow-none focus:ring-0 p-0" placeholder="จงเติมข้อมูล" />
                <span className="text-[17pt]">)</span>
              </div>
              <div>
                 <Input name="signerPosition" value={formData.signerPosition} onChange={handleInputChange} className="text-center text-[20pt] border-none shadow-none focus:ring-0 p-0" placeholder="จงเติมข้อมูล" />
              </div>
            </div>
          </div>
        </main>
      </div>
      <div id="action-buttons" className="fixed bottom-4 right-4 flex flex-col gap-3">
          <Button onClick={handleGeneratePdf} className="bg-blue-600 hover:bg-blue-700">สร้าง PDF</Button>
          <Button onClick={handleSaveData} className="bg-green-600 hover:bg-green-700">บันทึกข้อมูล</Button>
          <Button onClick={handleClearForm} variant="destructive">ล้างข้อมูล</Button>
      </div>
    </div>;
};
export default ThaiMemoForm;
