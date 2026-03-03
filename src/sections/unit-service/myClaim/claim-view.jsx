import { useState } from 'react';
import {
  Stack,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Grid,
  IconButton,
  TextField,
  MenuItem,
  useMediaQuery,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';

const mockClaims = [
  {
    id: 'CLM-1001',
    company: 'MedCare Insurance',
    amount: 420,
    date: '2026-03-01',
    status: 'sent',
  },
  {
    id: 'CLM-1002',
    company: 'Health Shield',
    amount: 300,
    date: '2026-03-02',
    status: 'pending',
  },
];

export default function ClaimsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [statusFilter, setStatusFilter] = useState('all');

  const filteredClaims =
    statusFilter === 'all'
      ? mockClaims
      : mockClaims.filter((c) => c.status === statusFilter);

  const renderStatusChip = (status) => 
     status === 'sent' ? (
      <Chip label="Sent" color="success" size="small" />
    ) : (
      <Chip label="Pending" color="warning" size="small" />
    );
  

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 4 }}
      >
        <Typography variant="h4">Financial Claims</Typography>

        <Stack direction="row" spacing={2}>
          <TextField
            select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="sent">Sent</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
          </TextField>

          <Button
            variant="contained"
            startIcon={<Iconify icon="mdi:plus" />}
          >
            Create Claim
          </Button>
        </Stack>
      </Stack>

      {/* Desktop Table */}
      {!isMobile ? (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Claim ID</TableCell>
                <TableCell>Insurance Company</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredClaims.map((claim) => (
                <TableRow key={claim.id} hover>
                  <TableCell>{claim.id}</TableCell>
                  <TableCell>{claim.company}</TableCell>
                  <TableCell>${claim.amount}</TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell>
                    {renderStatusChip(claim.status)}
                  </TableCell>
                  <TableCell align="right">
                    {claim.status === 'pending' && (
                      <Button
                        size="small"
                        variant="contained"
                        color="primary"
                      >
                        Send
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        /* Mobile Cards */
        <Grid container spacing={2}>
          {filteredClaims.map((claim) => (
            <Grid item xs={12} key={claim.id}>
              <Card>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography fontWeight="bold">
                        {claim.id}
                      </Typography>
                      {renderStatusChip(claim.status)}
                    </Stack>

                    <Typography variant="body2">
                      {claim.company}
                    </Typography>

                    <Typography variant="body2">
                      Amount: ${claim.amount}
                    </Typography>

                    <Typography variant="caption" color="text.secondary">
                      {claim.date}
                    </Typography>

                    {claim.status === 'pending' && (
                      <Button
                        fullWidth
                        variant="contained"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        Send Claim
                      </Button>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
