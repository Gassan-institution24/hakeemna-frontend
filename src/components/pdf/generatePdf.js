import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * توليد PDF من أي عنصر HTML (يدعم عربي وإنجليزي)
 * @param {HTMLElement} element - العنصر الذي تريد تحويله إلى PDF
 * @param {string} fileName - اسم ملف الـ PDF الناتج
 */
export const generatePdfFromElement = async (element, fileName = 'document.pdf') => {
  if (!element) {
    console.error('⚠️ Element not found for PDF generation');
    return;
  }

  // نستخدم html2canvas لتحويل العنصر إلى صورة
   const canvas = await html2canvas(element, {
    scale: 4, // 🔼 زيدنا الجودة (القيمة 4 تعطي وضوح ممتاز)
    useCORS: true,
    allowTaint: true,
    scrollY: -window.scrollY,
    backgroundColor: '#ffffff', // تأكد أن الخلفية بيضاء
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.7); // 0.7 = جودة 70%

  // eslint-disable-next-line new-cap
  const pdf = new jsPDF('p', 'mm', 'a4', true);


  // حساب الحجم بحيث تتناسب الصورة مع A4
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(fileName);
};
