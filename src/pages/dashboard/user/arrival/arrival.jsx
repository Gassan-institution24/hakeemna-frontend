import { Helmet } from 'react-helmet-async';
import { useTranslate } from 'src/locales';
import { ConfirmArrival } from 'src/sections/user/arrival';

export default function ArrivalPage() {
  const { t } = useTranslate();

  return (
    <>
      <Helmet>
        <title> {t('Confirm Arrival')} </title>
      </Helmet>
      <ConfirmArrival />
    </>
  );
}