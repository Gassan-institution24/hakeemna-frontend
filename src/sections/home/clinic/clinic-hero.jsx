import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { varTranHover } from 'src/components/animate';
import Lightbox, { useLightBox } from 'src/components/lightbox';

// ----------------------------------------------------------------------

export default function ClinicHero({ USData, onGetDirections }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { name_english, name_arabic, company_logo, rate, rate_numbers, US_type, sector_type, country, city } =
    USData;

  const slides = [{ src: company_logo }];
  const {
    selected: selectedImage,
    open: openLightbox,
    onOpen: handleOpenLightbox,
    onClose: handleCloseLightbox,
  } = useLightBox(slides);

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={3}
      alignItems={{ md: 'center' }}
      sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.paper', borderRadius: 2 }}
    >
      {company_logo && (
        <m.div whileHover="hover" variants={{ hover: { opacity: 0.85 } }} transition={varTranHover()}>
          <Image
            alt={name_english}
            src={company_logo}
            ratio="1/1"
            onClick={() => handleOpenLightbox(company_logo)}
            sx={{ width: { xs: 1, md: 180 }, borderRadius: 2, cursor: 'pointer' }}
          />
        </m.div>
      )}

      <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="h1">
          {curLangAr ? name_arabic : name_english}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {US_type && (
            <Chip size="small" label={curLangAr ? US_type?.name_arabic : US_type?.name_english} />
          )}
          {sector_type && <Chip size="small" variant="outlined" label={t(sector_type)} />}
        </Stack>

        <Stack direction="row" spacing={3} flexWrap="wrap" alignItems="center">
          {!!rate && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="eva:star-fill" sx={{ color: 'warning.main' }} />
              <Typography variant="subtitle2">{rate}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ({rate_numbers} {t('reviews')})
              </Typography>
            </Stack>
          )}

          {(country || city) && (
            <Link
              component="button"
              type="button"
              onClick={onGetDirections}
              underline="hover"
              color="text.secondary"
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, typography: 'body2' }}
            >
              <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
              {curLangAr ? country?.name_arabic : country?.name_english}
              {city ? `, ${curLangAr ? city?.name_arabic : city?.name_english}` : ''}
            </Link>
          )}
        </Stack>
      </Stack>

      <Lightbox index={selectedImage} slides={slides} open={openLightbox} close={handleCloseLightbox} />
    </Stack>
  );
}

ClinicHero.propTypes = {
  USData: PropTypes.object,
  onGetDirections: PropTypes.func,
};
