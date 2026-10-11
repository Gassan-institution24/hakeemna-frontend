import { Helmet } from 'react-helmet-async';

import SpecialityServicesView from 'src/sections/super-admin/tables/speciality-services/speciality-services-view';

// ----------------------------------------------------------------------

export default function SpecialityServicesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Speciality services</title>
      </Helmet>

      <SpecialityServicesView />
    </>
  );
}
