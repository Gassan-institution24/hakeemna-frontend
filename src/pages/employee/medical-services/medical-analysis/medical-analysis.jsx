import { Helmet } from 'react-helmet-async';

import MedicalAnalysis from 'src/sections/employee/medical-services/medical-analysis/medical-analysis';

// ----------------------------------------------------------------------

export default function MedicalAnalysisPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: medical analysis</title>
        <meta name="description" content="meta" />
      </Helmet>

      <MedicalAnalysis />
    </>
  );
}
