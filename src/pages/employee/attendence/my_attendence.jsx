import { Helmet } from 'react-helmet-async';

import MyAttendence from 'src/sections/employee/attendence/attendence-view';
// ----------------------------------------------------------------------

// NOTE: no ACLGuard here — this is the employee's own profile page and must
// always be accessible regardless of permissions (e.g. appointments:read).
export default function MyAttendencePage() {
  return (
    <>
      <Helmet>
        <title> My attendence </title>
        <meta name="description" content="meta" />
      </Helmet>
      <MyAttendence />
    </>
  );
}
