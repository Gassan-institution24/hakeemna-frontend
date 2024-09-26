import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

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
  const stripHtmlTags = (html) => {
    if (!html) return '';
    return html.replace(/<\/?[^>]+(>|$)/g, '');
  };
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
  return (
    <>
      <Helmet>
        <title>{curLangAr ? data?.employee?.name_arabic : data?.employee?.name_english}</title>
        <meta
          name="description"
          content={
            curLangAr
              ? stripHtmlTags(data?.employee?.arabic_about_me)
              : stripHtmlTags(data?.employee?.about_me)
          }
        />
      </Helmet>

      {data && <DoctorPageView employeeData={data} />}
    </>
  );
}
