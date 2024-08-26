import { Helmet } from 'react-helmet-async';

import { useParams } from 'src/routes/hooks';

import { useLocales } from 'src/locales';
import { useGetUnitservice } from 'src/api';

import ServiceUnitView from 'src/sections/home/view/unit-service-page';

// ----------------------------------------------------------------------

export default function ServiceUnitPage() {
  const params = useParams();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { id } = params;
  const { data, loading } = useGetUnitservice(id);

  return (
    <>
      <Helmet>
        <title> {curLangAr ? data?.name_arabic || '' : data?.name_english || ''}</title>
        <meta
          name="description"
          content={curLangAr ? data?.arabic_introduction_letter : data?.introduction_letter}
        />
      </Helmet>

      {data && !loading && <ServiceUnitView USData={data} />}
    </>
  );
}
