import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetAppointment } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import EntranceManagementEditView from 'src/sections/employee/entranceManagement/view/edit';

// ----------------------------------------------------------------------

export default function EditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetAppointment(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="employee" subcategory="entrance_management" acl="update">
      <Helmet>
        <title> Edit {name || ''} Appointment</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <EntranceManagementEditView appointmentData={data} />}
    </ACLGuard>
  );
}
