import { Helmet } from 'react-helmet-async';

import { ModalProvider } from 'src/context/Modal';

import CompaniesTableView from 'src/sections/super-admin/tables/view/companies-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: companies Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <ModalProvider>
        <CompaniesTableView />
      </ModalProvider>
    </>
  );
}
