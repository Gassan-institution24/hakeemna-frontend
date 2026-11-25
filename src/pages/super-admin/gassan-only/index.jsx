import { Helmet } from 'react-helmet-async';

import GassanImportView from 'src/sections/super-admin/gassan-only/gassan-import-view';

// ----------------------------------------------------------------------

export default function GassanOnlyPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Gassan only</title>
      </Helmet>

      <GassanImportView />
    </>
  );
}
