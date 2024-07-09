import { Helmet } from 'react-helmet-async';
import { useGetEmployeeEngagement } from 'src/api';
import { useLocales } from 'src/locales';
import { useParams } from 'src/routes/hooks';

import DoctorPageView from 'src/sections/home/view/doctor-page';
// ----------------------------------------------------------------------

export default function DoctorPage() {
    const { name } = useParams()
    const { data } = useGetEmployeeEngagement(name)

    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';
    return (
        <>
            <Helmet>
                <title>{curLangAr ? data?.employee?.name_arabic : data?.employee?.name_english}</title>
                <meta name="description" content="meta" />
            </Helmet>

            {data && <DoctorPageView employeeData={data} />}
        </>
    );
}
