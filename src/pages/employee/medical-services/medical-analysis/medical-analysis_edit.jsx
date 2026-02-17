import { Helmet } from 'react-helmet-async';

import TableCreateView from 'src/sections/employee/medical-services/medical-analysis/medical-analysis_edit';

// ----------------------------------------------------------------------
export default function MedicalAnalysisEditPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: medical analysis edit</title>
        <meta name="description" content="meta" />
      </Helmet>

      <TableCreateView />
    </>
  );
}
