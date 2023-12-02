import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import {TablesDetailsView } from 'src/sections/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  const params = useParams();

  const { tablename } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: Order Details</title>
      </Helmet>

      <TablesDetailsView tableName={`${tablename}`} />
    </>
  );
}
