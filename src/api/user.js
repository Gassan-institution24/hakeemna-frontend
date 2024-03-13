import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetUsers() {
  const URL = endpoints.auth.users;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      usersData: data || [],
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

export function useGetUser(id) {
  const URL = `${endpoints.auth.user(id)}`;
  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

  const memoizedValue = useMemo(
    () => ({
      data,
      Loading: isLoading,
      error,
      validating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// export function useGetpatientAppointment() {
//   const URL = `${endpoints.appointment.patientsappointments}`;
//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       data: data || [],
//       Loading: isLoading,
//       error,
//       validating: isValidating,
//     }),
//     [data, error, isLoading, isValidating]
//   );

//   return memoizedValue;
// }

// export function useGetStackholder() {
//   const URL = `${endpoints.stakeholder.getstakeholder}`;
//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);

//   const memoizedValue = useMemo(
//     () => ({
//       stakeholder: data || [],
//       Loading: isLoading,
//       error,
//       validating: isValidating,
//     }),
//     [data, error, isLoading, isValidating]
//   );
//   const refetch = async () => {
//     await mutate(URL);
//   };
//   return { ...memoizedValue, refetch };
// }

// export function useGetPaymentmethods() {
//   const URL = `${endpoints.payment.getAllpaymentmethods}`;
//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
//   const memoizedValue = useMemo(
//     () => ({
//       paymentmethods: data || [],
//       Loading: isLoading,
//       error,
//       validating: isValidating,
//     }),
//     [data, error, isLoading, isValidating]
//   );
//   return memoizedValue;
// }
