import { Helmet } from 'react-helmet-async';

import DepartmentRoomNewView from 'src/sections/unit-service/departments/rooms/table-create-view';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentRoomNewPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  return (
    <>
      <Helmet>
        <title> Add Room </title>
      </Helmet>

      {data && <DepartmentRoomNewView departmentData={data} />}
    </>
  );
}
