import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetWorkShift } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import { LoadingScreen } from 'src/components/loading-screen';

import WorkShiftEditView from 'src/sections/unit-service/tables/work-shifts/view/edit';

// ----------------------------------------------------------------------

export default function WorkShiftEditPage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetWorkShift(id);
  const name = data?.name_english;
  return (
    <ACLGuard hasContent category="unit_service" subcategory="work_shift" acl="update">
      <Helmet>
        <title>Edit {name || ''} Work Shift</title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <WorkShiftEditView workShiftData={data} />}
    </ACLGuard>
  );
}
