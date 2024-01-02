import { Helmet } from 'react-helmet-async';

import EntranceManagementEditView from 'src/sections/employee/entranceManagement/view/edit';
import { useGetAppointment } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function EditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetAppointment(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title> Edit {name||''} Appointment</title>
      </Helmet>

      {data &&<EntranceManagementEditView appointmentData={data} />}
    </>
  );
}
