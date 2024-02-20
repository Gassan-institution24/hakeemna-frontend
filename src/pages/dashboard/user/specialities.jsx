import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import Specialities from 'src/sections/user/specialities';
// ----------------------------------------------------------------------

export default function Specialitiess() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>{t('specialities')}</title>
      </Helmet>

      <Specialities />
    </>
  );
}
