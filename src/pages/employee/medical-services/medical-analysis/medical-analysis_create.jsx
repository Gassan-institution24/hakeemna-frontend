import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/employee/medical-services/medical-analysis/medical-analysis_create';

// ----------------------------------------------------------------------
export default function MedicalAnalysisCreatePage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: medical analysis create</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}