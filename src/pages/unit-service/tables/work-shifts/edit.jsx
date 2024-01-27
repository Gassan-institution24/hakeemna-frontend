import { Helmet } from 'react-helmet-async';

import WorkShiftEditView from 'src/sections/unit-service/tables/work-shifts/view/edit';
import { useGetWorkShift } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
import ACLGuard from 'src/auth/guard/acl-guard';
import { LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export default function WorkShiftEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetWorkShift(id);
  const name = data?.name_english;
  return (
    <>
      <ACLGuard hasContent category="appointment_config" acl="update">
        <Helmet>
          <title>Edit {name || ''} Work Shift</title>
        </Helmet>
        {loading&& <LoadingScreen/>}
        {!loading && <WorkShiftEditView workShiftData={data} />}
      </ACLGuard>
    </>
  );
}
