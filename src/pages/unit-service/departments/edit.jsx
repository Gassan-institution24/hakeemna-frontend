import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentEditView from 'src/sections/unit-service/departments/view/edit';

// ----------------------------------------------------------------------

export default function DepartmentEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  return (
    <ACLGuard category="unit_service" subcategory="departments" acl="update">
      <Helmet>
        <title>{data.name_english} : Edit Department </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentEditView departmentData={data} />}
    </ACLGuard>
  );
}
