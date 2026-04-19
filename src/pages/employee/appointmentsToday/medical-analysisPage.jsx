import { Helmet } from 'react-helmet-async';

import MedicalAnalysisPage from 'src/sections/employee/appointmentsToday/medical-analysis-page';

// ----------------------------------------------------------------------

export default function MedicalAnalysisPageview() {
  return (
    <>
      <Helmet>
        <title>record</title>
        <meta name="description" content="meta" />
      </Helmet>
      <MedicalAnalysisPage />
    </>
  );
}
