import { Helmet } from 'react-helmet-async';

import EmployeeACLView from 'src/sections/unit-service/employees/view/acl';
import { useGetEmployee } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EmployeeACLPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployee(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Employee ACL</title>
      </Helmet>

      {data && <EmployeeACLView employeeData={data} />}
    </>
  );
}
