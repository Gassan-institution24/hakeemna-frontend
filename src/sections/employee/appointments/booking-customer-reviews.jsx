import PropTypes from 'prop-types';
import { isValid } from 'date-fns';
import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import CardHeader from '@mui/material/CardHeader';
import ListItemText from '@mui/material/ListItemText';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Carousel, { useCarousel, CarouselArrows } from 'src/components/carousel';

// ----------------------------------------------------------------------

export default function BookingCustomerReviews({ selected, setSelected, list, loading, ...other }) {
  const { t } = useTranslate();

  const [curIndex, setCurIndex] = useState();

  const carousel = useCarousel({
    adaptiveHeight: true,
    initialSlide: curIndex || 0,
  });

  useEffect(() => {
    if (!loading.value) {
      if (list.length) {
        list.forEach((one, index) => {
          console.log('one.selected', selected);
          console.log('one', one._id);
          console.log('one._id === selected', one._id === selected);
          if (one._id === selected) {
            console.log('one.index', index);
            setCurIndex(index);
          }
        });
      } else setCurIndex(0);
    }
  }, [list, selected, loading]);

  useEffect(() => {
    setSelected(list[carousel.currentIndex]?._id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list, carousel.currentIndex]);

  return (
    // <Card {...other}>
    <>
      <CardHeader
        title={t('Appointment details')}
        // subheader="Appointment"
        action={<CarouselArrows onNext={carousel.onNext} onPrev={carousel.onPrev} />}
      />

      <Carousel style={{ dir: 'rtl' }} ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {list.map((item) => (
          <ReviewItem key={item._id} item={item} />
        ))}
      </Carousel>

      <Divider sx={{ borderStyle: 'dashed', my: 3 }} />

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

BookingCustomerReviews.propTypes = {
  selected: PropTypes.string,
  list: PropTypes.array,
  loading: PropTypes.bool,
  setSelected: PropTypes.func,
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
            label: service_types?.reduce((total, service) => total + service.Price_per_unit, 0),
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
        ].map((one) => (
          <Stack key={one.label} spacing={0.5} direction="row">
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
