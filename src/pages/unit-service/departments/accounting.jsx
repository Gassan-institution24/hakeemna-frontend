import { Helmet } from 'react-helmet-async';

import DepartmentAccountingView from 'src/sections/unit-service/departments/view/accounting';
import { useGetDepartment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function DepartmentAccountingPage() {
  const params = useParams();
  const { id } = params;
  const { data,loading } = useGetDepartment(id);
  const name = data?.name_english
  return (
    <>
        <ACLGuard hasContent category='accounting' acl='read'>
      <Helmet>
        <title>{name||''} Department Accounting</title>
      </Helmet>
      {loading&& <LoadingScreen/>}
      {!loading && <DepartmentAccountingView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
