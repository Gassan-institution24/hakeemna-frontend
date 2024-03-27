import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetUnitservice } from 'src/api';

import UnitServiceAppointemnts from 'src/sections/super-admin/unitservices/appointments/view/home';
// ----------------------------------------------------------------------

export default function ServiceUnitAppointmentsPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetUnitservice(id);
  // const { appointmentsData, loading } = useGetUSAppointments(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} appointments </title>
        <meta name="description" content="meta" />
      </Helmet>
      {/* {loading && <LoadingScreen />} */}
      {/* {!loading && ( */}
      <UnitServiceAppointemnts unitServiceData={data} />
      {/* )} */}
    </>
  );
}
