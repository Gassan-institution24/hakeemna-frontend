import { useParams } from 'react-router-dom';
import UnitServiceVideoCallsTableView from 'src/sections/unit-service/videocalls/UnitServiceVideoCallsTableView';
import { useAuthContext } from 'src/auth/hooks';
import { Helmet } from 'react-helmet-async';

// ----------------------------------------------------------------------

export default function UnitServiceVideoCallsPage() {
  const { user } = useAuthContext();
  const serviceUnitId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?._id;
  return (
    <>
      <Helmet>
        <title>unit of service : Video Calls</title>
        <meta name="description" content="meta" />
      </Helmet>
      <UnitServiceVideoCallsTableView unitServiceId={serviceUnitId} />
    </>
  );
}
