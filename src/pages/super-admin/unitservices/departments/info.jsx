import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentInfoView from 'src/sections/super-admin/unitservices/departments/view/info';

// ----------------------------------------------------------------------

export default function DepartmentInfoPage() {
  const params = useParams();
  const { depid } = params;
  const { data, loading } = useGetDepartment(depid);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="department_info" acl="read">
      <Helmet>
        <title>{name || ''} Department Info</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentInfoView departmentData={data} />}
    </ACLGuard>
  );
}
