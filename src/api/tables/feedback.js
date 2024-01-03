import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetUSFeedbackes(id) {
  const URL = endpoints.tables.USfeedbacks(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      feedbackData: data || [] ,
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

export function useGetUSFeedbackesCount(id) {
  const URL = endpoints.tables.USfeedbacksCount(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      feedbackCount: data  ,
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

export function useGetDepartmentFeedbackes(id) {
  const URL = endpoints.tables.departmentfeedbacks(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      feedbackData: data || [] ,
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

export function useGetDepartmentFeedbackesCount(id) {
  const URL = endpoints.tables.departmentfeedbacksCount(id);
  
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      feedbackCount: data  ,
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

  export function useGetEmployeeFeedbackes(id) {
    const URL = endpoints.tables.employeefeedbacks(id);
  
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
    const memoizedValue = useMemo(
      () => ({
        feedbackData: data || [] ,
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
  

  export function useGetUSEmployeeFeedbackes(id,emid) {
    const URL = endpoints.tables.usemployeefeedbacks(id,emid);
  
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
    const memoizedValue = useMemo(
      () => ({
        feedbackData: data || [] ,
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
  
  export function useGetDepartmentEmployeeFeedbackes(id,emid) {
    const URL = endpoints.tables.departmentemployeefeedbacks(id,emid);
  
    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
    const memoizedValue = useMemo(
      () => ({
        feedbackData: data || [] ,
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
  
export function useGetDoctornaFeedbackes() {
  const URL = endpoints.tables.doctornafeedbacks;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      feedbackData: data || [] ,
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

export function useGetUSsFeedbackes() {
  const URL = endpoints.tables.USsfeedbacks;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      feedbackData: data || [] ,
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

export function useGetStakeholdersFeedbackes() {
  const URL = endpoints.tables.stakeholdersfeedbacks;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      feedbackData: data || [] ,
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


export function useGetPatientFeedbacks(id) {
  const URL = endpoints.tables.patientfeedbacks(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      feedbackData: data || [] ,
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


export function useGetStakeholderFeedbacks(id) {
  const URL = endpoints.tables.stakeholderFeedbacks(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      feedbackData: data || [] ,
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


export function useGetFeedback(id) {
  const URL = endpoints.tables.feedback(id);

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