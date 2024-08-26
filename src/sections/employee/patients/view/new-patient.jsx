import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableManyNewForm from '../new-patient/add-many-patients';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const { t } = useTranslate();

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('add new patients')} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          {
            name: t('patients'),
            href: paths.superadmin.tables.list,
          },
          { name: t('new') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <TableManyNewForm />
    </Container>
  );
}
