import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeAppointconfigView from 'src/sections/unit-service/departments/employees/view/appoint-config-table';
import { useGetDepartment, useGetEmployee,useGetDepartmentEmployeeAppointmentConfigs } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeAppointconfigPage() {
  const params = useParams();
  const { id, emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const {appointmentConfigData,loading, refetch} = useGetDepartmentEmployeeAppointmentConfigs(id,emid)
  const name = employeeData?.first_name;

  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Appointment Config</title>
      </Helmet>

      {!loading && (
        <DepartmentEmployeeAppointconfigView appointmentConfigData={appointmentConfigData} employeeData={employeeData} departmentData={data} refetch={refetch} loading={loading}/>
      )} 
    </>
  );
}
