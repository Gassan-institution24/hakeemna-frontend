import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import { Typography, Paper, Grid, Box, Chip } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import NoteIcon from '@mui/icons-material/Note';
import { fDate, fHourMin } from 'src/utils/format-time';

export default function YearlyReportDetailsModal({ open, onClose, report }) {
  if (!report) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <PersonIcon color="primary" sx={{ mr: 1 }} /> Yearly Report Details
      </DialogTitle>
      <DialogContent dividers>
        <Paper elevation={0} sx={{ p: 2, background: 'background.paper', borderRadius: 2 }}>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PersonIcon color="primary" />
              {report.employee_engagement?.employee?.name_english} / {report.employee_engagement?.employee?.name_arabic}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarMonthIcon color="action" />
                  <Typography variant="body2"><b>Start Date:</b> {fDate(report.start_date)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <CalendarMonthIcon color="action" />
                  <Typography variant="body2"><b>End Date:</b> {fDate(report.end_date)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon color="action" />
                  <Typography variant="body2"><b>Working Time:</b> {fHourMin(report.working_time)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <AccessTimeIcon color="action" />
                  <Typography variant="body2"><b>Calculated Time:</b> {fHourMin(report.calculated_time)}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Annual:</Typography>
                  <Typography variant="body2">{report.annual}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Annual Eq.:</Typography>
                  {fHourMin(report.annual_equivalent)}
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Sick:</Typography>
                  <Typography variant="body2">{report.sick}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Sick Eq.:</Typography>
                  {fHourMin(report.sick_equivalent)}
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Unpaid:</Typography>
                  <Typography variant="body2">{report.unpaid}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Unpaid Eq.:</Typography>
                  {fHourMin(report.unpaid_equivalent)}
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Public:</Typography>
                  <Typography variant="body2">{report.public}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Public Eq.:</Typography>
                  {fHourMin(report.public_equivalent)}
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Other:</Typography>
                  <Typography variant="body2">{report.other}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="body2" color="secondary.main" fontWeight={600}>Other Eq.:</Typography>
                  {fHourMin(report.other_equivalent)}
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <PaidIcon color="success" />
                  <Typography variant="body2"><b>Salary:</b> {report.salary}</Typography>
                </Box>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2"><b>Social Security:</b> {report.social_security}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2"><b>Tax:</b> {report.tax}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2"><b>Deduction:</b> {report.deduction}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2"><b>Days:</b> {report.days}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body2"><b>Total:</b> {report.total}</Typography>
              </Grid>
            </Grid>
            {report.note && (
              <Box display="flex" alignItems="center" gap={1} mt={2}>
                <NoteIcon color="action" />
                <Typography variant="body2"><b>Note:</b> {report.note}</Typography>
              </Box>
            )}
          </Stack>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="primary" size="large" sx={{ minWidth: 120 }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}

YearlyReportDetailsModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  report: PropTypes.object,
}; 