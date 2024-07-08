import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import { StaticDatePicker } from '@mui/x-date-pickers';

import { useResponsive } from 'src/hooks/use-responsive';

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

  // useEffect(() => {
  //   if (!loading.value) {
  //     if (!selected) {
  //       setSelected(list?.[0]?._id);
  //       setTimeListItem(list?.[0]?._id);
  //     } else if (!list.some((one) => one._id === selected)) {
  //       setSelected(list?.[0]?._id);
  //       setTimeListItem(list?.[0]?._id);
  //     } else {
  //       list.forEach((one, index) => {
  //         if (one._id === selected) {
  //           setSelected(list?.[index]?._id);
  //           setTimeListItem(list?.[index]?._id);
  //         }
  //       });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [list, loading.value]);



  return (
    <>
      <StaticDatePicker
        localeText={false}
        sx={{ mt: { md: 0, xs: 4 } }}
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
        onChange={(newValue) => setSelectedDate(newValue)}
      />
      <Stack
        sx={{
          width: { md: 470 },
          px: { md: 3 },
        }}
      >
        <TimeList list={list} onChange={timeListChangeHandler} value={selected} />
      </Stack>
    </>
  );
}

BookDetails.propTypes = {
  selected: PropTypes.string,
  selectedDate: PropTypes.string,
  AppointDates: PropTypes.array,
  list: PropTypes.array,
  loading: PropTypes.bool,
  timeListChangeHandler: PropTypes.func,
  setSelectedDate: PropTypes.func,
};