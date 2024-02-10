import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import { useGetEmployeeEngagement } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

import EmployeeACLView from 'src/sections/unit-service/employees/view/acl';

// ----------------------------------------------------------------------

export default function EmployeeACLPage() {
  const { id } = useParams();
  const { data, loading } = useGetEmployeeEngagement(id);
  return (
    <>
      <ACLGuard hasContent category="employee" subcategory="acl" acl="update">
        <Helmet>
          <title>Access control list</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <EmployeeACLView acl={data.acl} />}
      </ACLGuard>
    </>
  );
}
