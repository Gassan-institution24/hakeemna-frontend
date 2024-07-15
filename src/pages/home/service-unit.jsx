import { Helmet } from 'react-helmet-async';
import { useGetUnitservice } from 'src/api';
import { useLocales } from 'src/locales';

import { useParams } from 'src/routes/hooks';

import ServiceUnitView from 'src/sections/home/view/unit-service-page';

// ----------------------------------------------------------------------

export default function ServiceUnitPage() {
    const params = useParams();
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    const { id } = params;
    const { data, loading } = useGetUnitservice(id)

    return (
        <>
            <Helmet>
                <title> {curLangAr ? data?.name_arabic || '' : data?.name_english || ''}</title>
            </Helmet>

            {data && !loading && <ServiceUnitView USData={data} />}
        </>
    );
}
