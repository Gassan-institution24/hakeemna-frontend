/* eslint-disable import/no-unresolved */

import { Helmet } from 'react-helmet-async';

import FavoriteDiagnosisList from 'src/sections/employee/medical-services/diagnosis/diagnosis';

export default function FavoriteDiagnosisPage() {
  return (
    <>
      <Helmet>
        <title>Dashboard: Favorite Diagnosis</title>
        <meta name="description" content="Favorite diagnosis lists" />
      </Helmet>
      <FavoriteDiagnosisList />
    </>
  );
}
