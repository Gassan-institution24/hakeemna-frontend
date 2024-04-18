import { Helmet } from 'react-helmet-async';

import QualityControl from 'src/sections/super-admin/qualityControl/unit-services-QC/quality-control-table';

// ----------------------------------------------------------------------

export default function QualityControlPage() {
  return (
    <>
      <Helmet>
        <title> unit of services Quality Control</title>
        <meta name="description" content="meta" />
      </Helmet>

      <QualityControl />
    </>
  );
}
