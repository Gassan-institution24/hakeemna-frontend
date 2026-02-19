// MedicalAnalysisCreateView.jsx

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import MedicalAnalysisNewEditForm from './analysis-create-edit-one';

export default function MedicalAnalysisCreateView() {
    const {t} = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t("new medical analysis")}
        links={[
          { name: t('dashboard'), href: paths.superadmin.root },
          {
            name: t('medical analysis'),
            href: paths.employee.medicalServices.medicalAnalysis.root,
          },
          { name: t('create favorite') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <MedicalAnalysisNewEditForm />
    </Container>
  );
}
