import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetWorkGroup } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import WorkGroupEditView from 'src/sections/unit-service/tables/work-groups/view/edit';

// ----------------------------------------------------------------------

export default function WorkGroupEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetWorkGroup(id);

  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;

  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="update">
      <Helmet>
        <title>{serviceUnitName || 'Service unit'} : Edit Work Group</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <WorkGroupEditView workGroupData={data} />}
    </ACLGuard>
  );
}
