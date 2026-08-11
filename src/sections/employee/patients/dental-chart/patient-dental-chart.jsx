import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useSnackbar } from 'notistack';

import { Box, Alert, CircularProgress } from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import OdontogramView from './odontogram-view';
import {
  addNote,
  deleteNote,
  deleteXray,
  updateTooth,
  uploadXrays,
  addProcedure,
  saveSnapshot,
  createBridge,
  deleteBridge,
  bulkUpdateTeeth,
  deleteProcedure,
  switchChartType,
  useGetDentalChart,
  addChiefComplaint,
  setProcedurePayment,
  deleteChiefComplaint,
} from '../../../../api/dental_chart';

// ----------------------------------------------------------------------

export default function PatientDentalChart({ patient }) {
  const patientId = patient?.patient?._id || patient?._id;
  const { currentLang } = useLocales();
  const lang = currentLang?.value === 'ar' ? 'ar' : 'en';
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  const unitServiceId = user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id;

  const formatToothPayloadDescription = useCallback((payload) => {
    const segments = [];

    if (payload.whole_diagnosis) segments.push(`diagnosis ${payload.whole_diagnosis}`);
    if (payload.whole_condition) segments.push(`condition ${payload.whole_condition}`);
    if (payload.whole_status) segments.push(`status ${payload.whole_status}`);
    if (payload.treatment_plan) segments.push(`treatment plan "${payload.treatment_plan}"`);
    if (payload.notes) segments.push(`notes "${payload.notes}"`);
    if (payload.notes_arabic) segments.push(`notes AR "${payload.notes_arabic}"`);
    if (payload.mobility_grade !== undefined && payload.mobility_grade !== null)
      segments.push(`mobility grade ${payload.mobility_grade}`);

    const surfaceEntries = payload.surfaces ? Object.entries(payload.surfaces) : [];
    const surfaceChanges = surfaceEntries
      .filter(([, surface]) => surface?.condition || surface?.status)
      .map(([surface, values]) => {
        const parts = [];
        if (values.condition) parts.push(values.condition);
        if (values.status) parts.push(values.status);
        return `${surface}: ${parts.join(' / ')}`;
      });

    if (surfaceChanges.length) segments.push(`surfaces [${surfaceChanges.join(', ')}]`);

    return segments.length > 0 ? segments.join('; ') : 'details changed';
  }, []);

  const formatBulkSaveDescription = useCallback((updates) => {
    const count = updates.length;
    const preview = updates
      .slice(0, 3)
      .map(
        (tooth) =>
          `tooth ${tooth.fdi_number}: ${formatToothPayloadDescription(tooth)}`
      )
      .join(' | ');

    return count > 3
      ? `Saved dental chart for ${count} teeth: ${preview} + ${count - 3} more.`
      : `Saved dental chart for ${count} teeth: ${preview}`;
  }, [formatToothPayloadDescription]);

  const createPatientFileRecord = useCallback(
    async (description) => {
      try {
        if (!patientId || !user?.employee?._id) return;

        await axiosInstance.post(endpoints.doctorreport.all, {
          patient: patient?.patient?._id,
          unit_service_patient: patient?._id,
          unit_service: unitServiceId,
          employee: user.employee._id,
          description,
          name: 'dental chart log',
          source: 'dental_chart',
          type: 'report',
        });

        enqueueSnackbar('dental chart activity saved to patient file', { variant: 'success' });
      } catch (error) {
        console.error('dental chart record error:', error);
        enqueueSnackbar('Failed to save dental chart record to patient file', { variant: 'error' });
      }
    },
    [patient, patientId, unitServiceId, user, enqueueSnackbar]
  );

  const { chartData, loading, error } = useGetDentalChart(patientId);

  // Auto-save: build bulk update payload from the full teethMap
  const handleSave = useCallback(
    async (teethMap) => {
      if (!patientId) return;
      const updates = Object.values(teethMap).map((tooth) => ({
        fdi_number: tooth.fdi_number,
        whole_diagnosis: tooth.whole_diagnosis || null,
        whole_condition: tooth.whole_condition || null,
        whole_status: tooth.whole_status || null,
        surfaces: tooth.surfaces || {},
        notes: tooth.notes || '',
        notes_arabic: tooth.notes_arabic || '',
        treatment_plan: tooth.treatment_plan || '',
        mobility_grade: tooth.mobility_grade ?? null,
      }));
      if (updates.length > 0) {
        await bulkUpdateTeeth(patientId, updates);
        await createPatientFileRecord(formatBulkSaveDescription(updates));
      }
    },
    [patientId, createPatientFileRecord, formatBulkSaveDescription]
  );

  // Save a single tooth from the detail modal
  const handleSaveTooth = useCallback(
    async (fdiNumber, payload) => {
      if (!patientId) return;
      await updateTooth(patientId, fdiNumber, payload);
      await createPatientFileRecord(
        `Updated dental chart tooth ${fdiNumber}: ${formatToothPayloadDescription(payload)}.`
      );
    },
    [patientId, createPatientFileRecord, formatToothPayloadDescription]
  );

  const handleAddProcedure = useCallback(
    async (fdiNumber, payload) => {
      if (!patientId) return;
      await addProcedure(patientId, fdiNumber, payload);
      const description = payload.description || payload.description_arabic || 'Added procedure';
      const statusPart = payload.status ? `status ${payload.status}` : '';
      const costPart = payload.cost !== undefined && payload.cost !== null ? `cost ${payload.cost}` : '';
      const details = [description, statusPart, costPart].filter(Boolean).join(' | ');
      await createPatientFileRecord(
        `Added dental procedure to tooth ${fdiNumber}: ${details}.`
      );
    },
    [patientId, createPatientFileRecord]
  );

  const handleDeleteProcedure = useCallback(
    async (fdiNumber, procId) => {
      if (!patientId) return;
      await deleteProcedure(patientId, fdiNumber, procId);
      await createPatientFileRecord(`Deleted dental procedure ${procId} from tooth ${fdiNumber}.`);
    },
    [patientId, createPatientFileRecord]
  );

  const handleSetProcedurePayment = useCallback(
    async (fdiNumber, procId, paymentStatus) => {
      if (!patientId) return;
      await setProcedurePayment(patientId, fdiNumber, procId, paymentStatus);
      await createPatientFileRecord(
        `Marked dental procedure ${procId} on tooth ${fdiNumber} as ${paymentStatus}.`
      );
    },
    [patientId, createPatientFileRecord]
  );

  const handleAddChiefComplaint = useCallback(
    async (payload) => {
      if (!patientId) return;
      await addChiefComplaint(patientId, payload);
      const details = [payload.codes?.join(', '), payload.other_text].filter(Boolean).join(' | ');
      await createPatientFileRecord(`Recorded dental chief complaint: ${details}.`);
    },
    [patientId, createPatientFileRecord]
  );

  const handleDeleteChiefComplaint = useCallback(
    async (complaintId) => {
      if (!patientId) return;
      await deleteChiefComplaint(patientId, complaintId);
    },
    [patientId]
  );

  const handleUploadXray = useCallback(
    async (phase, files) => {
      if (!patientId) return;
      await uploadXrays(patientId, { phase, files });
      await createPatientFileRecord(
        `Uploaded ${files.length} dental x-ray file(s) — ${phase} treatment.`
      );
    },
    [patientId, createPatientFileRecord]
  );

  const handleDeleteXray = useCallback(
    async (xrayId) => {
      if (!patientId) return;
      await deleteXray(patientId, xrayId);
    },
    [patientId]
  );

  const handleAddNote = useCallback(
    async (payload) => {
      if (!patientId) return;
      await addNote(patientId, payload);
      const scope = payload.tooth_fdi ? `tooth ${payload.tooth_fdi}` : 'chart';
      await createPatientFileRecord(`Added dental note (${scope}): ${payload.text}`);
    },
    [patientId, createPatientFileRecord]
  );

  const handleDeleteNote = useCallback(
    async (noteId) => {
      if (!patientId) return;
      await deleteNote(patientId, noteId);
    },
    [patientId]
  );

  const handleSnapshot = useCallback(
    async (label) => {
      if (!patientId) return;
      await saveSnapshot(patientId, label);
      await createPatientFileRecord(`Saved dental chart snapshot: ${label}.`);
    },
    [patientId, createPatientFileRecord]
  );

  const handleChartTypeChange = useCallback(
    async (chartType) => {
      if (!patientId) return;
      await switchChartType(patientId, chartType);
      await createPatientFileRecord(`Switched dental chart type to ${chartType}.`);
    },
    [patientId, createPatientFileRecord]
  );

  const handleCreateBridge = useCallback(
    async (teeth) => {
      if (!patientId) return;
      await createBridge(patientId, { teeth });
      await createPatientFileRecord(`Created fixed bridge across teeth ${teeth.join('–')}.`);
    },
    [patientId, createPatientFileRecord]
  );

  const handleDeleteBridge = useCallback(
    async (bridgeId) => {
      if (!patientId) return;
      await deleteBridge(patientId, bridgeId);
      await createPatientFileRecord(`Removed fixed bridge ${bridgeId}.`);
    },
    [patientId, createPatientFileRecord]
  );

  if (!patientId) {
    return <Alert severity="warning">Patient ID not found</Alert>;
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Failed to load dental chart</Alert>;
  }

  return (
    <OdontogramView
      patientId={String(patientId)}
      chartData={chartData}
      lang={lang}
      onSave={handleSave}
      onSaveTooth={handleSaveTooth}
      onAddProcedure={handleAddProcedure}
      onDeleteProcedure={handleDeleteProcedure}
      onSetProcedurePayment={handleSetProcedurePayment}
      onAddChiefComplaint={handleAddChiefComplaint}
      onDeleteChiefComplaint={handleDeleteChiefComplaint}
      onUploadXray={handleUploadXray}
      onDeleteXray={handleDeleteXray}
      onSnapshot={handleSnapshot}
      onChartTypeChange={handleChartTypeChange}
      onCreateBridge={handleCreateBridge}
      onDeleteBridge={handleDeleteBridge}
      onAddNote={handleAddNote}
      onDeleteNote={handleDeleteNote}
    />
  );
}

PatientDentalChart.propTypes = {
  patient: PropTypes.object,
};
