import { Helmet } from 'react-helmet-async';
import QualityControlView from 'src/sections/unit-service/qualitycontrol/view/home'
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
