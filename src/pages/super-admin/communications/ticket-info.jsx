import { Helmet } from 'react-helmet-async';
import { useGetTicket } from 'src/api';
import { useParams } from 'src/routes/hooks';

import TicketInfo from 'src/sections/super-admin/communication/view/ticket_info';

// ----------------------------------------------------------------------

export default function TicketInfoPage() {
  const { id } = useParams();
  const { data, refetch } = useGetTicket(id);
  return (
    <>
      <Helmet>
        <title> Ticket info </title>
        <meta name="description" content="meta" />
      </Helmet>

      {data && <TicketInfo ticket={data} refetch={refetch} />}
    </>
  );
}
