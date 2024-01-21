import { Helmet } from 'react-helmet-async';

import DepartmentWorkGroupsView from 'src/sections/unit-service/departments/view/work-groups';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupsPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>{name||''} Department Work Groups</title>
      </Helmet>

      {data && <DepartmentWorkGroupsView departmentData={data} />}
    </>
  );
}
