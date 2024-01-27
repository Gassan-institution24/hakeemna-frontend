import { Helmet } from 'react-helmet-async';

import DepartmentActivitiesView from 'src/sections/unit-service/departments/view/activities'
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function DepartmentActivitiesPage() {
  const params = useParams();
  const { id } = params;
  const { data,loading } = useGetDepartment(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>{name||''} Department Activities</title>
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading && <DepartmentActivitiesView departmentData={data} />}
    </>
  );
}
