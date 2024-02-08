import { Helmet } from 'react-helmet-async';
import { useTranslate } from 'src/locales';

import { AccountView } from 'src/sections/other/account/view';

// ----------------------------------------------------------------------

export default function AccountPage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Account Settings')} </title>
      </Helmet>

      <AccountView />
    </>
  );
}
