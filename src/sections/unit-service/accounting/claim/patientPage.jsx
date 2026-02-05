import { useEffect, useState } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation';
import {
  Box,
  Grid,
  Chip,
  Paper,
  Button,
  Divider,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import { useParams } from 'react-router-dom';

import AddNotes from 'src/components/clim/AddNotes';
import AddDiagnosis from 'src/components/clim/AddDiagnosis';
import RadiologyOrders from 'src/components/clim/RadiologyOrders';
import LaboratoryOrders from 'src/components/clim/LaboratoryOrders';
import MedicationsOrders from 'src/components/clim/MedicationsOrders';
import ClinicERProcedures from 'src/components/clim/ClinicERProcedures';
import PhysiotherapyOrders from 'src/components/clim/PhysiotherapyOrders';
import {
  createEncounter,
  getNewAuthorizations,
} from 'src/services/claimService';

/* ================= STATIC DATA ================= */
const sections = [
  'Add Diagnosis',
  'Clinic / ER Procedures',
  'Laboratory Orders',
  'Radiology Orders',
  'Medications Orders',
  'Physiotherapy',
  'Add Note / Attach Files',
];
const indexToKey = {
  0: 'diagnosis',
  1: 'procedures',
  2: 'lab',
  3: 'radiology',
  4: 'medications',
  5: 'physiotherapy',
  6: 'notes',
};

export default function PatientPage() {
  const { t } = useTranslate();
  const [visitData, setVisitData] = useState(null);

  const { visitId } = useParams();

  useEffect(() => {
    if (!visitId) return;

    const startEncounter = async () => {
      try {
        const response = await createEncounter({
          visitId,
          encounterType: 1,
          providerId: 'PROV001',
        });

        setVisitData(response);
      } catch (error) {
        console.error(error);
      }
    };

    startEncounter();
  }, [visitId]);

  const [sectionStatus, setSectionStatus] = useState({
    diagnosis: false,
    procedures: false,
    lab: false,
    radiology: false,
    medications: false,
    physiotherapy: false,
    notes: false,
  });
  const updateSectionStatus = (key, hasData) => {
    setSectionStatus((prev) => ({
      ...prev,
      [key]: hasData,
    }));
  };
  const claimPayload = {
    patient: {
      nationalId: '4000026255',
      memberId: '0000',
    },

    diagnosis: [
      {
        type: 'Principal',
        code: 'V67.09',
      },
    ],

    activities: [
      {
        type: '8',
        code: 'JOR-99-05-006',
        quantity: 1,
        net: 413.1,
        gross: 413.11,
        observations: [
          {
            type: 'Text',
            code: 'Activity-Description',
            value: 'GENERAL PROCEDURE',
            valueType: 'String',
          },
        ],
      },
    ],

    totals: {
      gross: 413.11,
      net: 413.1,
      patientShare: 0,
    },
  };
  const handleSubmitClaim = async () => {
    try {
      await getNewAuthorizations({
        claimPayload,
      });

      alert('Claim submitted successfully');
    } catch (error) {
      alert('Failed to submit claim');
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#f4f6f8', minHeight: '100vh' }}>
      {/* ================= HEADER ================= */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Typography fontWeight="bold" fontSize={18}>
              {t('Hakeemna Patient')}
            </Typography>

            <Typography color="text.secondary">
              {t('Age Gender', { age: 24, gender: t('Male') })}
            </Typography>
            <Typography>Patient No: {visitData?.patientId}</Typography>

            <Typography color="text.secondary">{t('Phone Number')}: 0791234567</Typography>
          </Grid>

          <Grid item xs={12} md={3}>
            <Typography fontSize={14}>
              {t('Member Card')}: <b>003256</b>
            </Typography>
            <Typography fontSize={14}>
              {t('Deductible')}: <b>10.00 JOD</b>
            </Typography>
          </Grid>

          <Grid item xs={12} md={3} gap={2} textAlign="right">
            <Chip
              label={visitData?.encounter?.eligibility?.status || 'Checking...'}
              color={visitData?.encounter?.eligibilityStatus === 'ELIGIBLE' ? 'success' : 'warning'}
            />

            <Chip label={t('Pending')} color="warning" />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="outlined">{t('Patient Inquiry')}</Button>
          <Button variant="outlined">{t('Update Patient Data')}</Button>
          <Button variant="contained">{t('Recheck')}</Button>
        </Box>
      </Paper>

      {/* ================= SECTIONS ================= */}
      {sections.map((section, index) => (
        <Accordion key={section} sx={{ mb: 1, borderRadius: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <MedicalInformationIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography fontWeight="bold" sx={{ flexGrow: 1 }}>
              {t(section)}
            </Typography>

            {sectionStatus[indexToKey[index]] && <CheckCircleIcon sx={{ color: 'success.main' }} />}
          </AccordionSummary>

          <AccordionDetails>
            {index === 0 && (
              <AddDiagnosis onDataChange={(hasData) => updateSectionStatus('diagnosis', hasData)} />
            )}

            {index === 1 && (
              <ClinicERProcedures
                onDataChange={(hasData) => updateSectionStatus('procedures', hasData)}
              />
            )}
            {index === 2 && (
              <LaboratoryOrders onDataChange={(hasData) => updateSectionStatus('lab', hasData)} />
            )}
            {index === 3 && (
              <RadiologyOrders
                onDataChange={(hasData) => updateSectionStatus('radiology', hasData)}
              />
            )}

            {index === 4 && (
              <MedicationsOrders
                onDataChange={(hasData) => updateSectionStatus('medications', hasData)}
              />
            )}

            {index === 5 && (
              <PhysiotherapyOrders
                onDataChange={(hasData) => updateSectionStatus('physiotherapy', hasData)}
              />
            )}
            {index === 6 && (
              <AddNotes onDataChange={(hasData) => updateSectionStatus('notes', hasData)} />
            )}
          </AccordionDetails>
        </Accordion>
      ))}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Button variant="text" color="error">
          {t('Cancel Visit')}
        </Button>

        <Button variant="contained" color="primary">
          {t('Send Orders')}
        </Button>
        <Button variant="contained" color="success" onClick={handleSubmitClaim}>
          {t('Close and Submit Claim')}
        </Button>
      </Box>
    </Box>
  );
}
