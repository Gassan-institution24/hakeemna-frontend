import ar from 'date-fns/locale/ar-SA';
import { format, getTime, isValid, formatDistanceToNow } from 'date-fns';

import { Typography } from '@mui/material';

import { useLocales } from 'src/locales';
// import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------
// eslint-disable-next-line
const { currentLang } = useLocales();
const curLangAr = currentLang.value === 'ar';

export const useUnitTime = () => {
  // const { t } = useTranslate();
  const { user } = useAuthContext();
  function myunitTime(date) {
    const formattedDate = date ? new Date(date) : null;
    const timeZone =
      user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
        ?.country?.time_zone || 'Asia/Amman';

    const value = formattedDate
      ? new Date(formattedDate.toLocaleString('en-US', { timeZone }))
      : null;

    return value;
  }
  return {
    myunitTime,
  };
};
export function fDate(date, newFormat) {
  const fm = newFormat || 'dd MMMMMMMM yyyy';

  return date && isValid(new Date(date))
    ? format(new Date(date), fm, curLangAr ? { locale: ar } : null)
    : '';
}
export function fMonth(date, newFormat) {
  const fm = newFormat || 'MMMM yyyy';

  return date ? format(new Date(date), fm, curLangAr ? { locale: ar } : null) : '';
}
export function fTimeText(date, newFormat, arabic) {
  // const fm = newFormat || 'MMM yyyy';

  if (!date) {
    return '';
  }

  // const formattedDate = format(new Date(date), fm, arabic ? { locale: ar } : null);
  const relativeTime = formatDistanceToNow(new Date(date), {
    addSuffix: true,
    locale: arabic ? ar : undefined,
  });

  return `${relativeTime}`;
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMMMMMMM yyyy p';

  return date ? format(new Date(date), fm, curLangAr ? { locale: ar } : null) : '';
}
export function fDateAndTime(date, newFormat) {
  const fm = newFormat || 'dd MMMMMMMM yyyy';

  return date ? format(new Date(date), fm, curLangAr ? { locale: ar } : null) : '';
}

export function fTime(date, newFormat) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm, curLangAr ? { locale: ar } : null) : '';
}
export function fDm(date, newFormat) {
  const fm = newFormat || 'dd MMM';

  return date ? format(new Date(date), fm) : '';
}
export function fDmPdf(date, newFormat) {
  const fm = newFormat || 'dd MMMMMMMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  const optionsObj = { addSuffix: true };
  if (curLangAr) {
    optionsObj.locale = ar;
  }
  return date ? formatDistanceToNow(new Date(date), optionsObj) : '';
}

export function isBetween(inputDate, startDate, endDate) {
  const date = new Date(inputDate);

  const results =
    new Date(date.toDateString()) >= new Date(startDate.toDateString()) &&
    new Date(date.toDateString()) <= new Date(endDate.toDateString());

  return results;
}

export function isAfter(startDate, endDate) {
  const results =
    startDate && endDate ? new Date(startDate).getTime() > new Date(endDate).getTime() : false;

  return results;
}
export function fHourMin(time, endDate) {
  const results = (
    <Typography variant="body2" sx={{ direction: curLangAr ? 'rtl' : 'ltr' }}>
      {Math.floor(time / 60)
        .toString()
        .padStart(2, '0')}{' '}
      : {(time % 60).toString().padStart(2, '0')}
    </Typography>
  );

  return results;
}
