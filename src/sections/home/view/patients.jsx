
// import { useResponsive } from 'src/hooks/use-responsive';

import PatientsHero from '../hero/patients-hero';
import PatientsServices from '../patientservices';
// ----------------------------------------------------------------------

export default function HomeView() {
  // const mdUp = useResponsive('up', 'md');

  return (
    <>
      <PatientsHero/>
      <PatientsServices />
    </>
  );
}
