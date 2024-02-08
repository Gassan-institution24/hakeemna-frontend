import { Helmet } from 'react-helmet-async';
import { useTranslate } from 'src/locales';

import { Emergency } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function EmergencyStatus() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title>{t('Emergency')}</title>
      </Helmet>

      <Emergency />
    </>
  );
}
