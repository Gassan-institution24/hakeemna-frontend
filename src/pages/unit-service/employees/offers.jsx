import { Helmet } from 'react-helmet-async';

import EmployeeOffersView from 'src/sections/unit-service/employees/view/offers-view';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeOffersPage() {
  const params = useParams();
  const { id } = params;
  const employeeData = useGetEmployee(id).data;
  const name = employeeData?.first_name
  return (
    <>
      <Helmet>
        <title> {name||''} Employee Offers</title>
      </Helmet>

      {employeeData && <EmployeeOffersView employeeData={employeeData} />}
    </>
  );
}
