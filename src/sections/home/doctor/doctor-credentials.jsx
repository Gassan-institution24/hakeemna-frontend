import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import ChipList from '../components/chip-list';
import SectionHeading from '../components/section-heading';

// ----------------------------------------------------------------------

export default function DoctorCredentials({ employee }) {
  const { t } = useTranslate();

  const certifications = employee?.certifications?.filter((one) => one.name && one.year) || [];
  const memberships = employee?.memberships?.filter((one) => one.name && one.institution) || [];
  const other = employee?.other?.filter((one) => one.kind && one.name) || [];
  const keywords = employee?.keywords || [];

  if (!certifications.length && !memberships.length && !other.length && !keywords.length) {
    return null;
  }

  return (
    <Stack spacing={4}>
      {certifications.length > 0 && (
        <Stack spacing={1.5}>
          <SectionHeading title={t('certifications')} />
          <Stack spacing={1}>
            {certifications.map((one, index) => (
              <Typography key={index} variant="body2">
                {one.name}, {one.institution}, {fDate(new Date(one.year), 'yyyy')}
              </Typography>
            ))}
          </Stack>
        </Stack>
      )}

      {memberships.length > 0 && (
        <Stack spacing={1.5}>
          <SectionHeading title={t('memberships')} />
          <Stack spacing={1}>
            {memberships.map((one, index) => (
              <Typography key={index} variant="body2">
                {one.name}, {one.institution}
              </Typography>
            ))}
          </Stack>
        </Stack>
      )}

      {other.length > 0 && (
        <Stack spacing={1.5}>
          <SectionHeading title={t('other (researchs, books, and conferences)')} />
          <Stack spacing={1}>
            {other.map((one, index) => (
              <Typography key={index} variant="body2">
                {one.name}, {t(one.kind)}
              </Typography>
            ))}
          </Stack>
        </Stack>
      )}

      {keywords.length > 0 && (
        <Stack spacing={1.5}>
          <SectionHeading title={t('specializations')} />
          <ChipList items={keywords} />
        </Stack>
      )}
    </Stack>
  );
}

DoctorCredentials.propTypes = {
  employee: PropTypes.object,
};
