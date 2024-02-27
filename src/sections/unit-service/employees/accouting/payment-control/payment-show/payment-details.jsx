import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

import InvoiceToolbar from './payment-toolbar';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textalign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------
const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
];

export default function InvoiceDetails({ paymentData }) {

  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell lang="ar" colSpan={4} />
        <TableCell lang="ar" sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell lang="ar" width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(paymentData.amount)}
        </TableCell>
      </StyledTableRow>

      {/* <StyledTableRow>
        <TableCell lang="ar" colSpan={3} />
        <TableCell lang="ar" sx={{ color: 'text.secondary' }}>Tax</TableCell>
        <TableCell lang="ar" width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {fCurrency(-paymentData.Total_tax_Amount)}
        </TableCell>
      </StyledTableRow> */}

      <StyledTableRow>
        <TableCell lang="ar" colSpan={4} />
        <TableCell lang="ar" sx={{ color: 'text.secondary' }}>
          Deduction
        </TableCell>
        <TableCell lang="ar" width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {fCurrency(-paymentData.deduction_amount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell lang="ar" colSpan={4} />
        <TableCell lang="ar" sx={{ color: 'text.secondary' }}>
          Taxes
        </TableCell>
        <TableCell lang="ar" width={120}>
          {fCurrency(paymentData.sales_tax_amount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell lang="ar" colSpan={4} />
        <TableCell lang="ar" sx={{ typography: 'subtitle1' }}>
          Total
        </TableCell>
        <TableCell lang="ar" width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(paymentData.total_amount)}
        </TableCell>
      </StyledTableRow>
    </>
  );

  const renderFooter = (
    <Grid container>
      <Grid xs={12} md={9} sx={{ py: 3 }}>
        <Typography variant="subtitle2">NOTES</Typography>

        <Typography variant="body2">
          Thank you for dealing with us, If you have any concern feel free to contact with us
        </Typography>
      </Grid>

      <Grid xs={12} md={3} sx={{ py: 3, textalign: 'right' }}>
        <Typography variant="subtitle2">Have a Question?</Typography>

        <Typography variant="body2">support@doctorna.online</Typography>
      </Grid>
    </Grid>
  );

  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table sx={{ minWidth: 960 }}>
          <TableHead>
            <TableRow>
              <TableCell lang="ar" width={40}>
                #
              </TableCell>

              <TableCell lang="ar" sx={{ typography: 'subtitle2' }}>
                Received Amount
              </TableCell>

              <TableCell lang="ar" align="center">
                Invoice no
              </TableCell>

              <TableCell lang="ar" align="right">
                Invoice Amount
              </TableCell>

              <TableCell lang="ar" align="right">
                Total Received Amount
              </TableCell>

              <TableCell lang="ar" align="right">
                Remained Amount
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell lang="ar" align="center">
                {paymentData.code}
              </TableCell>

              <TableCell lang="ar" align="center">
                <Box sx={{ maxWidth: 560 }}>
                  <Typography variant="subtitle2">{fCurrency(paymentData?.amount)}</Typography>

                  {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.description}
                    </Typography> */}
                </Box>
              </TableCell>

              <TableCell lang="ar" align="center">
                {paymentData.invoice?.code}
              </TableCell>

              <TableCell lang="ar" align="right">
                {fCurrency(paymentData.invoice?.Balance)}
              </TableCell>

              <TableCell lang="ar" align="right">
                {fCurrency(paymentData.invoice?.Balance)}
              </TableCell>

              <TableCell lang="ar" align="right">
                {fCurrency(20)}
              </TableCell>
            </TableRow>

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      <InvoiceToolbar paymentData={paymentData} statusOptions={STATUS_OPTIONS} />

      <Card sx={{ pt: 5, px: 5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/logo_single.svg"
            sx={{ width: 48, height: 48 }}
          />

          <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Label
              lang="ar"
              variant="soft"
              color={
                (paymentData.status === 'paid' && 'success') ||
                (paymentData.status === 'pending' && 'warning') ||
                // (paymentData.status === 'overdue' && 'error') ||
                'default'
              }
            >
              {paymentData.status}
            </Label>

            <Typography variant="h6">{paymentData.code}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              From
            </Typography>
            {paymentData?.patient?.first_name} {paymentData?.patient?.family_name}
            <br />
            {paymentData?.patient?.country} {paymentData?.patient?.city}
            <br />
            Phone: {paymentData?.patient?.mobile_num1}
            <br />
            Email: {paymentData?.patient?.email}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              To
            </Typography>
            {paymentData?.unit_service?.name_english}
            <br />
            {paymentData?.unit_service?.country} {paymentData?.unit_service?.city}
            <br />
            Phone: {paymentData?.unit_service?.phone}
            <br />
            Email: {paymentData?.unit_service?.email}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date Create
            </Typography>
            {fDate(paymentData.created_at)}
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Due Date
            </Typography>
            {fDate(paymentData.due_date)}
          </Stack>
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>
    </>
  );
}

InvoiceDetails.propTypes = {
  paymentData: PropTypes.object,
};
