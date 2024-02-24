import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentQCView from 'src/sections/super-admin/unitservices/departments/view/quality-control';

// ----------------------------------------------------------------------

export default function DepartmentQCPage() {
  const params = useParams();
  const {depid} = params;
  const { data, loading } = useGetDepartment(depid);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="quality_control" acl="read">
      <Helmet>
        <title>{name || ''} Department Quality Control</title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentQCView departmentData={data} />}
    </ACLGuard>
  );
}
