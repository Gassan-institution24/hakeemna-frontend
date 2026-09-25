import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

import useSpecialityGuard from 'src/auth/guard/speciality-guard';

export function useGetdiagnosis(query) {
  const URL = [endpoints.diagnosis.all, { params: query }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      diagnosisData: data || [],
      length: data?.length,
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

// The diagnoses table split by who uses it: dentists get the `dental` entries,
// every other specialty the `general` ones (see super admin → Tables → Diagnoses).
export function useGetSpecialityDiagnoses() {
  const { isDentist } = useSpecialityGuard();
  return useGetdiagnosis({ category: isDentist ? 'dental' : 'general' });
}

export function useGetEntranceDiagnosis(id) {
  const URL = [endpoints.diagnosis.entrance(id)];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      EntranceDiagnosis: data || [],
      length: data?.length,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

// Every diagnosis recorded for one unit-service patient.
//
// The key is the bare URL, not `[URL]`: wrapping a null key in an array makes it
// truthy, so SWR would fire the request even without an id.
//
// The endpoint neither filters on `active` nor sorts, and it does not populate
// the diagnosis refs -- callers should filter/sort themselves and read the
// `primary_diagnosis_name` / `secondary_diagnosis_name` strings for labels.
export function useGetUSPatientDiagnosis(id) {
  const URL = endpoints.diagnosis.usPatient(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      usPatientDiagnosis: data || [],
      length: data?.length,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

export function useGetOnePatientDiagnosis(id) {
  const URL = endpoints.diagnosis.patientDiagnosisOne(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      patientDiagnosis: data || null,
      loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );
  const refetch = async () => {
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}
