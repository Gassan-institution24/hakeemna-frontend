import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetRoom } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import RoomEditView from 'src/sections/unit-service/tables/rooms/view/edit';

// ----------------------------------------------------------------------

export default function RoomEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetRoom(id);

  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;

  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="update">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Edit Room</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <RoomEditView roomData={data} />}
    </ACLGuard>
  );
}
