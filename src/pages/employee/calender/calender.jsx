import { Helmet } from 'react-helmet-async';

import { CalendarView } from 'src/sections/employee/calendar/view/index';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Calendar</title>
        <meta name="description" content="meta" />
      </Helmet>
      <CalendarView />
    </>
  );
}
