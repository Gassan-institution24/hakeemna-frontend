import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { Family } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Fam() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Family members')} </title>
        <meta name="description" content="meta" />
      </Helmet>

      <Family />
    </>
  );
}
