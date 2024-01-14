import { Helmet } from 'react-helmet-async';

import EmployeeAccountingView from 'src/sections/unit-service/employees/view/accounting-view';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeAccountingPage() {
  const params = useParams();
  const { id } = params;
  const {data} = useGetEmployee(id);
  const name = data?.first_name;
  return (
    <>
      <Helmet>
        <title> {name || ''} Employee Accounting</title>
      </Helmet>

      {data && (
        <EmployeeAccountingView employeeData={data} />
      )}
    </>
  );
}
