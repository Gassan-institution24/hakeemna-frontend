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
