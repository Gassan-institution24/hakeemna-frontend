import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import { CalendarView } from 'src/sections/employee/calendar/view/index';

// ----------------------------------------------------------------------

export default function CalendarPage() {
  const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title> {user?.employee?.name_english} : Calendar</title>
        <meta name="description" content="meta" />
      </Helmet>
      <CalendarView />
    </>
  );
}
