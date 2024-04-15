import { Helmet } from 'react-helmet-async';

import { CalendarView } from 'src/sections/super-admin/calendar/view/index';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  return (
    <>
      <Helmet>
        <title> Hakeemna : Calendar</title>
        <meta name="description" content="meta" />
      </Helmet>
      <CalendarView />
    </>
  );
}
