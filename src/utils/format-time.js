import ar from 'date-fns/locale/ar-SA';
import { format, getTime, formatDistanceToNow } from 'date-fns';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export const useUnitTime = () => {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  function myunitTime(date) {
    const formattedDate = date ? new Date(date) : null;
    const timeZone =
      user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
        ?.country?.time_zone;

    const value = formattedDate
      ? new Date(formattedDate.toLocaleString(t('en-US'), { timeZone }))
      : null;

    return value;
  }
  return {
    myunitTime,
  };
};
export function fDate(date, newFormat, arabic) {
  const fm = newFormat || 'dd MMM yyyy';

  return date ? format(new Date(date), fm, arabic ? { locale: ar } : null) : '';
}
export function fMonth(date, newFormat, arabic) {
  const fm = newFormat || 'MMM yyyy';

  return date ? format(new Date(date), fm, arabic ? { locale: ar } : null) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTime(date, newFormat) {
  const fm = newFormat || 'p';

  return date ? format(new Date(date), fm) : '';
}
export function fDm(date, newFormat) {
  const fm = newFormat || 'dd MMM';

  return date ? format(new Date(date), fm) : '';
}

export function fTimestamp(date) {
  return date ? getTime(new Date(date)) : '';
}

export function fToNow(date) {
  return date
    ? formatDistanceToNow(new Date(date), {
        addSuffix: true,
      })
    : '';
}
