import Container from '@mui/material/Container';

import { useParams } from 'src/routes/hooks';

import { useGetEconomicMovement } from 'src/api';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import InvoiceDetails from '../invoice-details';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const { data, refetch } = useGetEconomicMovement(id);

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

      {data && <InvoiceDetails invoice={data} refetch={refetch} />}
    </Container>
  );
}
