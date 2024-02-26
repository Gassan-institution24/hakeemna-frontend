import { format, getTime, formatDistanceToNow } from 'date-fns';
import { useAuthContext } from 'src/auth/hooks';
import { formatInTimeZone } from 'date-fns-tz';

// ----------------------------------------------------------------------

export const useUnitTime = () => {
  const { user } = useAuthContext();
  function myunitTime(date) {
    const formattedDate = date ? new Date(date) : null;
    const timeZone =
      user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service
        ?.country?.time_zone;

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

  return date ? format(new Date(date), fm) : '';
}
export function fMonth(date, newFormat) {
  const fm = newFormat || 'MMM yyyy';

  return date ? format(new Date(date), fm) : '';
}

export function fDateTime(date, newFormat) {
  const fm = newFormat || 'dd MMM yyyy p';

  return date ? format(new Date(date), fm) : '';
}

export function fTime(date, newFormat) {
  const fm = newFormat || 'p';

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
