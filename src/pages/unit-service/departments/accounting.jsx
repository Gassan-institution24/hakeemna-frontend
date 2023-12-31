import { Helmet } from 'react-helmet-async';

import DepartmentAccountingView from 'src/sections/unit-service/departments/view/accounting';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentAccountingPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name} Department Accounting</title>
      </Helmet>

      {data && <DepartmentAccountingView departmentData={data} />}
    </>
  );
}
