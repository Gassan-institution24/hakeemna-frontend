import useSWR,{mutate} from 'swr';
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
    const refetch = async ()=>{
      await mutate(URL)
    }
    return {...memoizedValue,refetch};
  }


export function useGetStackholder() {
    const URL = `${endpoints.stackholder.getstackholder}`;
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
 
    const memoizedValue = useMemo(
      () => ({
        stackholder: data || [],
        Loading: isLoading,
        error,
        validating: isValidating,
      }),
      [data, error, isLoading, isValidating]
    );
    const refetch = async ()=>{
      await mutate(URL)
    }
    return {...memoizedValue,refetch};
  }












export function useGetOffer(id) {
    const URL = endpoints.offers.getoffer(id);
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
