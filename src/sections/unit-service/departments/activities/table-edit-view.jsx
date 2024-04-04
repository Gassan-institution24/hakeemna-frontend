import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ departmentData, activityData }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={`${t('edit')} ${activityData.name_english || ''} ${t('activity')}`}
        links={[
          {
            name: t('dashboard'),
            href: paths.unitservice.root,
          },
          {
            name: t('departments'),
            href: paths.unitservice.departments.root,
          },
          {
            name: `${departmentData.name_english || ''} ${t('activities')}`,
            href: paths.unitservice.departments.activities.root(departmentData._id),
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {activityData && (
        <TableNewEditForm departmentData={departmentData} currentTable={activityData} />
      )}
    </Container>
  );
}
TableEditView.propTypes = {
  activityData: PropTypes.object,
  departmentData: PropTypes.object,
};
