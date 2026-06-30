import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { Paper, Divider, Typography } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import TimeList from 'src/components/time-list/time-list';

// ----------------------------------------------------------------------

export default function BookDetails({
  selected,
  AppointDates,
  timeListChangeHandler,
  selectedDate,
  setSelectedDate,
  list,
  loading,
}) {
  // const [timeListItem, setTimeListItem] = useState();
  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslate();

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, md: 2 },
        borderRadius: 3,
        bgcolor: '#F8FCFB',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        width: '100%',
      }}
    >
      <StaticDatePicker
        localeText={false}
        sx={{
          bgcolor: 'transparent',
          borderRadius: 2,
          '& .MuiPickersDay-root.Mui-selected': {
            bgcolor: 'primary.main',
            '&:hover': { bgcolor: 'primary.dark' },
          },
        }}
        orientation={mdUp ? 'landscape' : ''}
        shouldDisableDate={(day) =>
          !AppointDates.some((date) => {
            const appointDate = new Date(date);
            const currentDate = new Date(day);
            return (
              appointDate.getFullYear() === currentDate.getFullYear() &&
              appointDate.getMonth() === currentDate.getMonth() &&
              appointDate.getDate() === currentDate.getDate()
            );
          })
        }
        slots={{ toolbar: 'test' }}
        slotProps={{ actionBar: { actions: [] } }}
        value={new Date(selectedDate)}
        onChange={(newValue) =>
          setSelectedDate(
            new Date(newValue.getFullYear(), newValue.getMonth(), newValue.getDate(), 12, 0, 0)
          )
        }
      />

      <Divider sx={{ my: 1 }} />

      <Stack
        sx={{
          width: '100%',
          maxWidth: 560,
          px: { md: 2 },
        }}
      >
        <Stack direction="row" alignItems="center" gap={0.75}>
          <Iconify icon="solar:clock-circle-bold" width={18} sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle2" sx={{ color: 'secondary.main' }}>
            {t('available times')}
          </Typography>
        </Stack>
        <TimeList list={list} onChange={timeListChangeHandler} value={selected} />
      </Stack>
    </Paper>
  );
}

BookDetails.propTypes = {
  selected: PropTypes.string,
  selectedDate: PropTypes.any,
  AppointDates: PropTypes.array,
  list: PropTypes.array,
  loading: PropTypes.bool,
  timeListChangeHandler: PropTypes.func,
  setSelectedDate: PropTypes.func,
};
