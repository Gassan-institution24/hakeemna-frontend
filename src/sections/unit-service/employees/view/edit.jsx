import PropTypes from 'prop-types';
import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../new/create-edit-employee';

// ----------------------------------------------------------------------

export default function TableCreateView({ employeeData }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('Edit Employee Account')}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          {
            name: t('employees'),
            href: paths.unitservice.employees.root,
          },
          { name: t('sdit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableNewEditForm currentTable={employeeData} />
    </Container>
  );
}
TableCreateView.propTypes = {
  employeeData: PropTypes.object,
};
