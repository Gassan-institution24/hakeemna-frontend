import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetUnitservice } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import UnitServiceEmployees from 'src/sections/super-admin/unitservices/employees/view/index';
// ----------------------------------------------------------------------

export default function ServiceUnitEmployeesPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} employees </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <UnitServiceEmployees unitServiceData={data} />}
    </>
  );
}
