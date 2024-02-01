import { m } from 'framer-motion';

import Image from 'src/components/image';

import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import React, { useState } from 'react';
import Iconify from 'src/components/iconify';

import { fDate } from 'src/utils/format-time';
// ----------------------------------------------------------------------

export default function TourDetailsContent({ tour }) {
  const renderGallery = (
    <>
      <Box gap={1} display="grid">
        <m.div
          key={tour.Offer_img}
          whileHover="hover"
          variants={{
            hover: { opacity: 0.8 },
          }}
        >
          <Image
            alt="offer img"
            src={tour.Offer_img}
            ratio="1/1"
            sx={{ borderRadius: 2, cursor: 'pointer', height: '50%', width: '70%', ml: 7.7 }}
          />
        </m.div>
      </Box>
    </>
  );

  const renderHead = (
    <>
      <Stack direction="row" sx={{ mb: 3, mt: -25 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {tour.Offer_name}
        </Typography>
      </Stack>
      <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
          {tour.cities?.name_english}
        </Stack>
      </Stack>
    </>
  );

  const renderOverview = (
    <Box
      gap={3}
      display="grid"
      gridTemplateColumns={{
        xs: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
      }}
    >
      {[
        {
          label: 'Available',
          value: ` ${fDate(tour.Offer_start_date)} - ${fDate(tour.Offer_end_date)}`,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Offer Name',
          value: tour.Offer_name,
          icon: <Iconify icon="solar:user-rounded-bold" />,
        },
        {
          label: 'Offer Price',
          value: tour.Offer_price,
          icon: <Iconify icon="tdesign:money" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={item.value}
            primaryTypographyProps={{
              typography: 'body2',
              color: 'text.secondary',
              mb: 0.5,
            }}
            secondaryTypographyProps={{
              typography: 'subtitle2',
              color: 'text.primary',
              component: 'span',
            }}
          />
        </Stack>
      ))}
    </Box>
  );

  const renderContent = (
    // <>
    //   {/* <Markdown children={content} /> */}

    //   <Stack spacing={2}>
    //     <Typography variant="h6"> Services</Typography>

    //     <Box
    //       rowGap={2}
    //       display="grid"
    //       gridTemplateColumns={{
    //         xs: 'repeat(1, 1fr)',
    //         md: 'repeat(2, 1fr)',
    //       }}
    //     >
    //       {/* {TOUR_SERVICE_OPTIONS.map((service) => (
    //         <Stack
    //           key={service.label}
    //           spacing={1}
    //           direction="row"
    //           alignItems="center"
    //           sx={{
    //             ...(services.includes(service.label) && {
    //               color: 'text.disabled',
    //             }),
    //           }}
    //         >
    //           <Iconify
    //             icon="eva:checkmark-circle-2-outline"
    //             sx={{
    //               color: 'primary.main',
    //               ...(services.includes(service.label) && {
    //                 color: 'text.disabled',
    //               }),
    //             }}
    //           />
    //           {service.label}
    //         </Stack>
    //       ))} */}
    //     </Box>
    //   </Stack>
    // </>
    <></>
  );

  return (
    <>
      {renderGallery}

      <Stack sx={{ maxWidth: 720, mx: 'auto' }}>
        {renderHead}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderOverview}

        <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

        {renderContent}
      </Stack>
    </>
  );
}

TourDetailsContent.propTypes = {
  tour: PropTypes.object,
};
