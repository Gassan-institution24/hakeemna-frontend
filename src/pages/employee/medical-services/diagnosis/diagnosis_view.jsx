import { Helmet } from 'react-helmet-async';

import FavoriteDiagnosisViewPage from 'src/sections/employee/medical-services/diagnosis/diagnosis_view';

export default function FavoriteDiagnosisViewPageWrapper() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Favorite Diagnosis Details</title>
        <meta name="description" content="View favorite diagnosis" />
      </Helmet>
      <FavoriteDiagnosisViewPage />
    </>
  );
}
