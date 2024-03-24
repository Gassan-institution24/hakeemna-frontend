import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentActivitiesView from 'src/sections/super-admin/unitservices/departments/view/activities';

// ----------------------------------------------------------------------

export default function DepartmentActivitiesPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>{name || ''} Department Activities</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentActivitiesView departmentData={data} />}
    </>
  );
}
