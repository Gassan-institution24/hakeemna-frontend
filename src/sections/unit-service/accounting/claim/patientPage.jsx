import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';

/* ================= ضيف رقم تلفون للمريض واحذف الكومنت هاض بس تخلص (يزن)  ================= */

export default function PatientPage() {
  return (
    <Box sx={{ p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      {/* ================= HEADER ================= */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={18}>
              Hakeemna Patient
            </Typography>
            <Typography color="text.secondary">24 Years • Male</Typography>
            <Typography color="text.secondary">Patient No: 4000006200</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography fontSize={14}>
              Member Card: <b>003256</b>
            </Typography>
            <Typography fontSize={14}>
              Deductible: <b>10.00 JOD</b>
            </Typography>
          </Grid>

          <Grid item xs={12} md={3} textAlign="right">
            <Chip label="Eligible" color="success" sx={{ mr: 1 }} />
            <Chip label="Pending" color="warning" />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined">Patient Inquiry</Button>
          <Button variant="outlined">Update Patient Data</Button>
          <Button variant="contained">Recheck</Button>
        </Box>
      </Paper>

      {/* ================= SECTIONS ================= */}
      {[
        'Add Diagnosis',
        'Clinic / ER Procedures',
        'Laboratory Orders',
        'Radiology Orders',
        'Medications Orders',
        'Physiotherapy',
        'Add Note / Attach Files',
      ].map((section) => (
        <Accordion key={section} sx={{ mb: 1, borderRadius: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MedicalInformationIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography fontWeight="bold">{section}</Typography>
          </AccordionSummary>

          <AccordionDetails>
            <Typography color="text.secondary">No data added yet.</Typography>

            <Button size="small" variant="contained" sx={{ mt: 2 }}>
              Add {section}
              {/* ================= راح نعمل كومبونانتس هون لكل واحد على حسب هضول
      
      'Add Diagnosis',
        'Clinic / ER Procedures',
        'Laboratory Orders',
        'Radiology Orders',
        'Medications Orders',
        'Physiotherapy',
        'Add Note / Attach Files',
        بتقدر تستخدم index تبع الماب عشان تحدد كل كومبونانتس وتعملها شرط
        احذف بعد ما تخلص (يزن)
      ================= */}
            </Button>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
