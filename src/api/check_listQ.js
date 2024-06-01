import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetGeneralCheckListData() {
  const URL = endpoints.generalCheckList.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      CheckListData: data,
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
export function useGetlocalCheckListData() {
  const URL = endpoints.localCheckList.all;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      localListData: data,
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

export function useGetOneCheckListData(id) {
  const URL = endpoints.generalCheckList.one(id);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      CheckListData: data,
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
// export function useGetPatientCheckListData(id) {
//   const URL = endpoints.generalCheckList.patient(id);

//   const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
//   const memoizedValue = useMemo(
//     () => ({
//       checkListData: data,
//       loading: isLoading,
//       error,
//       validating: isValidating,
//       empty: !isLoading && !data?.length,
//     }),
//     [data, error, isLoading, isValidating]
//   );
//   const refetch = async () => {
//     // Use the mutate function to re-fetch the data for the specified key (URL)
//     await mutate(URL);
//   };

//   return { ...memoizedValue, refetch };
// }
