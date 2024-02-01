import { Helmet } from 'react-helmet-async';

import DepartmentRoomNewView from 'src/sections/unit-service/departments/rooms/table-create-view';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentRoomNewPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="rooms" acl="create">
        <Helmet>
          <title> Add Room </title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentRoomNewView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
