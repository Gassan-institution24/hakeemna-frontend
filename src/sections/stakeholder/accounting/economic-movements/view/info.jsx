import Container from '@mui/material/Container';

import { useParams } from 'src/routes/hooks';

import { useGetEconomicMovement } from 'src/api';

import { useSettingsContext } from 'src/components/settings';

import InvoiceDetails from '../invoice-details';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const { data, refetch } = useGetEconomicMovement(id);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {data && <InvoiceDetails invoice={data} refetch={refetch} />}
    </Container>
  );
}
