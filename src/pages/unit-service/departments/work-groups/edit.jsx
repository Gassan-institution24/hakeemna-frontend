import { Helmet } from 'react-helmet-async';

import DepartmentWorkGroupEditView from 'src/sections/unit-service/departments/work-groups/table-edit-view';
import { useGetDepartment,useGetWorkGroup } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupEditPage() {
  const params = useParams();
  const { id,acid } = params;
  const { data } = useGetDepartment(id);
  const WorkGroupData = useGetWorkGroup(acid).data;
  const name = WorkGroupData?.name_english
  return (
    <>
      <Helmet>
        <title> Edit {name||''} Work Group </title>
      </Helmet>

      {data && WorkGroupData && <DepartmentWorkGroupEditView WorkGroupData={WorkGroupData} departmentData={data} />}
    </>
  );
}
