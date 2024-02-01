import { Helmet } from 'react-helmet-async';

import DepartmentRoomEditView from 'src/sections/unit-service/departments/rooms/table-edit-view';
import { useGetDepartment, useGetRoom } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentRoomEditPage() {
  const params = useParams();
  const { id, acid } = params;
  const departmentData = useGetDepartment(id).data;
  const { data, loading } = useGetRoom(acid);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="rooms" acl="update">
        <Helmet>
          <title> Edit {name || ''} Room </title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentRoomEditView roomData={data} departmentData={departmentData} />}
      </ACLGuard>
    </>
  );
}
