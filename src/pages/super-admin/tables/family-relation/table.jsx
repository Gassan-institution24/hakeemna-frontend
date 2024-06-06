import { Helmet } from 'react-helmet-async';

import { FamilyRelationTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: family relation Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <FamilyRelationTableView />
    </>
  );
}
