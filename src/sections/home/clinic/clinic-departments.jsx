import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useGetUSActiveDepartments } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import SectionHeading from '../components/section-heading';

// ----------------------------------------------------------------------

export default function ClinicDepartments({ unitServiceId }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { departmentsData } = useGetUSActiveDepartments(unitServiceId);

  if (!departmentsData?.length) {
    return null;
  }

  return (
    <Stack spacing={1.5}>
      <SectionHeading title={t('departments')} />
      <Box
        gap={2}
        display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }}
      >
        {departmentsData.map((department) => (
          <Stack
            key={department._id}
            spacing={1}
            sx={{ p: 2.5, borderRadius: 1.5, bgcolor: 'background.neutral' }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <Iconify icon="solar:hospital-bold" sx={{ color: 'primary.main' }} />
              <Typography variant="subtitle2">
                {curLangAr ? department.name_arabic : department.name_english}
              </Typography>
            </Stack>
            {department.general_info && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {department.general_info}
              </Typography>
            )}
            {department.Phone_number && (
              <Typography variant="caption" dir="ltr" sx={{ color: 'text.disabled' }}>
                {department.Phone_number}
              </Typography>
            )}
          </Stack>
        ))}
      </Box>
    </Stack>
  );
}

ClinicDepartments.propTypes = {
  unitServiceId: PropTypes.string,
};
