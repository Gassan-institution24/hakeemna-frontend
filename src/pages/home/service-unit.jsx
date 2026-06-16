import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useLocales } from 'src/locales';
import { useGetUnitservice } from 'src/api';

import ServiceUnitView from 'src/sections/home/view/unit-service-page';
import { normalizeDay } from 'src/sections/home/components/working-hours-widget';

// ----------------------------------------------------------------------

const SCHEMA_DAY_NAMES = {
  saturday: 'Saturday',
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
};

function buildMedicalClinicJsonLd(data, curLangAr) {
  if (!data) return null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: curLangAr ? data.name_arabic : data.name_english,
  };

  if (data.company_logo) jsonLd.image = data.company_logo;
  if (data.phone) jsonLd.telephone = data.phone;
  if (data.web_page) jsonLd.url = data.web_page;
  if (data.address) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address,
    };
  }
  if (data.rate && data.rate_numbers) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.rate,
      reviewCount: data.rate_numbers,
    };
  }
  if (data.work_days?.length && data.work_start_time && data.work_end_time) {
    jsonLd.openingHoursSpecification = {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: data.work_days.map((day) => SCHEMA_DAY_NAMES[normalizeDay(day)]).filter(Boolean),
      opens: new Date(data.work_start_time).toISOString().slice(11, 16),
      closes: new Date(data.work_end_time).toISOString().slice(11, 16),
    };
  }

  return jsonLd;
}

export default function ServiceUnitPage() {
  const params = useParams();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { id } = params;
  const { data, loading } = useGetUnitservice(id);

  const title = curLangAr ? data?.name_arabic || '' : data?.name_english || '';
  const description = curLangAr ? data?.arabic_introduction_letter : data?.introduction_letter;
  const jsonLd = buildMedicalClinicJsonLd(data, curLangAr);

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:type" content="business.business" />
        {title && <meta property="og:title" content={title} />}
        {description && <meta property="og:description" content={description} />}
        {data?.company_logo && <meta property="og:image" content={data.company_logo} />}
        {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
      </Helmet>

      {data && !loading && <ServiceUnitView USData={data} />}
    </>
  );
}
