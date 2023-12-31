import { Helmet } from 'react-helmet-async';
import Communication from 'src/sections/unit-service/communication/view/home'
// ----------------------------------------------------------------------

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>Communication</title>
      </Helmet>

      <Communication />
    </>
  );
}
