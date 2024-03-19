import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import ACLGuard from 'src/auth/guard/acl-guard';
import { useGetRoom, useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentRoomEditView from 'src/sections/unit-service/departments/rooms/table-edit-view';

// ----------------------------------------------------------------------

export default function DepartmentRoomEditPage() {
  const params = useParams();
  const { id, acid } = params;
  const departmentData = useGetDepartment(id).data;
  const { data, loading } = useGetRoom(acid);
  return (
    <ACLGuard category="department" subcategory="management_tables" acl="update">
      <Helmet>
        <title>{departmentData.name_english || 'Deartment'} : Edit Room </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentRoomEditView roomData={data} departmentData={departmentData} />}
    </ACLGuard>
  );
}
