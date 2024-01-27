import { Helmet } from 'react-helmet-async';
import QualityControlView from 'src/sections/employee/qualitycontrol/view/home';
// ----------------------------------------------------------------------

export default function QualityControlPage() {
  return (
    <>
      <Helmet>
        <title>Quality Control</title>
      </Helmet>

      <QualityControlView />
    </>
  );
}
