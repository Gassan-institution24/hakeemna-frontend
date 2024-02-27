import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentRoomNewView from 'src/sections/super-admin/unitservices/departments/rooms/table-create-view';

// ----------------------------------------------------------------------

export default function DepartmentRoomNewPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  return (
    <ACLGuard hasContent category="department" subcategory="rooms" acl="create">
      <Helmet>
        <title> Add Room </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentRoomNewView departmentData={data} />}
    </ACLGuard>
  );
}
