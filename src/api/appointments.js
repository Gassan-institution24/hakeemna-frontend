import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetAppointments() {
  const URL = endpoints.tables.appointments;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetAvailableAppointments() {
  const URL = endpoints.tables.availableAppointments;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetPatientAppointments(id) {
  const URL = endpoints.tables.patientAppointments(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}
export function useGetPatientOneAppointments(id) {
  const URL = endpoints.tables.patientoneAppointments(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetUSAppointments({ id, page, sortBy, rowsPerPage, order, filters }) {
  const URL = endpoints.tables.usAppointments({
    id,
    page,
    sortBy,
    rowsPerPage,
    order,
    filters,
  });

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data?.appointments || [],
      appointmentsLength: data?.length || 0,
      all: data?.all || 0,
      notBooked: data?.notBooked || 0,
      available: data?.available || 0,
      finished: data?.finished || 0,
      processing: data?.processing || 0,
      pending: data?.pending || 0,
      canceled: data?.canceled || 0,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetUSAvailableAppointments(id) {
  const URL = endpoints.tables.usAppointmentsavilable(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}
export function useGetUSAppointmentsCount(id) {
  const URL = endpoints.tables.usAppointmentsCount(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsCount: data,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetDepartmentAppointments({ id, page, sortBy, rowsPerPage, order, filters }) {
  const URL = endpoints.tables.departmentAppointments({
    id,
    page,
    sortBy,
    rowsPerPage,
    order,
    filters,
  });

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data?.appointments || [],
      appointmentsLength: data?.length || 0,
      all: data?.all || 0,
      notBooked: data?.notBooked || 0,
      available: data?.available || 0,
      finished: data?.finished || 0,
      processing: data?.processing || 0,
      pending: data?.pending || 0,
      canceled: data?.canceled || 0,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}
export function useGetDepartmentAppointmentsCount(id) {
  const URL = endpoints.tables.departmentAppointmentsCount(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsCount: data,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetEmployeeAppointments({ id, page, sortBy, rowsPerPage, order, filters }) {
  const URL = endpoints.tables.employeeAppointments({
    id,
    page,
    sortBy,
    rowsPerPage,
    order,
    filters,
  });

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data?.appointments || [],
      appointmentsLength: data?.length || 0,
      all: data?.all || 0,
      notBooked: data?.notBooked || 0,
      available: data?.available || 0,
      finished: data?.finished || 0,
      processing: data?.processing || 0,
      pending: data?.pending || 0,
      canceled: data?.canceled || 0,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetUSEmployeeAppointments(id, emid) {
  const URL = endpoints.tables.usEmployeeAppointments(id, emid);

  // console.log('URL', URL);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetAppointment(id) {
  const URL = endpoints.tables.appointment(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      data,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
