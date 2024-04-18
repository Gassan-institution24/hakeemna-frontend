import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetServiceType } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';
import { useAuthContext } from 'src/auth/hooks';

import ServiceEditView from 'src/sections/unit-service/tables/services/view/edit';

// ----------------------------------------------------------------------

export default function ServiceEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetServiceType(id);

  const { user } = useAuthContext();
  const serviceUnitName =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service
      ?.name_english;

  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="update">
      <Helmet>
        <title>{serviceUnitName || 'unit of service'} : Edit Service</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <ServiceEditView serviceData={data} />}
    </ACLGuard>
  );
}
