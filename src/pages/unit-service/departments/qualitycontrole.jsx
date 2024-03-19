import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetDepartment } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import DepartmentQCView from 'src/sections/unit-service/departments/view/quality-control';

// ----------------------------------------------------------------------

export default function DepartmentQCPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetDepartment(id);
  return (
    // <ACLGuard category="department" subcategory="quality_control" acl="read">
    <>
      <Helmet>
        <title>{data.name_english || 'Deartment'} : Quality Control</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <DepartmentQCView departmentData={data} />}
    </>
    // </ACLGuard>
  );
}
