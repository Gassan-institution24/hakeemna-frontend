import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentQCView from 'src/sections/unit-service/departments/view/quality-control';

// ----------------------------------------------------------------------

export default function DepartmentQCPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="department" subcategory="quality_control" acl="read">
      <Helmet>
        <title>{name || ''} Department Quality Control</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentQCView departmentData={data} />}
    </ACLGuard>
  );
}
