import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { HTMLToText } from 'src/utils/convert-to-html';

import { useGetEmployeeEngagement } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import DoctorPageView from 'src/sections/home/view/doctor-page';
// ----------------------------------------------------------------------

function buildPhysicianJsonLd(data, curLangAr) {
  if (!data?.employee) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: curLangAr ? data.employee.name_arabic : data.employee.name_english,
  };

  if (data.employee.picture) jsonLd.image = data.employee.picture;
  if (data.employee.speciality) {
    jsonLd.medicalSpecialty = curLangAr
      ? data.employee.speciality.name_arabic
      : data.employee.speciality.name_english;
  }
  if (data.employee.phone) jsonLd.telephone = data.employee.phone;
  if (data.unit_service?.address) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: data.unit_service.address,
    };
  }
  if (data.employee.rate && data.employee.rated_times) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.employee.rate,
      reviewCount: data.employee.rated_times,
    };
  }

  return jsonLd;
}

export default function DoctorPage() {
  const { name } = useParams();
  const [id, doctor] = name.split('_');

  const { data } = useGetEmployeeEngagement(id);

  const { onChangeLang } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  useEffect(() => {
    const arabicRegex = /^[؀-ۿ0-9\s!@#$%^&*_\-().]*$/;
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

  const title = curLangAr ? data?.employee?.name_arabic : data?.employee?.name_english;
  const description = `${curLangAr ? arabic_about_me : about_me} ${
    curLangAr ? 'تكلفة الموعد بعد الخصم' : 'appointment price after discount'
  }
           ${data?.fees_after_discount ? data?.fees_after_discount : data?.fees}
            ${curLangAr ? 'دينار' : 'JOD'}`;
  const jsonLd = buildPhysicianJsonLd(data, curLangAr);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        {/* eslint-disable-next-line */}
        <meta name="description" content={description} />
        <meta property="og:type" content="profile" />
        {title && <meta property="og:title" content={title} />}
        {description && <meta property="og:description" content={description} />}
        {data?.employee?.picture && <meta property="og:image" content={data.employee.picture} />}
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      {data && <DoctorPageView employeeData={data} />}
    </>
  );
}
