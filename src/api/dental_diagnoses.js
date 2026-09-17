import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// Diagnoses the clinic added itself, on top of the built-in catalogue in
// `constants/conditions.js`. Scoped to the unit service, so one dentist adding
// a finding makes it available to the whole clinic for every patient after.
export function useGetDentalDiagnoses(unitServiceId) {
  const URL = endpoints.dentalDiagnoses.byUnitService(unitServiceId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      diagnoses: data?.data || [],
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return { ...memoizedValue, refetch: () => mutate(URL) };
}

export async function createDentalDiagnosis(unitServiceId, payload) {
  const res = await axiosInstance.post(endpoints.dentalDiagnoses.create, {
    unit_service: unitServiceId,
    ...payload,
  });
  await mutate(endpoints.dentalDiagnoses.byUnitService(unitServiceId));
  return res.data?.data;
}

export async function deleteDentalDiagnosis(unitServiceId, id) {
  const res = await axiosInstance.delete(endpoints.dentalDiagnoses.remove(id));
  await mutate(endpoints.dentalDiagnoses.byUnitService(unitServiceId));
  return res.data;
}
