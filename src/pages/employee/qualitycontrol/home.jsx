import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import QualityControlView from 'src/sections/employee/qualitycontrol/view/home';
// ----------------------------------------------------------------------

export default function QualityControlPage() {
  const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title> {user?.employee?.name_english || 'employee'} : Quality Control</title>
        <meta name="description" content="meta" />
      </Helmet>

      <QualityControlView />
    </>
  );
}
