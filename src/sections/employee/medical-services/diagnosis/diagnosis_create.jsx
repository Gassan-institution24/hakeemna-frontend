import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import DiagnosisNewEditForm from './diagnosis-create-edit-one';

export default function DiagnosisCreateView() {
  const { t } = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('New Favorite Diagnosis')}
        links={[
          { name: t('dashboard'), href: paths.superadmin.root },
          { name: t('Favorite Diagnosis'), href: paths.employee.medicalServices.diagnosis.root },
          { name: t('create favorite') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />
      <DiagnosisNewEditForm />
    </Container>
  );
}
