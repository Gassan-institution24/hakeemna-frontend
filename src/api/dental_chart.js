import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

export function useGetDentalChart(patientId) {
  const URL = endpoints.dentalChart.one(patientId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      chartData: data?.data || null,
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, refetch: () => mutate(URL) };
}

function invalidate(patientId) {
  return mutate(endpoints.dentalChart.one(patientId));
}

export async function updateTooth(patientId, toothNumber, payload) {
  const res = await axiosInstance.patch(
    endpoints.dentalChart.updateTooth(patientId, toothNumber),
    payload
  );
  await invalidate(patientId);
  return res.data;
}

export async function bulkUpdateTeeth(patientId, updates) {
  const res = await axiosInstance.post(endpoints.dentalChart.bulk(patientId), { updates });
  await invalidate(patientId);
  return res.data;
}

export async function clearTooth(patientId, toothNumber) {
  const res = await axiosInstance.post(endpoints.dentalChart.clearTooth(patientId, toothNumber));
  await invalidate(patientId);
  return res.data;
}

export async function addProcedure(patientId, toothNumber, payload) {
  const res = await axiosInstance.post(
    endpoints.dentalChart.addProcedure(patientId, toothNumber),
    payload
  );
  await invalidate(patientId);
  return res.data;
}

export async function updateProcedure(patientId, toothNumber, procedureId, payload) {
  const res = await axiosInstance.patch(
    endpoints.dentalChart.updateProcedure(patientId, toothNumber, procedureId),
    payload
  );
  await invalidate(patientId);
  return res.data;
}

export async function deleteProcedure(patientId, toothNumber, procedureId) {
  const res = await axiosInstance.delete(
    endpoints.dentalChart.deleteProcedure(patientId, toothNumber, procedureId)
  );
  await invalidate(patientId);
  return res.data;
}

export async function setProcedurePayment(patientId, toothNumber, procedureId, paymentStatus) {
  const res = await axiosInstance.patch(
    endpoints.dentalChart.procedurePayment(patientId, toothNumber, procedureId),
    { payment_status: paymentStatus }
  );
  await invalidate(patientId);
  return res.data;
}

export async function addNote(patientId, payload) {
  const res = await axiosInstance.post(endpoints.dentalChart.note(patientId), payload);
  await invalidate(patientId);
  return res.data;
}

export async function deleteNote(patientId, noteId) {
  const res = await axiosInstance.delete(endpoints.dentalChart.deleteNote(patientId, noteId));
  await invalidate(patientId);
  return res.data;
}

export async function addChiefComplaint(patientId, payload) {
  const res = await axiosInstance.post(endpoints.dentalChart.chiefComplaint(patientId), payload);
  await invalidate(patientId);
  return res.data;
}

export async function deleteChiefComplaint(patientId, complaintId) {
  const res = await axiosInstance.delete(
    endpoints.dentalChart.deleteChiefComplaint(patientId, complaintId)
  );
  await invalidate(patientId);
  return res.data;
}

// `files` is a FileList / File[]; everything travels as multipart so DICOM and
// plain images share one upload path.
export async function uploadXrays(patientId, { phase, files, toothFdi, notes, takenAt }) {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('file', file));
  formData.append('phase', phase);
  if (toothFdi) formData.append('tooth_fdi', toothFdi);
  if (notes) formData.append('notes', notes);
  if (takenAt) formData.append('taken_at', takenAt);

  const res = await axiosInstance.post(endpoints.dentalChart.xray(patientId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  await invalidate(patientId);
  return res.data;
}

export async function deleteXray(patientId, xrayId) {
  const res = await axiosInstance.delete(endpoints.dentalChart.deleteXray(patientId, xrayId));
  await invalidate(patientId);
  return res.data;
}

export async function saveSnapshot(patientId, label) {
  const res = await axiosInstance.post(endpoints.dentalChart.snapshot(patientId), { label });
  await invalidate(patientId);
  return res.data;
}

export async function getSnapshots(patientId) {
  const res = await axiosInstance.get(endpoints.dentalChart.snapshots(patientId));
  return res.data;
}

export async function restoreSnapshot(patientId, snapshotId) {
  const res = await axiosInstance.post(endpoints.dentalChart.restore(patientId, snapshotId));
  await invalidate(patientId);
  return res.data;
}

export async function createBridge(patientId, payload) {
  const res = await axiosInstance.post(endpoints.dentalChart.bridge(patientId), payload);
  await invalidate(patientId);
  return res.data;
}

export async function deleteBridge(patientId, bridgeId) {
  const res = await axiosInstance.delete(endpoints.dentalChart.deleteBridge(patientId, bridgeId));
  await invalidate(patientId);
  return res.data;
}

export async function switchChartType(patientId, chartType) {
  const res = await axiosInstance.patch(endpoints.dentalChart.chartType(patientId), {
    chart_type: chartType,
  });
  await invalidate(patientId);
  return res.data;
}

export async function exportChart(patientId) {
  const res = await axiosInstance.get(endpoints.dentalChart.export(patientId));
  return res.data;
}
