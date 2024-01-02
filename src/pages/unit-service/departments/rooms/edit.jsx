import { Helmet } from 'react-helmet-async';

import DepartmentRoomEditView from 'src/sections/unit-service/departments/rooms/table-edit-view';
import { useGetDepartment,useGetRoom } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentRoomEditPage() {
  const params = useParams();
  const { id,acid } = params;
  const { data } = useGetDepartment(id);
  const roomData = useGetRoom(acid).data;
  const name = roomData?.name_english
  return (
    <>
      <Helmet>
        <title> Edit {name||''} Room </title>
      </Helmet>

      {data && roomData && <DepartmentRoomEditView roomData={roomData} departmentData={data} />}
    </>
  );
}
