import { useMemo } from 'react';
import useSWR, { mutate } from 'swr';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetFavoriteMedication() {
    const URL = endpoints.favoriteMedication.all

    const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
    const memoizedValue = useMemo(
        () => ({
           favoriteMedication: data,
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
    }

    return { ...memoizedValue, refetch };
}
