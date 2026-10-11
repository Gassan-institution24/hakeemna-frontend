import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export function useGetSpecialityServices(specialityId) {
  const key = specialityId
    ? [endpoints.specialityServices.all, { params: { speciality: specialityId } }]
    : null;

  const { data, isLoading, error } = useSWR(key, fetcher);

  const memoizedValue = useMemo(
    () => ({ services: data || [], loading: isLoading, error }),
    [data, error, isLoading]
  );

  return { ...memoizedValue, refetch: () => mutate(key) };
}

export async function createSpecialityService(payload) {
  const res = await axiosInstance.post(endpoints.specialityServices.all, payload);
  return res.data;
}

export async function updateSpecialityService(id, payload) {
  const res = await axiosInstance.patch(endpoints.specialityServices.one(id), payload);
  return res.data;
}

export async function deleteSpecialityService(id) {
  await axiosInstance.delete(endpoints.specialityServices.one(id));
}

// Clinic side: add ticked catalogue services to the clinic's own price list.
export async function addClinicServicesFromSpeciality(payload) {
  const res = await axiosInstance.post(endpoints.service_types.fromSpeciality, payload);
  return res.data;
}

export async function importSpecialityServices(speciality, rows) {
  const res = await axiosInstance.post(endpoints.specialityServices.import, { speciality, rows });
  return res.data;
}
