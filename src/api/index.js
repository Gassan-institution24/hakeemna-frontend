import useSWR from 'swr';
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

export * from './activities';
export * from './added_value_tax_GD';
export * from './analyses';
export * from './appointment_types';
export * from './cities';
export * from './countries';
export * from './currencies';
export * from './prescription';
export * from './deduction_config';
export * from './departments';
export * from './doctor_report';
export * from './diets';
export * from './diseases';
export * from './employee_types';
export * from './free_subscriptions';
export * from './hospital_list';
export * from './insurance_companies';
export * from './insurance_types';
export * from './insurance_data';
export * from './measurement_types';
export * from './medical_categories';
export * from './old_medical_repots';
export * from './medicines';
export * from './medicines_families';
export * from './patients';
export * from './payment_methods';
export * from './rooms';
export * from './history';
export * from './entranceManagement';
export * from './service_types';
export * from './specialities';
export * from './stakeholder_types';
export * from './stakeholders';
export * from './sub_specialities';
export * from './medical_repots';
export * from './surgeries';
export * from './symptoms';
export * from './unit_service_types';
export * from './unit_services';
export * from './work_shifts';
export * from './employees';
export * from './license_movements';
export * from './subscriptions';
export * from './feedback';
export * from './appointments';
export * from './economic-movements';
export * from './income_payment_control';
export * from './offers';
export * from './system-errors';
export * from './appointmentConfig';
export * from './work-groups';
export * from './old_patients';
export * from './notifications';
export * from './user';
export * from './calender';
export * from './employee_engagements';
export * from './companies_list';
export * from './keywods';
export * from './statistics';
export * from './ticket-categories';
export * from './tickets';
export * from './drugs';
export * from './uploads';
export * from './check_listQ';
export * from './orders';
export * from './customers';
export * from './training';
export * from './medRecord';
export * from './patient-medical-analysis';
export * from './reciepts';
