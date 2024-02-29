import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentRoomNewView from 'src/sections/unit-service/departments/rooms/table-create-view';

// ----------------------------------------------------------------------

export default function DepartmentRoomNewPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  return (
    <ACLGuard hasContent category="department" subcategory="rooms" acl="create">
      <Helmet>
        <title> Add Room </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentRoomNewView departmentData={data} />}
    </ACLGuard>
  );
}
