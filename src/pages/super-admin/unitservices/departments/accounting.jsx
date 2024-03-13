import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentAccountingView from 'src/sections/super-admin/unitservices/departments/view/accounting';

// ----------------------------------------------------------------------

export default function DepartmentAccountingPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>{name || ''} Department Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentAccountingView departmentData={data} />}
    </>
  );
}
