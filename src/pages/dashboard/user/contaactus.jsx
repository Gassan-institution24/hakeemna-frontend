import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserEditPage() {

  const { t } = useTranslate();



  return (
    <>
      <Helmet>
        <title> {t('contact us')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <UserEditView/>
    </>
  );
}
