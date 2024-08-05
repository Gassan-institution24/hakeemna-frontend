import Container from '@mui/material/Container';

import { useParams } from 'src/routes/hooks';

import { useGetReciepts } from 'src/api';

import { useSettingsContext } from 'src/components/settings';

import InvoiceDetails from '../invoice-details';

// ----------------------------------------------------------------------

export default function InvoiceDetailsView() {
  const settings = useSettingsContext();
  const { id } = useParams();
  const { receiptsData, refetch } = useGetReciepts({
    _id: id,
    populate: [
      { path: 'unit_service', select: 'name_english name_arabic address phone' },
      { path: 'stakeholder', select: 'name_english name_arabic address phone' },
      { path: 'patient', select: 'name_english name_arabic address mobile_num1' },
      { path: 'economic_movement', select: 'sequence_number Total_Amount' },
    ],
  });

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      {receiptsData?.[0] && <InvoiceDetails invoice={receiptsData[0]} refetch={refetch} />}
    </Container>
  );
}
