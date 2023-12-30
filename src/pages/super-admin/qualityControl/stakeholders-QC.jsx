import { Helmet } from 'react-helmet-async';

import QualityControl from 'src/sections/super-admin/qualityControl/stakeholders-QC/quality-control-table';

// ----------------------------------------------------------------------

export default function QualityControlPage() {
  return (
    <>
      <Helmet>
        <title> Stakeholders Quality Control</title>
      </Helmet>

      <QualityControl />
    </>
  );
}
