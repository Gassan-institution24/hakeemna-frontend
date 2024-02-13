import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetActivity } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import EditActivityView from 'src/sections/unit-service/activities/view/edit';

// ----------------------------------------------------------------------

export default function ActivityEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetActivity(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="unit_service" subcategory="activities" acl="update">
        <Helmet>
          <title>Edit {name || ''} Activity</title>
        </Helmet>
        {loading && <LoadingScreen />}
        {!loading && <EditActivityView activityData={data} />}
      </ACLGuard>
  );
}
