import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentAppointmentConfigView from 'src/sections/super-admin/unitservices/departments/view/appointmentconfiguration';

// ----------------------------------------------------------------------

export default function DepartmentAppointmentConfigPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>{name || ''} Department Appointment Configuration</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentAppointmentConfigView departmentData={data} />}
    </>
  );
}
