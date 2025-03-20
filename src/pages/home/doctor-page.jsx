import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { HTMLToText } from 'src/utils/convert-to-html';

import { useGetEmployeeEngagement } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import DoctorPageView from 'src/sections/home/view/doctor-page';
// ----------------------------------------------------------------------

export default function DoctorPage() {
  const { name } = useParams();
  const [id, doctor] = name.split('_');

  const { data } = useGetEmployeeEngagement(id);

  const { onChangeLang } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  useEffect(() => {
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-().]*$/;
    if (arabicRegex.test(doctor.replace(/-/g, ''))) {
      if (!curLangAr) {
        onChangeLang('ar');
      }
    } else if (curLangAr) {
      onChangeLang('en');
    }
  }, [doctor, curLangAr, onChangeLang]);
  const { text: about_me } = HTMLToText(data?.employee?.about_me);
  const { text: arabic_about_me } = HTMLToText(data?.employee?.arabic_about_me);
  console.log(about_me);
  return (
    <>
      <Helmet>
        <title>{curLangAr ? data?.employee?.name_arabic : data?.employee?.name_english}</title>
        {/* eslint-disable-next-line */}
        <meta
          name="description"
          content={`${curLangAr ? arabic_about_me : about_me} ${
            curLangAr ? 'تكلفة الموعد بعد الخصم' : 'appointment price after discount'
          }
           ${data?.fees_after_discount ? data?.fees_after_discount : data?.fees}
            ${curLangAr ? 'دينار' : 'JOD'}`}
        />
      </Helmet>

      {data && <DoctorPageView employeeData={data} />}
    </>
  );
}
