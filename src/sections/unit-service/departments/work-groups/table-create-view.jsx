import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView({ departmentData }) {
  const settings = useSettingsContext();
  return (
    <Container maxWidth="xl">
      {/* <CustomBreadcrumbs
        heading={t("Create a new work group")}
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
            name: `${curLangAr?departmentData.name_arabic:departmentData.name_english || t('department')} ${t('work groups')}`,
            href: paths.unitservice.departments.workGroups.root(departmentData._id),
          },
          { name: t('new') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      /> */}

      <TableNewEditForm departmentData={departmentData} />
    </Container>
  );
}
TableCreateView.propTypes = {
  departmentData: PropTypes.object,
};
