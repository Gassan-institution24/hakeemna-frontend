import { Helmet } from 'react-helmet-async';

import Communication from 'src/sections/super-admin/communication/home/homepage';
import { useGetUnitservice } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';

// ----------------------------------------------------------------------

export default function CommunicationPage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetUnitservice(id);
  const unitServiceName = data?.name_english || 'unit service';
  return (
    <>
      <Helmet>
        <title> {unitServiceName} Accounting</title>
      </Helmet>

      <Communication unitServiceData={data} />
    </>
  );
}
