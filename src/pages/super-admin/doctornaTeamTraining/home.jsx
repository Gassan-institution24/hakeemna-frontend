import { Helmet } from 'react-helmet-async';

import DoctornaTeamTraining from 'src/sections/super-admin/doctornaTeamTraining/home';
// ----------------------------------------------------------------------

export default function DoctornaTeamTrainingPage() {
  return (
    <>
      <Helmet>
        <title>hakeemna Team Training</title>
        <meta name="description" content="meta" />
      </Helmet>

      <DoctornaTeamTraining />
    </>
  );
}
