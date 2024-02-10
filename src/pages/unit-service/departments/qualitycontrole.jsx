import { Helmet } from 'react-helmet-async';

import DepartmentQCView from 'src/sections/unit-service/departments/view/quality-control';
import { useGetDepartment } from 'src/api';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function DepartmentQCPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="department" subcategory="quality_control" acl="read">
        <Helmet>
          <title>{name || ''} Department Quality Control</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <DepartmentQCView departmentData={data} />}
      </ACLGuard>
    </>
  );
}
