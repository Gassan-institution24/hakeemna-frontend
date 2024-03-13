import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetWorkGroup } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import WorkGroupEditView from 'src/sections/unit-service/tables/work-groups/view/edit';

// ----------------------------------------------------------------------

export default function WorkGroupEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetWorkGroup(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="update">
      <Helmet>
        <title>Edit {name || ''} Work Group</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <WorkGroupEditView workGroupData={data} />}
    </ACLGuard>
  );
}
