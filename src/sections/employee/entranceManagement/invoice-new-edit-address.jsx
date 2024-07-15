import { useFormContext } from 'react-hook-form';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useAuthContext } from 'src/auth/hooks';
import { RHFSelect } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function InvoiceNewEditAddress() {
  const {
    watch,
    // setValue,
    // formState: { errors },
  } = useFormContext();

  const { user } = useAuthContext();
  const myUS =
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?.unit_service;

  const values = watch();

  const { invoiceFrom, invoiceTo } = values;

  return (
    <Stack
      spacing={{ xs: 3, md: 5 }}
      sx={{ p: 3 }}
    >
      <Stack sx={{ width: 1 }}>
        <Stack spacing={1}>
          <Typography variant="h4">{invoiceFrom?.name || myUS.name_english}</Typography>
          <Typography variant="body2">{invoiceFrom?.fullAddress || myUS.address || `${myUS.city.name_english}, ${myUS.country.name_english}`}</Typography>
          <Typography variant="body2"> {invoiceFrom?.phoneNumber || myUS.phone}</Typography>
        </Stack>
      </Stack>

      <Stack sx={{ width: 1 }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
            To:
          </Typography>
        </Stack>
        {invoiceTo ? <Stack spacing={1}>
          <Typography variant="subtitle2">{invoiceTo?.name_english}</Typography>
          <Typography variant="body2">{invoiceTo?.address}</Typography>
          <Typography variant="body2"> {invoiceTo?.phone}</Typography>
        </Stack> : <Stack direction='row' justifyContent='flex-start'>
          {/* <RHFSelect name='invoiceTo'>
            { }
          </RHFSelect> */}
        </Stack>}
      </Stack>
    </Stack>
  );
}
