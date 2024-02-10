import { Helmet } from 'react-helmet-async';

import { CommunicationListView } from 'src/sections/super-admin/unitservices/communications/view';
import { useGetUnitservice } from 'src/api';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Communications </title>
      </Helmet>

      <CommunicationListView unitServiceData={data} />
    </>
  );
}
