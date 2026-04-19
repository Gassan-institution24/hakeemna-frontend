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

export * from './user';
export * from './blogs';
export * from './user_contact';
export * from './diets';
export * from './rooms';
export * from './drugs';
export * from './cities';
export * from './offers';
export * from './orders';
export * from './history';
export * from './keywords';
export * from './tickets';
export * from './uploads';
export * from './analyses';
export * from './diseases';
export * from './patients';
export * from './symptoms';
export * from './feedback';
export * from './employee_calendar';
export * from './training';
export * from './receipts';
export * from './countries';
export * from './medicines';
export * from './surgeries';
export * from './employees';
export * from './customers';
export * from './med_record';
export * from './activities';
export * from './currencies';
export * from './statistics';
export * from './attendance';
export * from './departments';
export * from './work_shifts';
export * from './work_groups';
export * from './check_list';
export * from './prescription';
export * from './specialities';
export * from './stakeholders';
export * from './appointments';
export * from './doctor_report';
export * from './blog_category';
export * from './hospital_list';
export * from './service_types';
export * from './unit_services';
export * from './subscriptions';
export * from './system_errors';
export * from './notifications';
export * from './employee_types';
export * from './insurance_data';
export * from './medical_reports';
export * from './companies_list';
export * from './insurance_types';
export * from './payment_methods';
export * from './deduction_config';
export * from './sub_specialities';
export * from './appointment_types';
export * from './measurement_types';
export * from './stakeholder_types';
export * from './license_movements';
export * from './appointment_config';
export * from './ticket_categories';
export * from './added_value_tax_GD';
export * from './free_subscriptions';
export * from './medical_categories';
export * from './old_medical_reports';
export * from './medicines_families';
export * from './entrance_management';
export * from './unit_service_types';
export * from './economic_movements';
export * from './insurance_companies';
export * from './unit_service_patient';
export * from './employee_engagements';
export * from './income_payment_control';
export * from './patient_medical_analysis';
export * from './diagnosis';
