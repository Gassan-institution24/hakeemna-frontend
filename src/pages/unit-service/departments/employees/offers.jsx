import { Helmet } from 'react-helmet-async';

import DepartmentEmployeeOffersView from 'src/sections/unit-service/departments/employees/view/offers-view';
import { useGetDepartment,useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentEmployeeOffersPage() {
  const params = useParams();
  const { id,emid } = params;
  const { data } = useGetDepartment(id);
  const employeeData = useGetEmployee(emid).data;
  const name = employeeData?.first_name
  return (
    <>
      <Helmet>
        <title> {name||''} Employee Offers</title>
      </Helmet>

      {data && employeeData && <DepartmentEmployeeOffersView employeeData={employeeData} departmentData={data} />}
    </>
  );
}
