import { toWords } from 'number-to-words';

import { useLocales } from 'src/locales';

// eslint-disable-next-line
const { currentLang } = useLocales();
const curLangAr = currentLang.value === 'ar';

const numberToArabicWords = (number) => {
  const units = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
  const teens = [
    'عشرة',
    'أحد عشر',
    'اثنا عشر',
    'ثلاثة عشر',
    'أربعة عشر',
    'خمسة عشر',
    'ستة عشر',
    'سبعة عشر',
    'ثمانية عشر',
    'تسعة عشر',
  ];
  const tens = ['', '', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
  const hundreds = [
    '',
    'مائة',
    'مئتان',
    'ثلاثمائة',
    'أربعمائة',
    'خمسمائة',
    'ستمائة',
    'سبعمائة',
    'ثمانمائة',
    'تسعمائة',
  ];
  const thousands = [
    '',
    'ألف',
    'ألفان',
    'ثلاثة آلاف',
    'أربعة آلاف',
    'خمسة آلاف',
    'ستة آلاف',
    'سبعة آلاف',
    'ثمانية آلاف',
    'تسعة آلاف',
  ];

  if (number === 0) return 'صفر';

  if (number < 10) return units[number];
  if (number < 20) return teens[number - 10];
  if (number < 100)
    // eslint-disable-next-line
    return tens[Math.floor(number / 10)] + (number % 10 !== 0 ? ' و' + units[number % 10] : '');

  if (number < 1000) {
    return (
      hundreds[Math.floor(number / 100)] +
      // eslint-disable-next-line
      (number % 100 !== 0 ? ' و' + numberToArabicWords(number % 100) : '')
    );
  }

  if (number < 10000) {
    return (
      thousands[Math.floor(number / 1000)] +
      // eslint-disable-next-line
      (number % 1000 !== 0 ? ' و' + numberToArabicWords(number % 1000) : '')
    );
  }

  return number.toString(); // For larger numbers, add further logic as needed
};

export const NumberToText = (number) => {
  let text;
  if (!curLangAr) {
    // eslint-disable-next-line
    text = toWords(number) + ' jordanian dinars';
  } else {
    // eslint-disable-next-line
    text = numberToArabicWords(number) + ' دينار أردني فقط لا غير ';
  }
  return text;
};
