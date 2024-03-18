import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentActivitiesView from 'src/sections/unit-service/departments/view/activities';

// ----------------------------------------------------------------------

export default function DepartmentActivitiesPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="department" subcategory="management_tables" acl="read">
      <Helmet>
        <title>{name} : Department Activities</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentActivitiesView departmentData={data} />}
    </ACLGuard>
  );
}
