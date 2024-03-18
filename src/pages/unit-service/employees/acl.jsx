import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import { useGetEmployee } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import EmployeeACLView from 'src/sections/unit-service/employees/view/acl';

// ----------------------------------------------------------------------

export default function EmployeeACLPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployee(id);
  return (
    <ACLGuard category="unit_service" subcategory="permissions" acl="update">
      <Helmet>
        <title>{data.name_english} : Access control list</title>
        <meta name="description" content="meta" />
      </Helmet>
      <EmployeeACLView />
    </ACLGuard>
  );
}
