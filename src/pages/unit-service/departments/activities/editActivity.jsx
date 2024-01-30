import { Helmet } from 'react-helmet-async';

import DepartmentActivityEditView from 'src/sections/unit-service/departments/activities/table-edit-view';
import { useGetDepartment,useGetActivity } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import { LoadingScreen } from 'src/components/loading-screen';
import ACLGuard from 'src/auth/guard/acl-guard';

// ----------------------------------------------------------------------

export default function DepartmentActivityEditPage() {
  const params = useParams();
  const { id,acid } = params;
  const departmentData = useGetDepartment(id).data;
  const {data, loading} = useGetActivity(acid);
  const name = data?.name_english
  return (
    <>
    <ACLGuard hasContent category='department' subcategory='activities' acl='update'>
      <Helmet>
        <title> Edit {name||''} Activity </title>
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading && <DepartmentActivityEditView activityData={data} departmentData={departmentData} />}
      </ACLGuard>
    </>
  );
}
