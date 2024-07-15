import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
// import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fTime } from 'src/utils/format-time';

// import { TOUR_SERVICE_OPTIONS } from 'src/_mock';

import { useParams } from 'src/routes/hooks';

import { useGetUSActiveEmployeeEngs } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import Markdown from 'src/components/markdown';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import UnitServiceEmployees from '../unit-service-employee';

// ----------------------------------------------------------------------

export default function UnitServicePage({ USData }) {
  const {
    name_english,
    name_arabic,
    company_logo,
    introduction_letter,
    arabic_introduction_letter,
    work_start_time,
    work_end_time,
    phone,
    rate,
    rate_numbers,
    country,
    city,
    sector_type,
    US_type,
    web_page,
    work_days,
    email,
    insurance,
    location_gps,
  } = USData;

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { id } = useParams();
  const { employeesData } = useGetUSActiveEmployeeEngs(id);

  const getDirections = () => {
    window.location.href = location_gps;
  };

  const slides = [{ src: company_logo }];
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
          label: t('type'),
          value: curLangAr ? US_type?.name_arabic : US_type?.name_english,
          icon: <Iconify icon="ri:hospital-fill" />,
        },
        {
          label: t('sector type'),
          value: t(sector_type),
          icon: <Iconify icon="fluent:class-24-filled" />,
        },
        {
          label: t('work days'),
          value: work_days.length === 7 ? t('All days') : work_days.map((day) => t(day)).join(', '),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: t('work hours'),
          value:
            work_start_time === work_end_time
              ? t('24 hours')
              : `${fTime(work_start_time, 'p', curLangAr)} - ${fTime(
                work_end_time,
                'p',
                curLangAr
              )}`,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        {
          label: t('contact phone'),
          value: phone,
          icon: <Iconify icon="solar:phone-bold" />,
        },
        {
          label: t('email'),
          value: email,
          icon: <Iconify icon="entypo:email" />,
        },
        {
          label: t('website'),
          value: web_page,
          icon: <Iconify icon="fluent-mdl2:website" />,
        },
      ].map((item) => (
        <Stack key={item.label} spacing={1.5} direction="row">
          {item.icon}
          <ListItemText
            primary={item.label}
            secondary={<span dir={item.label === 'رقم الهاتف' ? 'ltr' : 'auto'}>{item.value}</span>}
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
    </Box>
  );

  const renderHead = (
    <Stack>
      <Stack direction="row" sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {curLangAr ? name_arabic : name_english}
        </Typography>
      </Stack>

      <Stack spacing={3} direction="row" flexWrap="wrap" alignItems="center">
        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ typography: 'body2' }}>
          <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
          <Box component="span" sx={{ typography: 'subtitle2' }}>
            {rate}
          </Box>
          <Link sx={{ color: 'text.secondary' }}>
            ({rate_numbers} {t('reviews')})
          </Link>
        </Stack>

        <Stack
          onClick={getDirections}
          direction="row"
          alignItems="center"
          spacing={0.5}
          sx={{
            typography: 'body2',
            cursor: location_gps ? 'pointer' : '',
            textDecoration: location_gps ? 'underline' : '',
          }}
        >
          <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
          {curLangAr ? country?.name_arabic : country?.name_english},{' '}
          {curLangAr ? city?.name_arabic : city?.name_english}
        </Stack>
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
    <Stack sx={{ mb: 5, mx: 2 }}>
      <Markdown
        sx={{ px: 5, textTransform: 'none' }}
        children={curLangAr ? arabic_introduction_letter : introduction_letter}
      />

      <Divider sx={{ borderStyle: 'dashed', my: 5 }} />

      <Typography variant="h6">{t('insurance companies')}</Typography>

      {insurance.length === 0 && (
        <Typography
          sx={{ px: 5, py: 1, color: 'text.disabled', textTransform: 'none' }}
          variant="subtitle2"
        >
          {t('Does not work with any insurance company')}
        </Typography>
      )}

      <Box
        rowGap={2}
        columnGap={2}
        display="grid"
        justifyContent="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        sx={{ px: 5, py: 1 }}
      >
        {insurance?.map((insur) => (
          <Stack
            key={insur._id}
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{
              ...(insurance?.includes(insur._id) && {
                color: 'text.disabled',
              }),
            }}
          >
            <Iconify
              icon="eva:checkmark-circle-2-outline"
              sx={{
                color: 'primary.main',
                ...(insurance?.includes(insur._id) && {
                  color: 'text.disabled',
                }),
              }}
            />
            {curLangAr ? insur?.name_arabic : insur?.name_english}
          </Stack>
        ))}
      </Box>
      <Divider sx={{ borderStyle: 'dashed', my: 5 }} />
      <Typography sx={{ mt: 2 }} variant="h6">
        {t('Employees')}
      </Typography>
      <UnitServiceEmployees employees={employeesData} />
      {/* </Stack> */}
    </Stack>
  );

  return (
    <Stack sx={{ m: { md: 10 } }}>
      {renderGallery}

      < Divider sx={{ borderStyle: 'dashed', my: 5 }} />

      {renderContent}
    </Stack >
  );
}

UnitServicePage.propTypes = {
  USData: PropTypes.object,
};
