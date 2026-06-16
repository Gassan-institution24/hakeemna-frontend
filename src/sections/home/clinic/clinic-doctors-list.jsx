import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';

import { useTranslate } from 'src/locales';

import EmptyState from '../components/empty-state';
import SectionHeading from '../components/section-heading';
import UnitServiceEmployees from '../unit-service-employee';

// ----------------------------------------------------------------------

export default function ClinicDoctorsList({ employees = [] }) {
  const { t } = useTranslate();

  const visible = employees.filter((employee) => employee.visibility_US_page);

  return (
    <Stack spacing={1.5}>
      <SectionHeading title={t('doctors')} />
      {visible.length > 0 ? (
        <UnitServiceEmployees employees={employees} />
      ) : (
        <EmptyState icon="solar:users-group-rounded-bold" label={t('no doctors available yet')} />
      )}
    </Stack>
  );
}

ClinicDoctorsList.propTypes = {
  employees: PropTypes.array,
};
