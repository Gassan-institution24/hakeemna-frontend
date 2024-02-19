import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetUnitservice } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import UnitServiceDepartments from 'src/sections/super-admin/unitservices/departments/view/home';
// ----------------------------------------------------------------------

export default function ServiceUnitDepartmentsPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} departments </title>
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <UnitServiceDepartments unitServiceData={data} />}
    </>
  );
}
