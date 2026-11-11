import { InvoiceRecord, LabSettings } from '../types/lab';

export function formatPhoneNumberForWhatsApp(phone: string): string {
  // Remove spaces, hyphens, parentheses, plus signs
  let clean = phone.replace(/[^\d]/g, '');

  // Egyptian numbers handling:
  // e.g. 01012345678 -> 201012345678
  if (clean.startsWith('01') && clean.length === 11) {
    clean = '2' + clean;
  } else if (clean.startsWith('201') && clean.length === 12) {
    // already has 20
  } else if (clean.startsWith('00')) {
    clean = clean.substring(2);
  }

  return clean;
}

export function generateWhatsAppMessage(
  invoice: InvoiceRecord,
  settings: LabSettings
): string {
  const dateFormatted = new Date(invoice.createdAt).toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const divider = '━━━━━━━━━━━━━━━━━━━━━━';
  const smallDivider = '──────────────────────';

  // Extract unique fasting instructions for selected tests
  const fastingRules = invoice.items
    .filter((item) => item.fasting && !item.fasting.includes('بدون صيام'))
    .map((item) => `• *${item.testNameAr}*: ${item.fasting}`);

  const hasSpecialFasting = fastingRules.length > 0;

  let msg = `*🩸 ${settings.labName} 🩸*\n`;
  msg += `*${settings.doctorName}*\n`;
  msg += `_${settings.doctorTitle}_\n`;
  msg += `${divider}\n\n`;

  msg += `📄 *عرض سعر وفاتورة تحاليل طبية*\n`;
  msg += `🔢 *رقم الفاتورة:* \`${invoice.invoiceNumber}\`\n`;
  msg += `📅 *التاريخ:* ${dateFormatted}\n`;
  msg += `👤 *اسم المريض:* *${invoice.patient.name || 'عميل معمل RT'}*\n`;
  if (invoice.patient.age) {
    msg += `🎂 *العمر:* ${invoice.patient.age} سنة\n`;
  }
  if (invoice.patient.referringDoctor) {
    msg += `🩺 *الطبيب المعالج:* د. ${invoice.patient.referringDoctor}\n`;
  }
  if (invoice.patient.branch) {
    msg += `📍 *الفرع المختار:* ${invoice.patient.branch}\n`;
  }

  msg += `\n${smallDivider}\n`;
  msg += `📋 *قائمة الفحوصات والتحاليل المطلوبة:*\n\n`;

  invoice.items.forEach((item, index) => {
    msg += `${index + 1}. *${item.testNameAr}*\n`;
    msg += `   └ السعر: *${item.price} ${settings.currency}*\n`;
  });

  if (invoice.appliedPackage) {
    msg += `\n🎁 *العرض المفعل:* ${invoice.appliedPackage.nameAr}\n`;
  }

  msg += `\n${smallDivider}\n`;
  msg += `💰 *الحساب والتسعير المالي:*\n`;
  msg += `• الإجمالي قبل الخصم: *${invoice.totalBeforeDiscount} ${settings.currency}*\n`;

  if (invoice.discountAmount > 0) {
    const discountLabel = invoice.contractName
      ? `خصم ${invoice.contractName}`
      : `خصم (${invoice.discountValue}%)`;
    msg += `• 🎉 ${discountLabel}: *- ${invoice.discountAmount} ${settings.currency}*\n`;
  }

  msg += `• *الصافي المطلوب سداده:* 👉 *${invoice.netTotal} ${settings.currency}*\n`;

  if (invoice.paidAmount > 0) {
    msg += `• المبلغ المدفوع: ${invoice.paidAmount} ${settings.currency}\n`;
    if (invoice.remainingAmount > 0) {
      msg += `• المتبقي: *${invoice.remainingAmount} ${settings.currency}*\n`;
    } else {
      msg += `• حالة السداد: *خالص بالكامل (تم الدفع) ✅*\n`;
    }
  }

  msg += `\n${divider}\n`;
  msg += `⚠️ *تعليمات وتحضيرات الفحص الهامة:*\n`;

  if (hasSpecialFasting) {
    fastingRules.forEach((rule) => {
      msg += `${rule}\n`;
    });
    msg += `\n💡 _ملاحظة: شرب الماء مسموح ومطلوب قبل سحب العينات ما لم يطلب غير ذلك._\n`;
  } else {
    msg += `• جميع هذه الفحوصات *لا تتطلب صياماً مسبقاً* ويمكن إجراؤها في أي وقت على مدار اليوم.\n`;
  }

  if (settings.homeVisitAvailable) {
    msg += `\n🚗 *خدمة السحب المنزلي متوفرة:* اتصل بنا لتحديد موعد زيارة منزلية لطاقم المعمل المتخصص.\n`;
  }

  msg += `\n${divider}\n`;
  msg += `🏥 *للتواصل والاستفسار:* \n`;
  msg += `📞 الخط الساخن / هاتف: *${settings.hotline}*\n`;
  msg += `💬 واتساب المعمل: *https://wa.me/${settings.whatsappNumber}*\n`;
  msg += `🌐 ${settings.address}\n\n`;
  msg += `_مع تمنياتنا لكم بموفور الصحة وتمام العافية 🌸_`;

  return msg;
}

export function openWhatsAppLink(phone: string, message: string): void {
  const formattedPhone = formatPhoneNumberForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);
  
  const url = formattedPhone
    ? `https://wa.me/${formattedPhone}?text=${encodedText}`
    : `https://wa.me/?text=${encodedText}`;

  // Use window.open with rel to ensure safe opening
  window.open(url, '_blank', 'noopener,noreferrer');
}

export async function shareOrCopyMessage(message: string, title: string = 'عرض أسعار تحاليل معامل RT'): Promise<{ shared: boolean; copied: boolean }> {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text: message,
      });
      return { shared: true, copied: false };
    } catch {
      // Fallback to clipboard if share was dismissed or unsupported
    }
  }

  try {
    await navigator.clipboard.writeText(message);
    return { shared: false, copied: true };
  } catch (err) {
    console.error('Clipboard write failed', err);
    return { shared: false, copied: false };
  }
}
