import { Helmet } from 'react-helmet-async';

import TicketCategoriesTableView from 'src/sections/super-admin/tables/view/ticket-categoies-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Ticket categories Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TicketCategoriesTableView />
    </>
  );
}
