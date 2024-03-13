import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentWorkGroupNewView from 'src/sections/super-admin/unitservices/departments/work-groups/table-create-view';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupNewPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  return (
    <>
      <Helmet>
        <title> New Work Group </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentWorkGroupNewView departmentData={data} />}
    </>
  );
}
