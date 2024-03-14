import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentEditView from 'src/sections/super-admin/unitservices/departments/view/edit';

// ----------------------------------------------------------------------

export default function DepartmentEditPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title> Edit {name || ''} Department </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentEditView departmentData={data} />}
    </>
  );
}
