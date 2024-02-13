import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { useLocales, useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableEditView({ WorkGroupData, departmentData }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <CustomBreadcrumbs
        heading={t('Edit work group')}
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
            name: `${
              curLangAr
                ? departmentData.name_arabic
                : departmentData.name_english || t('department')
            } ${t('work groups')}`,
            href: paths.unitservice.departments.workGroups.root(departmentData._id),
          },
          { name: t('edit') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      /> */}
      {WorkGroupData && departmentData && (
        <TableNewEditForm departmentData={departmentData} currentTable={WorkGroupData} />
      )}
    </Container>
  );
}
TableEditView.propTypes = {
  departmentData: PropTypes.object,
  WorkGroupData: PropTypes.object,
};
