import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from '../department-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ departmentData }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={t('update department')}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice,
          },
          {
            name: t('departments'),
            href: paths.unitservice.departments.root,
          },
          { name: t('update department') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {departmentData && <TableNewEditForm currentTable={departmentData} />}
    </Container>
  );
}
TableEditView.propTypes = {
  departmentData: PropTypes.object,
};
