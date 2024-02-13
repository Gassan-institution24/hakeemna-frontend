import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentActivityNewView from 'src/sections/unit-service/departments/activities/table-create-view';

// ----------------------------------------------------------------------

export default function DepartmentActivityNewPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  return (
    <ACLGuard hasContent category="department" subcategory="activities" acl="create">
        <Helmet>
          <title> Add Activity </title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentActivityNewView departmentData={data} />}
      </ACLGuard>
  );
}
