import { Helmet } from 'react-helmet-async';

import StakeholdersView from 'src/sections/stakeholders/home/homepage';

// ----------------------------------------------------------------------

export default function StakeholderHomePage() {
  return (
    <>
      <Helmet>
        <title> stakeholders</title>
      </Helmet>

      <StakeholdersView />
    </>
  );
}
