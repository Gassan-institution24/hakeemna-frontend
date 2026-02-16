import { Helmet } from 'react-helmet-async';

import MedicalAnalysisTableView from 'src/sections/super-admin/tables/view/medical_analysis_home';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Medical Analysis Table</title>
        <meta name="description" content="meta" />
      </Helmet>

      <MedicalAnalysisTableView />
    </>
  );
}
