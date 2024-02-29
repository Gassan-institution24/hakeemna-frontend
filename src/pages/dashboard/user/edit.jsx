import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useTranslate } from 'src/locales';

import { UserEditView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserEditPage() {
  const params = useParams();
  const { t } = useTranslate();

  const { id } = params;

  return (
    <>
      <Helmet>
        <title> {t('contact us')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <UserEditView id={`${id}`} />
    </>
  );
}
