import { Helmet } from 'react-helmet-async';

import { useAuthContext } from 'src/auth/hooks';

import StakeholderProfileView from 'src/sections/stakeholder/profile/view/home';

// ----------------------------------------------------------------------

export default function StakeholderProfilePage() {
  const { user } = useAuthContext();
  return (
    <>
      <Helmet>
        <title> {user?.stakeholder?.name_english || 'stakeholder'} : Profile</title>
        <meta name="description" content="meta" />
      </Helmet>

      <StakeholderProfileView />
    </>
  );
}
