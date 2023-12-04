import useSWR from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetUser() {
    const URL = `${endpoints.patients.onepatients}/656af6ccac70bc1aa4120dad`;
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  
    const memoizedValue = useMemo(
      () => ({
        data: data || [],
        Loading: isLoading,
        error,
        validating: isValidating,
      }),
      [data, error, isLoading, isValidating]
    );
   
    return memoizedValue;
  }


export function useGetpatientAppointment() {
    const URL = `${endpoints.appointment.patientsappointments}`;
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
 
    const memoizedValue = useMemo(
      () => ({
        data: data || [],
        Loading: isLoading,
        error,
        validating: isValidating,
      }),
      [data, error, isLoading, isValidating]
    );
    
    return memoizedValue;
  }


export function useGetOffers() {
    const URL = `${endpoints.offers.getoffers}`;
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
 
    const memoizedValue = useMemo(
      () => ({
        data: data || [],
        Loading: isLoading,
        error,
        validating: isValidating,
      }),
      [data, error, isLoading, isValidating]
    );
    return memoizedValue;
  }