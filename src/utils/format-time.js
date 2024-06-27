import ar from 'date-fns/locale/ar-SA';
import { format, getTime, isValid, formatDistanceToNow } from 'date-fns';

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
      user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
        ?.country?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone;

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
  const fm = newFormat || 'dd MMM yyyy';

  return date && isValid(date) ? format(new Date(date), fm, curLangAr ? { locale: ar } : null) : '';
}
export function fMonth(date, newFormat) {
  const fm = newFormat || 'MMM yyyy';

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
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}
export function fDateAndTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fTime(date, newFormat) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm, curLangAr ? { locale: ar } : null) : '';
}
export function fDm(date, newFormat) {
  const fm = newFormat || 'dd MMM';

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
