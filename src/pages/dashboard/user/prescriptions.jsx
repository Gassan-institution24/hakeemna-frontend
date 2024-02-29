import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { UserListView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserListPage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('My Prescriptions')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <UserListView />
    </>
  );
}
