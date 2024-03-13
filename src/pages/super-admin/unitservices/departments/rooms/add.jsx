import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentRoomNewView from 'src/sections/super-admin/unitservices/departments/rooms/table-create-view';

// ----------------------------------------------------------------------

export default function DepartmentRoomNewPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  return (
    <>
      <Helmet>
        <title> Add Room </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentRoomNewView departmentData={data} />}
    </>
  );
}
