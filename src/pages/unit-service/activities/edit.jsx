import { Helmet } from 'react-helmet-async';

import EditActivityView from 'src/sections/unit-service/activities/view/edit';
import { useGetActivity } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function ActivityEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetActivity(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>Edit {name||''} Activity</title>
      </Helmet>

      {data &&<EditActivityView activityData={data} />}
    </>
  );
}
