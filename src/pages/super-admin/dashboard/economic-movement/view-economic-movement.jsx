import { Helmet } from 'react-helmet-async';

import EconomicMovementInfo from 'src/sections/patients/history/economic-movements/show-economic-movement/movement-info';
import { useGetEconomicMovement } from 'src/api/tables';
import { useParams } from 'src/routes/hooks';
// ----------------------------------------------------------------------

export default function TableCreatePage() {
  const params = useParams();
  const { id } = params;
  const { data } = useGetEconomicMovement(id);
  return (
    <>
      <Helmet>
        <title> Economic Movement </title>
      </Helmet>

      {data && <EconomicMovementInfo economicMovementData={data}/>}
    </>
  );
}
