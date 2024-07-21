
import Container from '@mui/material/Container';

import { useParams } from 'src/routes/hooks';

import { useGetEconomicMovement } from 'src/api';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceNewEditForm from '../new-edit-form';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const { data } = useGetEconomicMovement(id)

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={data?.sequence_number}
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

      {data && <InvoiceNewEditForm currentInvoice={data} />}
    </Container>
  );
}