import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import {useGetOneFavoriteRadiology } from 'src/api/doctorFavorite';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './radiology-create-edit-one'; /// edit

// ----------------------------------------------------------------------

export default function TableEditView() {
const { t } = useTranslate();
  const params = useParams();
  const { id } = params;
  const { favorite } = useGetOneFavoriteRadiology(id);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t("update radiology")}
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          {
            name: t('radiology'),
            href: paths.employee.medicalServices.radiology.root,
          },
          { name: t('update favorite') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
        {favorite && <TableNewEditForm currentFavorite={favorite} />}
    </Container>
  );
}
