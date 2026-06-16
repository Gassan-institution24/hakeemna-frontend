import PropTypes from 'prop-types';

import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function DoctorHero({ employeeData, hasAvailableSlots, onBook, onMessage }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { employee, unit_service, fees, fees_after_discount, currency, visibility_online_appointment } =
    employeeData;

  const yearsOfExperience = (() => {
    if (!employee?.Bachelor_year_graduation) return null;
    const gradYear = new Date(employee.Bachelor_year_graduation).getFullYear();
    const years = new Date().getFullYear() - gradYear;
    return years > 0 ? years : null;
  })();

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={3}
      alignItems={{ md: 'center' }}
      sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.paper', borderRadius: 2 }}
    >
      <Image
        alt={employee?.name_english}
        src={employee?.picture}
        ratio="1/1"
        sx={{ width: { xs: 1, md: 200 }, borderRadius: 2 }}
      />

      <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
        <Typography variant="h4" component="h1">
          {curLangAr ? employee?.name_arabic : employee?.name_english}
        </Typography>

        <Stack direction="row" spacing={1} flexWrap="wrap">
          {employee?.speciality && (
            <Chip
              size="small"
              color="primary"
              label={curLangAr ? employee.speciality?.name_arabic : employee.speciality?.name_english}
            />
          )}
          {employee?.sub_speciality && (
            <Chip
              size="small"
              variant="outlined"
              label={curLangAr ? employee.sub_speciality?.name_arabic : employee.sub_speciality?.name_english}
            />
          )}
          {visibility_online_appointment && (
            <Chip size="small" color="info" icon={<Iconify icon="solar:video-frame-bold" />} label={t('online consultation')} />
          )}
          {hasAvailableSlots && (
            <Chip size="small" color="success" label={t('available today')} />
          )}
        </Stack>

        <Stack direction="row" spacing={3} flexWrap="wrap" alignItems="center">
          {!!employee?.rate && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Rating size="small" readOnly value={employee.rate} precision={0.1} max={5} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                ({employee.rated_times} {t('reviews')})
              </Typography>
            </Stack>
          )}
          {yearsOfExperience && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="solar:medal-ribbons-star-bold" sx={{ color: 'warning.main' }} />
              <Typography variant="body2">
                {yearsOfExperience} {t('years of experience')}
              </Typography>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
          {unit_service && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Iconify icon="mingcute:location-fill" sx={{ color: 'error.main' }} />
              <Typography variant="body2">
                {curLangAr ? unit_service?.name_arabic : unit_service?.name_english}
              </Typography>
            </Stack>
          )}
        </Stack>

        {!!fees && (
          <Stack direction="row" gap={1} alignItems="center">
            <Typography variant="body2">{t('fees')}:</Typography>
            {fees_after_discount ? (
              <>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: 'line-through', textDecorationColor: 'error.main' }}
                >
                  {fCurrency(fees, currency?.symbol)}
                </Typography>
                <Typography variant="subtitle1" color="primary.main">
                  {fCurrency(fees_after_discount, currency?.symbol)}
                </Typography>
              </>
            ) : (
              <Typography variant="subtitle1">{fCurrency(fees, currency?.symbol)}</Typography>
            )}
          </Stack>
        )}

        <Stack direction="row" spacing={2} flexWrap="wrap" sx={{ pt: 1 }}>
          {visibility_online_appointment && (
            <Button variant="contained" size="large" startIcon={<Iconify icon="solar:calendar-add-bold" />} onClick={onBook}>
              {t('book appointment')}
            </Button>
          )}
          {employee?.phone && (
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<Iconify icon="solar:chat-round-dots-bold" />}
              onClick={onMessage}
            >
              {t('message doctor')}
            </Button>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}

DoctorHero.propTypes = {
  employeeData: PropTypes.object,
  hasAvailableSlots: PropTypes.bool,
  onBook: PropTypes.func,
  onMessage: PropTypes.func,
};
