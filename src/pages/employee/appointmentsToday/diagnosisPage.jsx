import { Helmet } from 'react-helmet-async';

import DiagnosisPage from 'src/sections/employee/appointmentsToday/diagnosis-page';

export default function DiagnosisPageView() {
  return (
    <>
      <Helmet>
        <title>Diagnosis</title>
        <meta name="description" content="Patient diagnosis details" />
      </Helmet>
      <DiagnosisPage />
    </>
  );
}
