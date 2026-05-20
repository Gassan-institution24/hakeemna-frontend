import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { Box, Alert, CircularProgress } from '@mui/material';

import { useLocales } from 'src/locales';

import {
  useGetDentalChart,
  bulkUpdateTeeth,
  updateTooth,
  addProcedure,
  deleteProcedure,
  saveSnapshot,
  switchChartType,
} from '../../../../api/dental_chart';
import OdontogramView from './odontogram-view';

// ----------------------------------------------------------------------

export default function PatientDentalChart({ patient }) {
  const patientId = patient?.patient?._id || patient?._id;
  const { currentLang } = useLocales();
  const lang = currentLang?.value === 'ar' ? 'ar' : 'en';

  const { chartData, loading, error } = useGetDentalChart(patientId);

  // Auto-save: build bulk update payload from the full teethMap
  const handleSave = useCallback(
    async (teethMap) => {
      if (!patientId) return;
      const updates = Object.values(teethMap).map((tooth) => ({
        fdi_number: tooth.fdi_number,
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
      }
    },
    [patientId]
  );

  // Save a single tooth from the detail modal
  const handleSaveTooth = useCallback(
    async (fdiNumber, payload) => {
      if (!patientId) return;
      await updateTooth(patientId, fdiNumber, payload);
    },
    [patientId]
  );

  const handleAddProcedure = useCallback(
    async (fdiNumber, payload) => {
      if (!patientId) return;
      await addProcedure(patientId, fdiNumber, payload);
    },
    [patientId]
  );

  const handleDeleteProcedure = useCallback(
    async (fdiNumber, procId) => {
      if (!patientId) return;
      await deleteProcedure(patientId, fdiNumber, procId);
    },
    [patientId]
  );

  const handleSnapshot = useCallback(
    async (label) => {
      if (!patientId) return;
      await saveSnapshot(patientId, label);
    },
    [patientId]
  );

  const handleChartTypeChange = useCallback(
    async (chartType) => {
      if (!patientId) return;
      await switchChartType(patientId, chartType);
    },
    [patientId]
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
      onSnapshot={handleSnapshot}
      onChartTypeChange={handleChartTypeChange}
    />
  );
}

PatientDentalChart.propTypes = {
  patient: PropTypes.object,
};
