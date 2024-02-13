import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetAppointmentType } from 'src/api';

import AppointmentTypeEditView from 'src/sections/unit-service/tables/appointment-types/view/edit';

// ----------------------------------------------------------------------

export default function AppointmentTypeEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetAppointmentType(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>Edit {name || ''} Appointment Type</title>
      </Helmet>

      {data && <AppointmentTypeEditView appointmentTypeData={data} />}
    </>
  );
}
