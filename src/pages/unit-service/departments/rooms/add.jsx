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
    <ACLGuard category="department" subcategory="management_tables" acl="create">
      <Helmet>
        <title>{data.name_english || 'Deartment'} : Add Room </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentRoomNewView departmentData={data} />}
    </ACLGuard>
  );
}
