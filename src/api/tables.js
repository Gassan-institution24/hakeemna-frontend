import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';

import { fetcher, endpoints } from 'src/utils/axios';

export function useGetTables() {
  const URL = endpoints.allTables;

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher);
  const memoizedValue = useMemo(
    () => ({
      tableData: data || [],
      loading: isLoading,
      error,
      validating: isValidating,
      empty: !isLoading && !data?.length,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export * from './tables/activities';
export * from './tables/added_value_tax_GD';
export * from './tables/analyses';
export * from './tables/appointment_types';
export * from './tables/cities';
export * from './tables/countries';
export * from './tables/currencies';
export * from './tables/deduction_config';
export * from './tables/departments';
export * from './tables/diets';
export * from './tables/diseases';
export * from './tables/employee_types';
export * from './tables/free_subscriptions';
export * from './tables/hospital_list';
export * from './tables/insurance_companies';
export * from './tables/insurance_types';
export * from './tables/measurement_types';
export * from './tables/medical_categories';
export * from './tables/medicines';
export * from './tables/medicines_families';
export * from './tables/patients';
export * from './tables/payment_methods';
export * from './tables/rooms';
export * from './tables/service_types';
export * from './tables/specialities';
export * from './tables/stakeholder_types';
export * from './tables/sub_specialities';
export * from './tables/surgeries';
export * from './tables/symptoms';
export * from './tables/unit_service_types';
export * from './tables/unit_services';
export * from './tables/work_shifts';
export * from './tables/employees';
