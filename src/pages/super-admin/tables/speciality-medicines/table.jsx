import { Helmet } from 'react-helmet-async';

import SpecialityMedicinesView from 'src/sections/super-admin/tables/view/speciality-medicines-view';

// ----------------------------------------------------------------------

export default function SpecialityMedicinesPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Speciality Medicines</title>
      </Helmet>

      <SpecialityMedicinesView />
    </>
  );
}
