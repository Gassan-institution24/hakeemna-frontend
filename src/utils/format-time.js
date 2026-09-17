import ar from 'date-fns/locale/ar-SA';
import { utcToZonedTime } from 'date-fns-tz';
import { format, getTime, isValid, formatDistanceToNow } from 'date-fns';

import { Typography } from '@mui/material';

import { useLocales } from 'src/locales';
// import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------
// eslint-disable-next-line
const { currentLang } = useLocales();
const curLangAr = currentLang.value === 'ar';

// ── Time zone ─────────────────────────────────────────────────────────────────
//
// Times render as a bare clock — no zone suffix.
//
// They are still rendered *in* a zone: the clinic's country when the app has
// registered one, so staff read clinic times wherever they are sitting, and the
// viewer's own browser zone otherwise. The registry exists because these are
// plain functions called from hundreds of places and cannot read React context.
let appTimeZone = null;

export function setAppTimeZone(timeZone) {
  appTimeZone = timeZone || null;
}

export function browserTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch (error) {
    return 'UTC';
  }
}

export function resolveTimeZone() {
  return appTimeZone || browserTimeZone();
}

// ----------------------------------------------------------------------

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

export function useFDateTimeUnit() {
  const { user } = useAuthContext();

  const timeZone =
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
      ?.country?.time_zone || 'Asia/Amman';

  const fDateUnit = (date, newFormat = 'dd MMMMMMMM yyyy') => {
    if (!date) return '';
    // The clinic's calendar day, which near midnight is not the viewer's.
    const unitDate = utcToZonedTime(new Date(date), timeZone);
    return isValid(unitDate) ? format(unitDate, newFormat) : '';
  };

  const fTimeUnit = (date, newFormat = 'p') => {
    if (!date) return '';
    const dateObj = new Date(date);
    if (!isValid(dateObj)) return '';

    // The clinic's wall clock. This used to round-trip through zonedTimeToUtc,
    // which cancelled itself out and printed the viewer's own clock instead.
    const unitDate = utcToZonedTime(dateObj, timeZone);
    return format(unitDate, newFormat);
  };

  return {
    fDateUnit,
    fTimeUnit,
    timeZone,
  };
}

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

  if (!date) return '';

  const dateObj = new Date(date);
  if (!isValid(dateObj)) return '';

  const zoned = utcToZonedTime(dateObj, resolveTimeZone());
  return format(zoned, fm, curLangAr ? { locale: ar } : null);
}
export function fDateAndTime(date, newFormat) {
  const fm = newFormat || 'dd MMMMMMMM yyyy';

  return date ? format(new Date(date), fm, curLangAr ? { locale: ar } : null) : '';
}

export function fTime(date, newFormat) {
  if (!date) return '';
  const fm = newFormat || 'p';
  const dateObj = new Date(date);
  if (!isValid(dateObj)) return '';

  const zoned = utcToZonedTime(dateObj, resolveTimeZone());
  return format(zoned, fm, curLangAr ? { locale: ar } : null);
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

export function fMinSec(seconds) {
  if (!seconds || seconds === 0) return '-';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  let timeString;
  if (hours > 0) {
    // Format: HH:MM:SS for durations over 1 hour
    timeString = `${hours.toString().padStart(2, '0')} : ${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`;
  } else {
    // Format: MM:SS for durations under 1 hour
    timeString = `${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  const results = (
    <Typography variant="body2" sx={{ direction: curLangAr ? 'rtl' : 'ltr' }}>
      {timeString}
    </Typography>
  );

  return results;
}
