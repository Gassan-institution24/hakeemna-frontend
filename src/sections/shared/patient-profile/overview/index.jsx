import { useMemo } from 'react';
import PropTypes from 'prop-types';

import { Box } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import {
  useGetPrescription,
  useGetUSPatientDiagnosis,
  useGetUSPatientAppointments,
  useGetPatientHistoryDataForUs,
} from 'src/api';

import VitalsCard from './vitals-card';
import ContactCard from './contact-card';
import InsuranceCard from './insurance-card';
import DiagnosesCard from './diagnoses-card';
import ClinicalAlerts from './clinical-alerts';
import MedicationsCard from './medications-card';
import AppointmentCard from './appointment-card';
import RecentVisitsCard from './recent-visits-card';
import VisitSummaryCard from './visit-summary-card';
import MedicalBackgroundCard from './medical-background-card';

// ----------------------------------------------------------------------

// Everything a doctor should be able to read without clicking.
//
// Every card here is driven by a field that really exists on the record. A card
// with nothing to say removes itself rather than showing a placeholder -- an
// empty section is honest, an invented one is not. There is deliberately no
// "no known allergies" reassurance: this system stores no negative findings, so
// absence of data cannot be reported as absence of risk.
export default function PatientOverview({ patient, uspId, onNavigate }) {
  const { user } = useAuthContext();

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const { usPatientDiagnosis } = useGetUSPatientDiagnosis(uspId);
  const { historyDataForPatient } = useGetPatientHistoryDataForUs(uspId);
  const { appointmentsData } = useGetUSPatientAppointments(
    unitServiceId,
    patient?.patient?._id,
    uspId
  );
  const { prescriptionData } = useGetPrescription({
    unit_service: unitServiceId,
    patient: patient?.patient?._id,
    unit_service_patient: uspId,
    populate: { path: 'medicines', populate: 'medicines' },
  });

  // The endpoint neither filters nor sorts, so do both here.
  const diagnoses = useMemo(() => {
    const rows = Array.isArray(usPatientDiagnosis) ? usPatientDiagnosis : [];
    return rows
      .filter((one) => one?.active !== false && one?.status !== 'resolved')
      .sort((a, b) => new Date(b?.created_at || 0) - new Date(a?.created_at || 0));
  }, [usPatientDiagnosis]);

  const history = useMemo(() => {
    const rows = historyDataForPatient?.data?.history;
    return Array.isArray(rows) ? rows : [];
  }, [historyDataForPatient]);

  const summary = historyDataForPatient?.data?.summary;

  return (
    <Box>
      <ClinicalAlerts diagnoses={diagnoses} />

      {/* A CSS column flow rather than a grid of fixed columns. Cards remove
          themselves when they have nothing to show, and how many do that varies
          per patient -- in a grid the empty slots would stay behind as holes,
          whereas here the survivors simply reflow and fill from the start. */}
      <Box
        sx={{
          columnCount: { xs: 1, md: 2, lg: 3 },
          columnGap: 2,
          '& > *': { breakInside: 'avoid', mb: 2 },
        }}
      >
        <VisitSummaryCard summary={summary} history={history} onNavigate={onNavigate} />
        <MedicalBackgroundCard patient={patient} />
        <DiagnosesCard diagnoses={diagnoses} />
        <AppointmentCard appointments={appointmentsData} onNavigate={onNavigate} />
        <MedicationsCard prescriptions={prescriptionData} onNavigate={onNavigate} />
        <RecentVisitsCard history={history} onNavigate={onNavigate} />
        <VitalsCard patient={patient} />
        <InsuranceCard patient={patient} />
        <ContactCard patient={patient} />
      </Box>
    </Box>
  );
}

PatientOverview.propTypes = {
  patient: PropTypes.object,
  uspId: PropTypes.string,
  onNavigate: PropTypes.func,
};
