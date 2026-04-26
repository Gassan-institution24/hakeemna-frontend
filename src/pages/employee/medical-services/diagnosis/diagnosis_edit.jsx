import { Helmet } from 'react-helmet-async';

import DiagnosisEditView from 'src/sections/employee/medical-services/diagnosis/diagnosis_edit';

export default function FavoriteDiagnosisEditPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Update Favorite Diagnosis</title>
        <meta name="description" content="Edit favorite diagnosis" />
      </Helmet>
      <DiagnosisEditView />
    </>
  );
}
