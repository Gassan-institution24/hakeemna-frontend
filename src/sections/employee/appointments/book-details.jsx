import PropTypes from 'prop-types';
import { isValid } from 'date-fns';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { StaticDatePicker } from '@mui/x-date-pickers';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import TimeList from 'src/components/time-list/time-list';
import Carousel, { useCarousel, CarouselArrows } from 'src/components/carousel';

// ----------------------------------------------------------------------

export default function BookDetails({
  selected,
  AppointDates,
  setSelected,
  selectedDate,
  setSelectedDate,
  list,
  loading,
}) {
  const { t } = useTranslate();

  const [timeListItem, setTimeListItem] = useState();
  const mdUp = useResponsive('up', 'md');

  const GetIndex = () => {
    let result = 0;
    list.forEach((one, index) => {
      if (one._id === selected) {
        result = index;
      }
    });
    return result;
  };

  const carousel = useCarousel({
    adaptiveHeight: true,
    initialSlide: !loading && (GetIndex() || 0),
  });

  useEffect(() => {
    if (!loading.value) {
      if (!selected) {
        setSelected(list?.[0]?._id);
        setTimeListItem(list?.[0]?._id);
        carousel.onTogo(0);
      } else if (!list.some((one) => one._id === selected)) {
        setSelected(list?.[0]?._id);
        setTimeListItem(list?.[0]?._id);
        carousel.onTogo(0);
      } else {
        list.forEach((one, index) => {
          if (one._id === selected) {
            carousel.onTogo(index);
            setSelected(list?.[index]?._id);
            setTimeListItem(list?.[index]?._id);
          }
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, loading.value]);

  // useEffect(() => {
  //   setSelected(list[carousel.currentIndex]?._id);
  //   setSelectedItem(list[carousel.currentIndex]?._id);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [carousel.currentIndex]);

  // useEffect(() => {
  // setSelected(selectedItem);
  // list.forEach((one, index) => {
  // if (one._id === selectedItem) {
  // carousel.onTogo(index);
  // }
  // });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedItem]);

  const carouselHandler = (dir) => {
    let index = carousel.currentIndex;
    if (dir === 'next') {
      carousel.onNext();
      if (index === list.length - 1) {
        index = 0;
      } else {
        index += 1;
      }
    }
    if (dir === 'prev') {
      carousel.onPrev();
      if (index === 0) {
        index = list.length - 1;
      } else index -= 1;
    }
    setSelected(list[index]?._id);
    setTimeListItem(list[index]?._id);
  };

  const timeListChangeHandler = (newValue) => {
    setSelected(newValue);
    setTimeListItem(newValue);
    list.forEach((one, index) => {
      if (one._id === newValue) {
        carousel.onTogo(index);
      }
    });
  };

  return (
    // <Card {...other}>
    <>
      <Stack direction={mdUp ? 'row' : 'column'} justifyContent="space-around">
        <StaticDatePicker
          sx={{ width: '100%', flexGrow: 1, flexShrink: 0.4 }}
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
          slotProps={{ actionBar: { actions: [] } }}
          value={new Date(selectedDate)}
          onChange={(newValue) => setSelectedDate(newValue)}
        />
        <Stack
          sx={{
            width: '100%',
            height: '100%',
            flexGrow: 1,
            flexShrink: 0.6,
            // py: 8,
            px: 3,
          }}
        >
          <TimeList list={list} onChange={timeListChangeHandler} value={timeListItem} />
        </Stack>
      </Stack>
      <Divider sx={{ borderStyle: 'dashed' }} />
      {selected && (
        <CardHeader
          title={
            <Typography
              sx={{ py: 2, fontWeight: 700 }}
              variant="caption"
              color="text.secondary"
              textTransform="uppercase"
            >
              {t('Appointment details')}
            </Typography>
          }
          // subheader="Appointment"
          action={
            <CarouselArrows
              onNext={() => carouselHandler('next')}
              onPrev={() => carouselHandler('prev')}
            />
          }
        />
      )}
      <Carousel style={{ dir: 'rtl' }} ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {list.map((item) => (
          <ReviewItem key={item._id} item={item} />
        ))}
      </Carousel>
      <Divider sx={{ borderStyle: 'dashed', mb: 3 }} />
      {/* <Stack spacing={2} direction="row" alignItems="center" sx={{ p: 3 }}>
        <Button
        fullWidth
        color="error"
        variant="soft"
        onClick={() => console.info('ACCEPT', customerInfo?.id)}
        >
        Reject
        </Button>
        
        <Button
        fullWidth
        color="inherit"
        variant="contained"
        onClick={() => console.info('REJECT', customerInfo?.id)}
        >
        Accept
        </Button>
      </Stack> */}
      {/* // </Card> */}
    </>
  );
}

BookDetails.propTypes = {
  selected: PropTypes.string,
  selectedDate: PropTypes.string,
  AppointDates: PropTypes.array,
  list: PropTypes.array,
  loading: PropTypes.bool,
  setSelected: PropTypes.func,
  setSelectedDate: PropTypes.func,
};

// ----------------------------------------------------------------------

function ReviewItem({ item }) {
  const {
    work_group,
    appointment_type,
    unit_service,
    start_time,
    service_types,
    online_available,
  } = item;

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const mdUp = useResponsive('up', 'md');

  return (
    <Stack
      dir={curLangAr ? 'rtl' : 'ltr'}
      spacing={2}
      sx={{
        p: 3,
        position: 'relative',
      }}
    >
      <Stack direction={mdUp ? 'row' : 'column'} alignItems="center" spacing={2}>
        {/* <Avatar alt={start_time} src={avatarUrl} sx={{ width: 48, height: 48 }} /> */}

        <ListItemText
          primary={
            isValid(new Date(start_time)) &&
            new Date(start_time).toLocaleTimeString(t('en-US'), {
              timeZone: unit_service?.country?.time_zone,
              hour: '2-digit',
              minute: '2-digit',
            })
          }
          secondary={
            isValid(new Date(start_time)) &&
            new Date(start_time).toLocaleDateString(t('en-US'), {
              timeZone:
                unit_service?.country?.time_zone ||
                Intl.DateTimeFormat().resolvedOptions().timeZone,
            })
          }
          primaryTypographyProps={{ typography: 'subtitle1', noWrap: true }}
          secondaryTypographyProps={{
            typography: 'body2',
            component: 'span',
            mt: 0.5,
            color: 'text.disabled',
          }}
        />

        {/* <Rating value={rating} size="small" readOnly precision={0.5} /> */}
        {[
          {
            // label: t('appointment type'),
            label: curLangAr ? appointment_type?.name_arabic : appointment_type?.name_english,
            icon: <Iconify icon="streamline:waiting-appointments-calendar" />,
          },
          {
            // label: t('work group'),
            label: curLangAr ? work_group?.name_arabic : work_group?.name_english,
            icon: <Iconify icon="ri:group-line" />,
          },
          {
            // label: t('work group'),
            label: service_types?.reduce(
              (total, service) => total + service.Price_per_unit || 0,
              0
            ),
            icon: <Iconify icon="solar:tag-price-bold" />,
          },
          {
            label: t('available online'),
            // value:
            //   work_days.length === 7 ? t('All days') : work_days.map((day) => t(day)).join(', '),
            icon: (
              <Iconify
                icon={online_available ? 'typcn:tick-outline' : 'mdi:close-outline'}
                sx={{ color: online_available ? 'success.main' : 'error.main' }}
              />
            ),
          },
        ].map((one, idx) => (
          <Stack key={idx} spacing={0.5} direction="row">
            {one.icon}
            <ListItemText
              primary={one.label}
              secondary={<span dir={one.label === 'رقم الهاتف' ? 'ltr' : 'auto'}>{one.value}</span>}
              primaryTypographyProps={{
                typography: 'body2',
                color: 'text.secondary',
                mb: 0.5,
              }}
              secondaryTypographyProps={{
                typography: 'subtitle2',
                color: 'text.primary',
                component: 'span',
                textTransform: 'none',
              }}
            />
          </Stack>
        ))}
      </Stack>

      {/* <Stack direction="row" flexWrap="wrap" spacing={1}>
        {tags.map((tag) => (
          <Chip size="small" variant="soft" key={tag} label={tag} />
        ))}
      </Stack> */}
    </Stack>
  );
}

ReviewItem.propTypes = {
  item: PropTypes.object,
};
