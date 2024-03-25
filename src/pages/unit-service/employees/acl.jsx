import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetEmployeeEngagement } from 'src/api';

import EmployeeACLView from 'src/sections/unit-service/employees/view/acl';

// ----------------------------------------------------------------------

export default function EmployeeACLPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEmployeeEngagement(id);
  return (
    <ACLGuard category="unit_service" subcategory="permissions" acl="update">
      <Helmet>
        <title>{data?.name_english || 'Employee'} : Access control list</title>
        <meta name="description" content="meta" />
      </Helmet>
      <EmployeeACLView />
    </ACLGuard>
  );
}
