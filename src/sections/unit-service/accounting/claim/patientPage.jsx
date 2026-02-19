import { useSnackbar } from 'notistack';
import { useParams } from 'react-router-dom';
import { useRef, useMemo, useState, useEffect } from 'react';

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
import {
  submitClaim,
  setDownloaded,
  viewAuthorizations,
  getNewAuthorizations,
} from 'src/services/claimService';

import Iconify from 'src/components/iconify';
import AddNotes from 'src/components/clim/AddNotes';
import AddDiagnosis from 'src/components/clim/AddDiagnosis';
import RadiologyOrders from 'src/components/clim/RadiologyOrders';
import LaboratoryOrders from 'src/components/clim/LaboratoryOrders';
import MedicationsOrders from 'src/components/clim/MedicationsOrders';
import ClinicERProcedures from 'src/components/clim/ClinicERProcedures';
import PhysiotherapyOrders from 'src/components/clim/PhysiotherapyOrders';

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
  const [visitData, setVisitData] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async () => {
    try {
      await submitClaim();

      // navigate(paths.unitservice.accounting.claim.patientVisitView(visitId));

      enqueueSnackbar('Claim submitted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to submit claim', { variant: 'error' });
    }
  };

  const pollingRef = useRef(null);
  const retryRef = useRef(0);
  const { visitId } = useParams();

  /* ================= Authorization Polling ================= */

  useEffect(() => {
    if (!visitId) {
      return undefined;
    }

    const MAX_RETRY = 5;

    pollingRef.current = setInterval(async () => {
      try {
        retryRef.current += 1;

        const response = await viewAuthorizations();
        console.log(response.data.result);

        if (response?.data?.result === 'Yes') {
          setVisitData(true);

          setCheckingAuth(false);
          clearInterval(pollingRef.current);
        }

        if (retryRef.current >= MAX_RETRY) {
          clearInterval(pollingRef.current);
          setCheckingAuth(false);
        }
      } catch (error) {
        console.error(error);
      }
    }, 5000);

    return () => clearInterval(pollingRef.current);
  }, [visitId]);

  const authStatus = useMemo(() => {
    if (checkingAuth) {
      return {
        label: 'Checking elegiblity...',
        color: 'warning',
      };
    }

    if (visitData) {
      return {
        label: 'elegible',
        color: 'success',
      };
    }

    return {
      label: 'not elegible',
      color: 'error',
    };
  }, [checkingAuth, visitData]);

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
            <Typography>Patient No: 09070657978</Typography>

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

          <Grid item xs={12} md={3} textAlign="right">
            <Chip label={authStatus.label} color={authStatus.color} />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {/* <Button variant="outlined">{t('Patient Inquiry')}</Button> */}
          <Button
            variant="outlined"
            sx={{
              alignItems: 'center',
            }}
            onClick={() => {
              setDownloaded();
            }}
          >
            {t('Update Patient Data')}
          </Button>
          <Button
            variant="contained"
            sx={{
              alignItems: 'center',
            }}
            // onClick={() => {
            //   viewAuthorizations();
            // }}
          >
            {' '}
            <Iconify icon="solar:refresh-bold" sx={{ mr: 1 }} />
            {t('Recheck')}
          </Button>
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
              <AddDiagnosis
                onDataChange={(data) => {
                  updateSectionStatus('diagnosis', data.length > 0);
                }}
              />
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
        <Button variant="contained" color="success" onClick={() => handleSubmit()}>
          {t('Close and Submit Claim')}
        </Button>
      </Box>
    </Box>
  );
}
