import { Helmet } from 'react-helmet-async';

import DiagnosisCreateView from 'src/sections/employee/medical-services/diagnosis/diagnosis_create';

export default function FavoriteDiagnosisCreatePage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Create Favorite Diagnosis</title>
        <meta name="description" content="Create favorite diagnosis" />
      </Helmet>
      <DiagnosisCreateView />
    </>
  );
}
