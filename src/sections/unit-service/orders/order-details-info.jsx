import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function OrderDetailsInfo({ customer, note, payment, shippingAddress }) {

  return (
    <Card>
      <>
        <CardHeader
          title="stakeholder"
        />
        <Stack direction="row" sx={{ p: 3 }}>
          <Avatar
            alt={customer?.name_english}
            src={customer?.company_logo}
            sx={{ width: 48, height: 48, mr: 2 }}
          />

          <Stack spacing={0.5} alignItems="flex-start" sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2">{customer?.name_english}</Typography>

            <Box sx={{ color: 'text.secondary' }}>{customer?.email}</Box>
            <Box sx={{ color: 'text.secondary' }}>{customer?.phone}</Box>
            {note && <Typography variant="subtitle2" sx={{ mt: 2 }}>note:</Typography>}
            <Box sx={{ color: 'text.secondary' }}>{note}</Box>
          </Stack>
        </Stack>
      </>
    </Card>
  );
}

OrderDetailsInfo.propTypes = {
  customer: PropTypes.object,
  note: PropTypes.string,
  payment: PropTypes.object,
  shippingAddress: PropTypes.object,
};
