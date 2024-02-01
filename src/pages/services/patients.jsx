import { Helmet } from 'react-helmet-async';
import Patientservices from 'src/sections/home/view/patientservices';
// ----------------------------------------------------------------------

export default function patients() {
  return (
    <>
      <Helmet>
        <title>Patientservices</title>
      </Helmet>

      <Patientservices />
    </>
  );
}
