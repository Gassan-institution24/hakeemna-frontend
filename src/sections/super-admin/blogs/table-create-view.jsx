import Container from '@mui/material/Container';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import TableNewEditForm from './table-new-edit-form';

// ----------------------------------------------------------------------

export default function TableCreateView() {
  const { t } = useTranslate();
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading={t('create blog')}
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          {
            name: t('blogs'),
            href: paths.superadmin.blogs.root,
          },
          { name: t('create') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <TableNewEditForm />
    </Container>
  );
}
