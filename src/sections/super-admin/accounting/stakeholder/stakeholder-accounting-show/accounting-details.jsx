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

import InvoiceToolbar from './accounting-toolbar';

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
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

export default function InvoiceDetails({ economicMovementData }) {
  const renderTotal = (
    <>
      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>
          <Box sx={{ mt: 2 }} />
          Subtotal
        </TableCell>
        <TableCell width={120} sx={{ typography: 'subtitle2' }}>
          <Box sx={{ mt: 2 }} />
          {fCurrency(economicMovementData.Total_Amount)}
        </TableCell>
      </StyledTableRow>

      {/* <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Tax</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {fCurrency(-economicMovementData.Total_tax_Amount)}
        </TableCell>
      </StyledTableRow> */}

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Deduction</TableCell>
        <TableCell width={120} sx={{ color: 'error.main', typography: 'body2' }}>
          {fCurrency(-economicMovementData.Total_deduction_amount)}
        </TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ color: 'text.secondary' }}>Taxes</TableCell>
        <TableCell width={120}>{fCurrency(economicMovementData.Total_tax_Amount)}</TableCell>
      </StyledTableRow>

      <StyledTableRow>
        <TableCell colSpan={3} />
        <TableCell sx={{ typography: 'subtitle1' }}>Total</TableCell>
        <TableCell width={140} sx={{ typography: 'subtitle1' }}>
          {fCurrency(economicMovementData.Balance)}
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

      <Grid xs={12} md={3} sx={{ py: 3, textAlign: 'right' }}>
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
              <TableCell width={40}>#</TableCell>

              <TableCell sx={{ typography: 'subtitle2' }}>Description</TableCell>

              <TableCell align="center">Qty</TableCell>

              <TableCell align="right">Unit price</TableCell>

              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {economicMovementData.Provided_services?.map((row, index, idx) => (
              <TableRow key={idx}>
                <TableCell align="center">{row.index + 1}</TableCell>

                <TableCell align="center">
                  <Box sx={{ maxWidth: 560 }}>
                    <Typography variant="subtitle2">{row?.name_english}</Typography>

                    {/* <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
                      {row.description}
                    </Typography> */}
                  </Box>
                </TableCell>

                <TableCell align="center">{row.service_quantity}</TableCell>

                <TableCell align="right">{fCurrency(row.total_amount)}</TableCell>

                <TableCell align="right">{fCurrency(row.accumulated_amount)}</TableCell>
              </TableRow>
            ))}

            {renderTotal}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );

  return (
    <>
      <InvoiceToolbar invoice={economicMovementData} statusOptions={STATUS_OPTIONS} />

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
              variant="soft"
              color={
                (economicMovementData.status === 'paid' && 'success') ||
                (economicMovementData.status === 'pending' && 'warning') ||
                // (economicMovementData.status === 'overdue' && 'error') ||
                'default'
              }
            >
              {economicMovementData.status}
            </Label>

            <Typography variant="h6">{economicMovementData.code}</Typography>
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              From
            </Typography>
            {economicMovementData?.patient?.first_name} {economicMovementData?.patient?.last_name}
            <br />
            {economicMovementData?.patient?.country} {economicMovementData?.patient?.city}
            <br />
            Phone: {economicMovementData?.patient?.mobile_num1}
            <br />
            Email: {economicMovementData?.patient?.email}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Invoice To
            </Typography>
            {economicMovementData?.unit_service?.name_english}
            <br />
            {economicMovementData?.unit_service?.country} {economicMovementData?.unit_service?.city}
            <br />
            Phone: {economicMovementData?.unit_service?.phone}
            <br />
            Email: {economicMovementData?.unit_service?.email}
            <br />
          </Stack>

          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Date Create
            </Typography>
            {fDate(economicMovementData.created_at)}
          </Stack>
          {/* 
          <Stack sx={{ typography: 'body2' }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Due Date
            </Typography>
            {fDate(economicMovementData.dueDate)}
          </Stack> */}
        </Box>

        {renderList}

        <Divider sx={{ mt: 5, borderStyle: 'dashed' }} />

        {renderFooter}
      </Card>
    </>
  );
}

InvoiceDetails.propTypes = {
  economicMovementData: PropTypes.object,
};
