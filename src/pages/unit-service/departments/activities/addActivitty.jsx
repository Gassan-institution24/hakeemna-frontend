import { Helmet } from 'react-helmet-async';

import DepartmentActivityNewView from 'src/sections/unit-service/departments/activities/table-create-view';
import { useGetDepartment } from 'src/api';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentActivityNewPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="activities" acl="create">
        <Helmet>
          <title> Add Activity </title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentActivityNewView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
