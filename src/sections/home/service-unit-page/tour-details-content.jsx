import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
// import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';

// import { TOUR_SERVICE_OPTIONS } from 'src/_mock';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';
import { useParams } from 'src/routes/hooks';
import { useGetUSActiveEmployeeEngs } from 'src/api';
import TourDetailsBookers from './tour-details-bookers';

// ----------------------------------------------------------------------

const TOUR_SERVICE_OPTIONS = [
  { value: 'Audio guide', label: 'Audio guide' },
  { value: 'Food and drinks', label: 'Food and drinks' },
  { value: 'Lunch', label: 'Lunch' },
  { value: 'Private tour', label: 'Private tour' },
  { value: 'Special activities', label: 'Special activities' },
  { value: 'Entrance fees', label: 'Entrance fees' },
  { value: 'Gratuities', label: 'Gratuities' },
  { value: 'Pick-up and drop off', label: 'Pick-up and drop off' },
  { value: 'Professional guide', label: 'Professional guide' },
  {
    value: 'Transport by air-conditioned',
    label: 'Transport by air-conditioned',
  },
];

export default function TourDetailsContent({ tour }) {
  const {
    name_english,
    company_logo,
    introduction_letter,
    services,
    tourGuides,
    available,
    work_hours,
    phone,
    rate,
    rate_numbers,
    country,
    city,
    sector_type,
    US_type,
    web_page,
    email,
  } = tour;

  const { id } = useParams();
  const { employeesData } = useGetUSActiveEmployeeEngs(id);
  console.log('employeesData', employeesData);

  const slides = [{ src: company_logo }];
  // const slides = company_logo?.map((slide) => ({
  //   src: slide,
  // }));

  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

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
          label: 'email',
          value: email,
          icon: <Iconify icon="entypo:email" />,
        },
        {
          label: 'website',
          value: web_page,
          icon: <Iconify icon="fluent-mdl2:website" />,
        },
        {
          label: 'work days',
          value: `${fDate(available?.startDate)} - ${fDate(available?.endDate)}`,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'work hours',
          value: work_hours,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: 'Contact name',
          value: tourGuides?.map((tourGuide) => tourGuide.phoneNumber).join(', '),
          icon: <Iconify icon="solar:user-rounded-bold" />,
        },
        {
          label: 'Contact phone',
          value: phone,
          icon: <Iconify icon="solar:phone-bold" />,
        },
        {
          label: 'sector type',
          value: sector_type,
          icon: <Iconify icon="fluent:class-24-filled" />,
        },
        {
          label: 'type',
          value: US_type?.name_english,
          icon: <Iconify icon="ri:hospital-fill" />,
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

  const renderHead = (
    <Stack>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {name_english}
        </Typography>

        <IconButton>
          <Iconify icon="solar:share-bold" />
        </IconButton>

        {/* <Checkbox
          defaultChecked
          color="error"
          icon={<Iconify icon="solar:heart-outline" />}
          checkedIcon={<Iconify icon="solar:heart-bold" />}
        /> */}
      </Stack>

      <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {rate}
          </Box>
          <Link sx={{ color: 'text.secondary' }}>({rate_numbers} reviews)</Link>
        </Stack>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
          {country?.name_english}, {city?.name_english}
        </Stack>

        {/* <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'subtitle2' }}>
          <Iconify icon="solar:flag-bold" sx={{ color: 'info.main' }} />
          <Box component="span" sx={{ typography: 'body2', color: 'text.secondary' }}>
            Guide by
          </Box>
          {tourGuides?.map((tourGuide) => tourGuide.name).join(', ')}
        </Stack> */}
      </Stack>
      <Divider sx={{ borderStyle: 'dashed', my: 5 }} />
      {renderOverview}
    </Stack>
  );

  const renderGallery = (
    <>
      <Box
        gap={5}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
        justifyContent="center"
        alignItems="center"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        <m.div
          key={slides[0].src}
          whileHover="hover"
          variants={{
            hover: { opacity: 0.8 },
          }}
          transition={varTranHover()}
        >
          <Image
            alt={slides[0].src}
            src={slides[0].src}
            ratio="1/1"
            onClick={() => handleOpenLightbox(slides[0].src)}
            sx={{ borderRadius: 2, cursor: 'pointer' }}
          />
        </m.div>
        {renderHead}
        {/* <Box gap={1} display="grid" gridTemplateColumns="repeat(2, 1fr)">
          {slides.slice(1, 5)?.map((slide) => (
            <m.div
              key={slide.src}
              whileHover="hover"
              variants={{
                hover: { opacity: 0.8 },
              }}
              transition={varTranHover()}
            >
              <Image
                alt={slide.src}
                src={slide.src}
                ratio="1/1"
                onClick={() => handleOpenLightbox(slide.src)}
                sx={{ borderRadius: 2, cursor: 'pointer' }}
              />
            </m.div>
          ))}
        </Box> */}
      </Box>

      <Lightbox
        index={selectedImage}
        slides={slides}
        open={openLightbox}
        close={handleCloseLightbox}
      />
    </>
  );

  const renderContent = (
    <Stack sx={{mb:5}}>
      <Markdown children={introduction_letter} />

      {/* <Stack spacing={2}> */}
      <Typography variant="h6"> Employees </Typography>
      <TourDetailsBookers bookers={employeesData} />
      {/* <Box
          rowGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          {employeesData?.map((service) => (
            <Stack
              key={service.label}
              spacing={1}
              direction="row"
              alignItems="center"
              sx={{
                ...(employeesData?.includes(service.label) && {
                  color: 'text.disabled',
                }),
              }}
            >
              <Iconify
                icon="eva:checkmark-circle-2-outline"
                sx={{
                  color: 'primary.main',
                  ...(employeesData?.includes(service.label) && {
                    color: 'text.disabled',
                  }),
                }}
              />
              {service.label}
            </Stack>
          ))}
        </Box> */}
      {/* </Stack> */}
    </Stack>
  );

  return (
    <>
      {renderGallery}

      {/* <Stack sx={{ maxWidth: 720, mx: 'auto' }}> */}
        {/* {renderHead} */}

        {/* <Divider sx={{ borderStyle: 'dashed', my: 5 }} /> */}

        {/* {renderOverview} */}

        {/* <Divider sx={{ borderStyle: 'dashed', my: 5 }} /> */}

        {renderContent}
      {/* </Stack> */}
    </>
  );
}

TourDetailsContent.propTypes = {
  tour: PropTypes.object,
};
