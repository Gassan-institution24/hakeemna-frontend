import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentRoomsView from 'src/sections/unit-service/departments/view/rooms';

// ----------------------------------------------------------------------

export default function DepartmentRoomsPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="rooms" acl="read">
      <Helmet>
        <title>{name || ''} Department Rooms</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentRoomsView departmentData={data} />}
    </ACLGuard>
  );
}
