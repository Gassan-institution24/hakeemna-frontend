import { Helmet } from 'react-helmet-async';

import QualityControl from 'src/sections/super-admin/qualityControl/doctorna-QC/homepage';

// ----------------------------------------------------------------------

export default function QualityControlPage() {
  return (
    <>
      <Helmet>
        <title> Doctorna Quality Control</title>
        <meta name="description" content="meta" />
      </Helmet>

      <QualityControl />
    </>
  );
}
