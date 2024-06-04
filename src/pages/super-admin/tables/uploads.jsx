import { Helmet } from 'react-helmet-async';

import { UploadsTableView } from 'src/sections/super-admin/tables/view';

// ----------------------------------------------------------------------

export default function UploadsTablePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Uploads Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <UploadsTableView />
    </>
  );
}
