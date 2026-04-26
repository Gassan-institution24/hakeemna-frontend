import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';
import { useGetOneFavoriteDiagnosis } from 'src/api/doctor_favorite';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DiagnosisNewEditForm from './diagnosis-create-edit-one';

export default function DiagnosisEditView() {
  const { t } = useTranslate();
  const { id } = useParams();
  const { favorite } = useGetOneFavoriteDiagnosis(id);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('Update Favorite Diagnosis')}
        links={[
          { name: t('dashboard'), href: paths.superadmin.root },
          { name: t('Favorite Diagnosis'), href: paths.employee.medicalServices.diagnosis.root },
          { name: t('update favorite') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      {favorite && <DiagnosisNewEditForm currentFavorite={favorite} />}
    </Container>
  );
}
