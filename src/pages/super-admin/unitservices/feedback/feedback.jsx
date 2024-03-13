import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useGetUnitservice } from 'src/api';

import { LoadingScreen } from 'src/components/loading-screen';

import UnitServiceFeedback from 'src/sections/super-admin/unitservices/feedback/feedback';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data, loading } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Feedback </title>
        <meta name="description" content="meta" />
      </Helmet>
      {loading && <LoadingScreen />}
      {!loading && <UnitServiceFeedback unitServiceData={data} />}
    </>
  );
}
