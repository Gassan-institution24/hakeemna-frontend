import { useRef } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { fDateTime } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function TourItem({ tour, onView, onEdit, onStatusChange }) {
  const popover = usePopover();
  const ref = useRef();
  const { Offer_name, Offer_price, created_at, Offer_img } = tour;

  // const shortLabel = shortDateLabel(available.startDate, available.endDate);

  function differenceBetweenDates(date1, date2) {
    const startDate = new Date(date1);
    const endDate = new Date(date2);
    const difference = Math.abs(endDate.getTime() - startDate.getTime());
    const millisecondsInDay = 1000 * 60 * 60 * 24;
    const daysDifference = Math.floor(difference / millisecondsInDay);

    return daysDifference;
  }

  const renderPrice = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        left: 8,
        zIndex: 9,
        borderRadius: 1,
        bgcolor: 'grey.800',
        position: 'absolute',
        p: '2px 6px 2px 4px',
        color: 'common.white',
        typography: 'subtitle2',
      }}
    >
      {fCurrency(Offer_price)}
    </Stack>
  );
  const renderStatus = (
    <Stack>
      {tour.status === 'active' ? (
        <Box
          ref={ref}
          sx={{
            top: 8,
            right: 8,
            zIndex: 9,
            borderRadius: 1,
            bgcolor: 'green',
            position: 'absolute',
            p: '2px 6px 2px 4px',
            color: 'common.white',
            typography: 'subtitle2',
          }}
        >
          {tour.status}
        </Box>
      ) : (
        <Box
          ref={ref}
          sx={{
            top: 8,
            right: 8,
            zIndex: 9,
            borderRadius: 1,
            bgcolor: 'red',
            position: 'absolute',
            p: '2px 6px 2px 4px',
            color: 'common.white',
            typography: 'subtitle2',
          }}
        >
          {tour.status}
        </Box>
      )}
    </Stack>
  );

  const renderImages = (
    <Stack
      spacing={0.5}
      direction="row"
      sx={{
        p: (theme) => theme.spacing(1, 1, 0, 1),
      }}
    >
      <Stack flexGrow={1} sx={{ position: 'relative' }}>
        {renderPrice}
        {renderStatus}
        <Image alt="img" src={Offer_img} sx={{ borderRadius: 1, height: 164, width: 1 }} />
      </Stack>
    </Stack>
  );

  const renderTexts = (
    <ListItemText
      sx={{
        p: (theme) => theme.spacing(2.5, 2.5, 2, 2.5),
      }}
      primary={`Posted date: ${fDateTime(created_at)}`}
      secondary={
        <Link component={RouterLink} href={paths.dashboard.tour.details} color="inherit">
          {Offer_name}
        </Link>
      }
      primaryTypographyProps={{
        typography: 'caption',
        color: 'text.disabled',
      }}
      secondaryTypographyProps={{
        mt: 1,
        noWrap: true,
        component: 'span',
        color: 'text.primary',
        typography: 'subtitle1',
      }}
    />
  );

  const renderInfo = (
    <Stack
      spacing={1.5}
      sx={{
        position: 'relative',
        p: (theme) => theme.spacing(0, 2.5, 2.5, 2.5),
      }}
    >
      <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', bottom: 20, right: 8 }}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>

      {[
        {
          label: tour.cities?.name_english,
          icon: <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />,
        },
        {
          label: `${differenceBetweenDates(tour.Offer_start_date, tour.Offer_end_date)} Days`,
          icon: <Iconify icon="solar:clock-circle-bold" sx={{ color: 'info.main' }} />,
        },
      ].map((item) => (
        <Stack
          key={item.label}
          spacing={1}
          direction="row"
          alignItems="center"
          sx={{ typography: 'body2' }}
        >
          {item.icon}
          {item.label}
        </Stack>
      ))}
    </Stack>
  );

  return (
    <>
      <Card>
        {renderImages}

        {renderTexts}

        {renderInfo}
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView(tour._id);
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onEdit(tour._id);
          }}
        >
          <Iconify icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => {
            popover.onClose();
            onStatusChange();
          }}
          sx={{ color: 'error.main' }}
        >
          {tour.status === 'active' ? (
            <>
              <Iconify icon="lets-icons:stop-fill" />
              Deactivate
            </>
          ) : (
            <>
              <Iconify icon="ri:play-fill" />
              Activate
            </>
          )}
        </MenuItem>
      </CustomPopover>
    </>
  );
}

TourItem.propTypes = {
  onStatusChange: PropTypes.func,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  tour: PropTypes.object,
};
