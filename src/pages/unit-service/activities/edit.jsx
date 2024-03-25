import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetActivity } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import { LoadingScreen } from 'src/components/loading-screen';

import EditActivityView from 'src/sections/unit-service/activities/view/edit';

// ----------------------------------------------------------------------

export default function ActivityEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetActivity(id);
  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="update">
      <Helmet>
        <title> {serviceUnitName || 'Service unit'} : Edit Activity</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <EditActivityView activityData={data} />}
    </ACLGuard>
  );
}
