import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import axiosInstance, { fetcher, endpoints } from 'src/utils/axios';

export function useGetPatients() {
    const URL = endpoints.tables.patients;
  
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
    const memoizedValue = useMemo(
      () => ({
        patientsData: data || [],
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
  
  export function useGetPatient(id) {
    const URL = endpoints.tables.patient(id); 
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
    const refetch = async () => {
      // Use the mutate function to re-fetch the data for the specified key (URL)
      await mutate(URL);
    };
  
    return { ...memoizedValue, refetch };
  }
  

  export function useGetOldPatient() {
    const URL = endpoints.tables.oldpatient(); 
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
    const refetch = async () => {
      // Use the mutate function to re-fetch the data for the specified key (URL)
      await mutate(URL);
    };
  
    return { ...memoizedValue, refetch };
  }



  
  export function useGetFindPatient(obj) {
    const URL = endpoints.tables.findPatients;
    console.log('url',URL)
  
    const { data, isLoading, error, isValidating } = useSWR(URL, axiosInstance.get(URL,obj));
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
    const refetch = async () => {
      // Use the mutate function to re-fetch the data for the specified key (URL)
      await mutate(URL);
    };
  
    return { ...memoizedValue, refetch };
  }