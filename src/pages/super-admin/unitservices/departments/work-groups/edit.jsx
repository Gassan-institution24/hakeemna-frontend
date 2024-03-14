import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetWorkGroup, useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentWorkGroupEditView from 'src/sections/super-admin/unitservices/departments/work-groups/table-edit-view';

// ----------------------------------------------------------------------

export default function DepartmentWorkGroupEditPage() {
  const params = useParams();
  const { depid, acid } = params;
  const departmentData = useGetDepartment(depid).data;
  const { data, loading } = useGetWorkGroup(acid);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title> Edit {name || ''} Work Group </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && (
        <DepartmentWorkGroupEditView WorkGroupData={data} departmentData={departmentData} />
      )}
    </>
  );
}
