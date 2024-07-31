import Container from '@mui/material/Container';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceNewEditForm from '../new-edit-form';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView() {
  const settings = useSettingsContext();

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        // heading={data?.sequence_number}
        // links={[
        // {
        //   name: 'Dashboard',
        //   href: paths.dashboard.root,
        // },
        // {
        //   name: 'Invoice',
        //   href: paths.dashboard.invoice.root,
        // },
        // { name: data?.invoiceNumber },
        // ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <InvoiceNewEditForm />
    </Container>
  );
}
