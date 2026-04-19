import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetOneFavoriteMedicalAnalysis } from 'src/api/doctor_favorite';

// import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './analysis-create-edit-one'; /// edit

// ----------------------------------------------------------------------

export default function TableEditView() {
const { t } = useTranslate();
  const params = useParams();
  const { id } = params;
  const { favorite } = useGetOneFavoriteMedicalAnalysis(id);
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t("Update medical analysis")}
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          {
            name: t('medical analysis'),
            href: paths.employee.medicalServices.medicalAnalysis.root,
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
