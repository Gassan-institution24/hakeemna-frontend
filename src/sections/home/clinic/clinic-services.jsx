import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { useGetUSActiveServiceTypes } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import SectionHeading from '../components/section-heading';

// ----------------------------------------------------------------------

export default function ClinicServices({ unitServiceId, onViewDoctors }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { serviceTypesData } = useGetUSActiveServiceTypes(unitServiceId);

  if (!serviceTypesData?.length) {
    return null;
  }

  return (
    <Stack spacing={1.5}>
      <SectionHeading title={t('services')} />
      <Box
        gap={2}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {serviceTypesData.map((service) => (
          <Stack
            key={service._id}
            spacing={1.5}
            sx={{ p: 2.5, borderRadius: 1.5, border: (theme) => `solid 1px ${theme.palette.divider}` }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Iconify icon="solar:health-bold" width={22} sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle2" sx={{ flexGrow: 1 }}>
                {curLangAr ? service.name_arabic : service.name_english}
              </Typography>
            </Stack>

            {(curLangAr ? service.description_arabic : service.description_english) && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {curLangAr ? service.description_arabic : service.description_english}
              </Typography>
            )}

            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {service.Price_per_unit && (
                <Typography variant="subtitle2" color="primary.main">
                  {fCurrency(service.Price_per_unit, service.currency?.symbol)}
                </Typography>
              )}
              {service.place_of_service && <Chip size="small" label={t(service.place_of_service)} />}
            </Stack>

            {onViewDoctors && (
              <Button size="small" variant="outlined" color="inherit" onClick={onViewDoctors}>
                {t('view doctors')}
              </Button>
            )}
          </Stack>
        ))}
      </Box>
    </Stack>
  );
}

ClinicServices.propTypes = {
  unitServiceId: PropTypes.string,
  onViewDoctors: PropTypes.func,
};
