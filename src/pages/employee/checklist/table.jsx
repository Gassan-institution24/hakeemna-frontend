import { Helmet } from 'react-helmet-async';

import ClinicQuestionnairesView from 'src/sections/shared/questionnaires/clinic-questionnaires-view';

// ----------------------------------------------------------------------

export default function TableDetailsPage() {
  return (
    <>
      <Helmet>
        <title> Dashboard: Questionnaires</title>
      </Helmet>

      <ClinicQuestionnairesView />
    </>
  );
}
