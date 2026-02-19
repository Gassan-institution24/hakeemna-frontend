import { Helmet } from 'react-helmet-async';

import MedicalAnalysisView from 'src/sections/employee/medical-services/medical-analysis/medical-analysis_view';

// ----------------------------------------------------------------------   

export default function MedicalAnalysisViewPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: medical analysis view</title>
        <meta name="description" content="meta" />
      </Helmet>

        <MedicalAnalysisView />
    </>
  );
}
