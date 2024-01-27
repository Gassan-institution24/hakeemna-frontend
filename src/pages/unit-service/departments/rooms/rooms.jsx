import { Helmet } from 'react-helmet-async';

import DepartmentRoomsView from 'src/sections/unit-service/departments/view/rooms';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function DepartmentRoomsPage() {
  const params = useParams();
  const { id } = params;
  const { data,loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>{name||''} Department Rooms</title>
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading && <DepartmentRoomsView departmentData={data} />}
    </>
  );
}
