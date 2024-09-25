import { Helmet } from 'react-helmet-async';

import HomeView from 'src/sections/home/view/home-view';
import { useTranslate } from '../../locales/index'

// ----------------------------------------------------------------------

export default function HomePage() {
  const { t } = useTranslate()
  return (
    <>
      <Helmet>
        <title>Hakeemna medical community 360 - مجتمع حكيمنا الطبي </title>
        <meta
          name="description"
          content={t("Hakeemna is an electronic health care system EHR provides ultimate services such as booking medical appointment and management of  hospitals ,clinics and medical labs.")}
        />
      </Helmet>

      <HomeView />
    </>
  );
}
