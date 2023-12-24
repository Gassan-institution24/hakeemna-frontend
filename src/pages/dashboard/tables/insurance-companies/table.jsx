import { Helmet } from 'react-helmet-async';

import InsuranceCompaniesTableView from 'src/sections/super-admin/tables/view/Insurance-companies-table-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Insurance Companies Table</title>
      </Helmet>

      <InsuranceCompaniesTableView />
    </>
  );
}
