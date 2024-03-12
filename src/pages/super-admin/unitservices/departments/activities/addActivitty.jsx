import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentActivityNewView from 'src/sections/super-admin/unitservices/departments/activities/table-create-view';

// ----------------------------------------------------------------------

export default function DepartmentActivityNewPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  return (
    <>
      <Helmet>
        <title> Add Activity </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentActivityNewView departmentData={data} />}
    </>
  );
}
