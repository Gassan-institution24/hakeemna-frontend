import { Helmet } from 'react-helmet-async';

import AppointmentTypeEditView from 'src/sections/unit-service/tables/appointment-types/view/edit';
import { useGetAppointmentType } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function AppointmentTypeEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetAppointmentType(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>Edit {name} Appointment Type</title>
      </Helmet>

      {data && <AppointmentTypeEditView appointmentTypeData={data} />}
    </>
  );
}
