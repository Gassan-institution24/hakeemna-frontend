import { Helmet } from 'react-helmet-async';

import DepartmentActivityEditView from 'src/sections/unit-service/departments/activities/table-edit-view';
import { useGetDepartment,useGetActivity } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentActivityEditPage() {
  const params = useParams();
  const { id,acid } = params;
  const { data } = useGetDepartment(id);
  const activityData = useGetActivity(acid).data;
  const name = activityData?.name_english
  return (
    <>
      <Helmet>
        <title> Edit {name||''} Activity </title>
      </Helmet>

      {data && activityData && <DepartmentActivityEditView activityData={activityData} departmentData={data} />}
    </>
  );
}
