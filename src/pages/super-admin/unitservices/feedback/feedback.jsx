import { Helmet } from 'react-helmet-async';

import UnitServiceFeedback from 'src/sections/super-admin/unitservices/feedback/feedback';
import { useGetUnitservice } from 'src/api/tables';
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
        <title> {unitServiceName} Feedback </title>
      </Helmet>

      <UnitServiceFeedback unitServiceData={data} />
    </>
  );
}
