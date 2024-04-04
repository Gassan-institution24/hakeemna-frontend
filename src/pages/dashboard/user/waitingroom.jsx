import { Helmet } from 'react-helmet-async';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientOneAppointments } from 'src/api';

import WatingRoom from 'src/sections/user/waitingRoom';
// ----------------------------------------------------------------------

export default function Watingroomstatus() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientOneAppointments(user?.patient?._id);

  return (
    <>
      <Helmet>
        <title>{t('watingroom')}</title>
        <meta name="description" content="meta" />
      </Helmet>
      {appointmentsData?.work_group?.employees?.map((info, index) => (
        <WatingRoom key={index} employeeId={info} />
      ))}
    </>
  );
}
