// MedicalAnalysisCreateView.jsx

import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import RadiologyNewEditForm from './radiology-create-edit-one';

export default function RadiologyCreateView() {
    const {t} = useTranslate();
  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t("new radiology")}
        links={[
          { name: t('dashboard'), href: paths.superadmin.root },
          {
            name: t('radiology'),
            href: paths.employee.medicalServices.radiology.root,
          },
          { name: t('create favorite') },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <RadiologyNewEditForm />
    </Container>
  );
}
