import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';

import { Button, Container } from '@mui/material';

import { paths } from 'src/routes/paths';
import { RouterLink } from 'src/routes/components';

import { useGetOneUSPatient } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';
import ACLGuard from 'src/auth/guard/acl-guard';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import PatientDentalChart from 'src/sections/employee/patients/dental-chart/patient-dental-chart';

// ----------------------------------------------------------------------

export default function DentalPatientPage() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();

  const { usPatientData } = useGetOneUSPatient(id, {
    populate: [{ path: 'patient' }],
  });

  const name =
    (curLangAr
      ? usPatientData?.name_arabic || usPatientData?.patient?.name_arabic
      : usPatientData?.name_english || usPatientData?.patient?.name_english) || t('patient');

  return (
    <>
      <Helmet>
        <title> {t('dental chart')} </title>
      </Helmet>

      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={`${t('dental chart')} — ${name}`}
          links={[
            { name: t('dental chart'), href: paths.unitservice.dental.root },
            { name },
          ]}
          action={
            <Button
              component={RouterLink}
              href={paths.unitservice.dental.root}
              startIcon={<Iconify icon="eva:arrow-back-fill" />}
            >
              {t('back')}
            </Button>
          }
          sx={{ mb: 3 }}
        />

        <ACLGuard permission="dental_chart:read">
          {usPatientData?._id && <PatientDentalChart patient={usPatientData} />}
        </ACLGuard>
      </Container>
    </>
  );
}
