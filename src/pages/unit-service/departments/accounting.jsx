import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentAccountingView from 'src/sections/unit-service/departments/view/accounting';

// ----------------------------------------------------------------------

export default function DepartmentAccountingPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="accounting" acl="read">
      <Helmet>
        <title>{name || ''} Department Accounting</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentAccountingView departmentData={data} />}
    </ACLGuard>
  );
}
