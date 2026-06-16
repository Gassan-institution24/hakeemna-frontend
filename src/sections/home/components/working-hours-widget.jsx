import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

const WEEK_ORDER = ['saturday', 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

// Stored work_days values are inconsistent in production data - some unit services save the
// English key ("saturday"), others save the literal Arabic day name ("السبت"). Normalize both
// to the English key so the widget works regardless of which form a given record used.
const ARABIC_TO_KEY = {
  السبت: 'saturday',
  الأحد: 'sunday',
  الاثنين: 'monday',
  الثلاثاء: 'tuesday',
  الأربعاء: 'wednesday',
  الخميس: 'thursday',
  الجمعة: 'friday',
};

export function normalizeDay(day) {
  return ARABIC_TO_KEY[day] || day?.toLowerCase?.();
}

export default function WorkingHoursWidget({ workDays = [], startTime, endTime, curLangAr }) {
  const { t } = useTranslate();

  const normalizedWorkDays = workDays?.map(normalizeDay) || [];

  if (!normalizedWorkDays.length) {
    return null;
  }

  const todayIndex = new Date().getDay();
  const todayKey = WEEK_ORDER[(todayIndex + 1) % 7];
  const isOpenToday = normalizedWorkDays.includes(todayKey);

  const isOpenNow = (() => {
    if (!isOpenToday || !startTime || !endTime) return false;
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);
    const nowMinutes = now.getHours() * 60 + now.getMinutes();
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    return nowMinutes >= startMinutes && nowMinutes <= endMinutes;
  })();

  let hoursLabel = '';
  if (startTime && endTime) {
    hoursLabel =
      startTime === endTime
        ? t('24 hours')
        : `${fTime(startTime, 'p', curLangAr)} - ${fTime(endTime, 'p', curLangAr)}`;
  }

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
        <Typography variant="subtitle2">{t('working hours')}</Typography>
        {isOpenToday && (
          <Chip
            size="small"
            color={isOpenNow ? 'success' : 'default'}
            label={isOpenNow ? t('open now') : t('closed now')}
          />
        )}
        {!isOpenToday && <Chip size="small" label={t('closed today')} />}
      </Stack>

      <Stack direction="row" spacing={1} flexWrap="wrap">
        {WEEK_ORDER.map((day) => (
          <Chip
            key={day}
            size="small"
            variant={normalizedWorkDays.includes(day) ? 'filled' : 'outlined'}
            color={normalizedWorkDays.includes(day) ? 'primary' : 'default'}
            label={t(day)}
            sx={
              day === todayKey
                ? { outline: (theme) => `2px solid ${theme.palette.text.primary}`, outlineOffset: '1px' }
                : undefined
            }
          />
        ))}
      </Stack>

      {hoursLabel && (
        <Stack spacing={0.5}>
          <Typography variant="body2">{hoursLabel}</Typography>
          <Typography variant="caption" sx={{ color: 'text.disabled' }}>
            {t('hours apply to all open days')}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}

WorkingHoursWidget.propTypes = {
  workDays: PropTypes.array,
  startTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  endTime: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  curLangAr: PropTypes.bool,
};
