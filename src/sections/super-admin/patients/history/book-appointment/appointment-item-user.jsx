import PropTypes from 'prop-types';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import { Button } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function AppointmentItem({ appointment, onBook, onView }) {
  const popover = usePopover();
  const [insuranceNames, setInsuranceNames] = useState();

  const { unit_service, appointment_type, start_time } = appointment;
  useEffect(() => {
    if (unit_service?.insurance) {
      const names = unit_service.insurance.map((test) => test.name_english);
      setInsuranceNames(names);
    }
  }, [unit_service]);

  const handleClick = (event) => {
    event.preventDefault();
  };

  return (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>

        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            alt={unit_service?.name_english}
            src={unit_service?.company_log}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <ListItemText
            sx={{ mb: 1 }}
            primary={
              <Link to="#" onClick={handleClick}>
                {unit_service?.name_english}
              </Link>
            }
            secondary={
              <Link to="#" onClick={handleClick} sx={{ color: 'black' }}>
                {appointment_type?.name_english} appointment
              </Link>
            }
            primaryTypographyProps={{
              typography: 'subtitle1',
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'text.disabled', typography: 'caption' }}
          >
            {fDate(appointment.start_time)}
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            sx={{ typography: 'caption', color: 'text.disabled' }}
          >
            {fTime(appointment.start_time)}
            <Iconify icon="fad:digital-colon" />
            {fTime(appointment.end_time)}
          </Stack>
          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'text.disabled', typography: 'caption' }}
          >
            {/* <Iconify width={16} icon="ic:baseline-tag" /> */}
            {/* {address} */} address- address
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          rowGap={1.5}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{ p: 3, justifyContent: 'space-between' }}
        >
          {[
            {
              label: format(new Date(start_time), 'p'),
              icon: <Iconify width={16} icon="icon-park-solid:time" sx={{ flexShrink: 0 }} />,
            },
            {
              label: insuranceNames,
              icon: (
                <Iconify width={16} icon="medical-icon:health-services" sx={{ flexShrink: 0 }} />
              ),
            },
            {
              label: appointment_type?.name_english,
              icon: <Iconify width={16} icon="fa-solid:file-medical-alt" sx={{ flexShrink: 0 }} />,
            },
            {
              label: `${appointment?.price} JOD`,
              icon: (
                <Iconify width={16} icon="streamline:payment-10-solid" sx={{ flexShrink: 0 }} />
              ),
            },
          ].map((item) => (
            <Stack
              key={item.label}
              spacing={1}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item.icon}
              <Typography variant="caption" noWrap>
                {item.label}
              </Typography>
            </Stack>
          ))}
          <Button onClick={onBook} sx={{ mt: 3, width: 100 }} variant="outlined" color="success">
            Book
          </Button>
        </Box>
      </Card>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {}
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>
    </>
  );
}

AppointmentItem.propTypes = {
  appointment: PropTypes.object,
  onView: PropTypes.func,
  onBook: PropTypes.func,
};
