// MedicalAnalysisCreateView.jsx

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import MedicationNewEditForm from './medication-create-edit-one';

export default function MedicationCreateView() {
    const {t} = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t("new medicines")}
        links={[
          { name: t('dashboard'), href: paths.superadmin.root },
          {
            name: t('medicines'),
            href: paths.employee.medicalServices.medication.root,
          },
          { name: t('create favorite') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MedicationNewEditForm />
    </Container>
  );
}
