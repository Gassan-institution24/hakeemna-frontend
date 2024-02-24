import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';

import { UserAppointmentsBook } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function Bookdoctor() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Book appointment')} </title>
      </Helmet>

      <UserAppointmentsBook />
    </>
  );
}
