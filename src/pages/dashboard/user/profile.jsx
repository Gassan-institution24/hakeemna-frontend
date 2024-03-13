import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { UserProfileView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserProfilePage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Profile')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <UserProfileView />
    </>
  );
}
