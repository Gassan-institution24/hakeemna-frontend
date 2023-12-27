import { Helmet } from 'react-helmet-async';

import QualityControl from 'src/sections/super-admin/qualityControl/unit-services-QC/quality-control-table';

// ----------------------------------------------------------------------

export default function QualityControlPage() {
  return (
    <>
      <Helmet>
        <title> Unit Services Quality Control</title>
      </Helmet>

      <QualityControl />
    </>
  );
}
