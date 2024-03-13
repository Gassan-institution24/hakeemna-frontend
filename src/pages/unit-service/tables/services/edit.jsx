import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetServiceType } from 'src/api';
import ACLGuard from 'src/auth/guard/acl-guard';

import ServiceEditView from 'src/sections/unit-service/tables/services/view/edit';

// ----------------------------------------------------------------------

export default function ServiceEditPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetServiceType(id);
  const name = data?.name_english;
  return (
    <ACLGuard category="unit_service" subcategory="management_tables" acl="update">
      <Helmet>
        <title>Edit {name || ''} Service</title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <ServiceEditView serviceData={data} />}
    </ACLGuard>
  );
}
