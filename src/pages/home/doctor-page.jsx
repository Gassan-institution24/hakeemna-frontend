import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useLocales } from 'src/locales';
import { useGetEmployeeEngagement } from 'src/api';

import DoctorPageView from 'src/sections/home/view/doctor-page';
// ----------------------------------------------------------------------

export default function DoctorPage() {
  const { name } = useParams();
  const { data } = useGetEmployeeEngagement(name);

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  return (
    <>
      <Helmet>
        <title>{curLangAr ? data?.employee?.name_arabic : data?.employee?.name_english}</title>
        <meta name="description" content={curLangAr ? data?.employee?.arabic_about_me : data?.employee?.about_me} />
      </Helmet>

      {data && <DoctorPageView employeeData={data} />}
    </>
  );
}
