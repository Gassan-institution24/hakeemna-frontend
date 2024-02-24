import PropTypes from 'prop-types';

import Container from '@mui/material/Container';

import { useLocales, useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView({ departmentData }) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {/* <CustomBreadcrumbs
        heading={t('Create new room')}
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.unitservices.root,
          },
          {
            name: t('departments'),
            href: paths.superadmin.unitservices.departments.root(id),
          },
          {
            name: `${
              curLangAr
                ? departmentData.name_arabic
                : departmentData.name_english || t('Department')
            } ${t('rooms')}`,
            href: paths.superadmin.unitservices.departments.rooms.root(departmentData._id),
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
