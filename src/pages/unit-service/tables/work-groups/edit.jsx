import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetWorkGroup } from 'src/api';

import WorkGroupEditView from 'src/sections/unit-service/tables/work-groups/view/edit';

// ----------------------------------------------------------------------

export default function WorkGroupEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetWorkGroup(id);
  const name = data?.name_english;
  return (
    <>
      <Helmet>
        <title>Edit {name || ''} Work Group</title>
      </Helmet>

      {data && <WorkGroupEditView workGroupData={data} />}
    </>
  );
}
