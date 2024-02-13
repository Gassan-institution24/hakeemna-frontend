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
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="rooms" acl="update">
        <Helmet>
          <title> Edit {name || ''} Room </title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentRoomEditView roomData={data} departmentData={departmentData} />}
      </ACLGuard>
  );
}
