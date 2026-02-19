import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import {  useGetOneFavoriteMedication } from 'src/api/doctorFavorite';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './medication-create-edit-one'; /// edit

// ----------------------------------------------------------------------

export default function TableEditView() {
const { t } = useTranslate();
  const params = useParams();
  const { id } = params;
  const { favorite } = useGetOneFavoriteMedication(id);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t("update medicines")}
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          {
            name: t('medicines'),
            href: paths.employee.medicalServices.medication.root,
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
