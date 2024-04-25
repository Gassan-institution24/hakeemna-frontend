import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetAppointments() {
  const URL = endpoints.appointments.all;

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
  const URL = endpoints.appointments.available;

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
  const URL = endpoints.appointments.patient.many(id);

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

export function useGetpatientNotify(id) {
  const URL = endpoints.appointments.patient.notify(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      notifyData: data || [],
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
  const URL = endpoints.appointments.patient.one(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data || {},
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
  const URL = endpoints.appointments.unit_service.one({
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
      AppointDates: data?.dates || [],
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
  const URL = endpoints.appointments.unit_service.available(id);

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

export function useGetDepartmentAppointments({ id, page, sortBy, rowsPerPage, order, filters }) {
  const URL = endpoints.appointments.department.one({
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

export function useGetEmployeeAppointments({ id, page, sortBy, rowsPerPage, order, filters }) {
  const URL = endpoints.appointments.employee.one({
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
      AppointDates: data?.dates || [],
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

export function useGetEmployeeSelectedAppointments({ id, startDate,appointmentType }) {
  const URL = endpoints.appointments.employee.select({
    id,
    startDate,
    appointmentType
  });

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      appointmentsData: data?.appointments || [],
      appointmentTypes: data?.types || [],
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
  const URL = endpoints.appointments.one(id);

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
export function useGetNearstAppointment(id) {
  const URL = endpoints.appointments.employee.nearst(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      nearstappointment: data,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
