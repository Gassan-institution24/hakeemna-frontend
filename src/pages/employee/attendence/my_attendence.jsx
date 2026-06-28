import { Helmet } from 'react-helmet-async';

import ACLGuard from 'src/auth/guard/acl-guard';

import MyAttendence from 'src/sections/employee/attendence/attendence-view';
// ----------------------------------------------------------------------

export default function MyAttendencePage() {
  return (
    <ACLGuard permission="appointments:read">
      <Helmet>
        <title> My attendence </title>
        <meta name="description" content="meta" />
      </Helmet>
      <MyAttendence />
    </ACLGuard>
  );
}
