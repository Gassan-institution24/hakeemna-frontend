import { Helmet } from 'react-helmet-async';

import WorkShiftEditView from 'src/sections/unit-service/tables/work-shifts/view/edit';
import { useGetWorkShift } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function WorkShiftEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetWorkShift(id);
  const name = data?.name_english
  return (
    <>
      <Helmet>
        <title>Edit {name||''} Work Shift</title>
      </Helmet>

      {data && <WorkShiftEditView workShiftData={data} />}
    </>
  );
}
