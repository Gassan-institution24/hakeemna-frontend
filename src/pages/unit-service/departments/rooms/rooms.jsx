import { Helmet } from 'react-helmet-async';

import DepartmentRoomsView from 'src/sections/unit-service/departments/view/rooms';
import { useGetDepartment } from 'src/api';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentRoomsPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="rooms" acl="read">
        <Helmet>
          <title>{name || ''} Department Rooms</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentRoomsView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
