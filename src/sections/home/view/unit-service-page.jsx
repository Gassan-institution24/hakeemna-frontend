import PropTypes from 'prop-types';
import { useRef, useMemo } from 'react';

import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Container from '@mui/material/Container';

import { useLocales, useTranslate } from 'src/locales';
import { useGetUSFeedbackes, useGetUSActiveEmployeeEngs } from 'src/api';

import Iconify from 'src/components/iconify';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import MapEmbed from '../components/map-embed';
import ClinicHero from '../clinic/clinic-hero';
import ClinicAbout from '../clinic/clinic-about';
import FaqSection from '../components/faq-section';
import ClinicServices from '../clinic/clinic-services';
import SectionHeading from '../components/section-heading';
import ReviewsSection from '../components/reviews-section';
import ClinicDepartments from '../clinic/clinic-departments';
import ClinicDoctorsList from '../clinic/clinic-doctors-list';
import StickyBookingBar from '../components/sticky-booking-bar';
import { normalizeDay } from '../components/working-hours-widget';
import ClinicRelatedCarousel from '../clinic/clinic-related-carousel';

// ----------------------------------------------------------------------

export default function UnitServicePage({ USData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const {
    _id,
    name_english,
    name_arabic,
    address,
    location_gps,
    phone,
    sector_type,
    city,
    work_days,
    insurance,
    rate,
    rate_numbers,
  } = USData;

  const { employeesData } = useGetUSActiveEmployeeEngs(_id, {
    populate: 'employee unit_service department nationality insurance country city',
  });
  const { feedbackData } = useGetUSFeedbackes(_id);

  const doctorsSectionRef = useRef(null);
  const locationSectionRef = useRef(null);

  const scrollToDoctors = () => doctorsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  const scrollToLocation = () => locationSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  const callNow = () => {
    window.location.href = `tel:${phone}`;
  };

  const faqItems = useMemo(
    () => [
      work_days?.length > 0 && {
        question: t('what are the working hours'),
        answer:
          work_days.length === 7
            ? t('All days')
            : work_days.map((day) => t(normalizeDay(day))).join(', '),
      },
      insurance?.length > 0 && {
        question: t('does this clinic accept insurance'),
        answer: insurance.map((one) => (curLangAr ? one.name_arabic : one.name_english)).join(', '),
      },
    ],
    [work_days, insurance, curLangAr, t]
  );

  return (
    <Container sx={{ my: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <CustomBreadcrumbs
          links={[
            { name: t('home'), href: '/' },
            { name: curLangAr ? name_arabic : name_english },
          ]}
        />

        <ClinicHero USData={USData} onGetDirections={scrollToLocation} />

        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Button
            variant="contained"
            size="large"
            startIcon={<Iconify icon="solar:calendar-add-bold" />}
            onClick={scrollToDoctors}
          >
            {t('book appointment')}
          </Button>
          {phone && (
            <Button
              variant="outlined"
              color="inherit"
              size="large"
              startIcon={<Iconify icon="solar:phone-bold" />}
              onClick={callNow}
            >
              {t('call now')}
            </Button>
          )}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <ClinicAbout USData={USData} />

        {/* <Divider sx={{ borderStyle: 'dashed' }} /> */}

        {/* <ClinicDepartments unitServiceId={_id} /> */}

        {/* <ClinicServices unitServiceId={_id} onViewDoctors={scrollToDoctors} /> */}

        <Divider sx={{ borderStyle: 'dashed' }} />

        <div ref={doctorsSectionRef}>
          <ClinicDoctorsList employees={employeesData} />
        </div>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack spacing={1.5}>
          <SectionHeading title={t('reviews')} />
          <ReviewsSection feedbackData={feedbackData} average={rate} count={rate_numbers} />
        </Stack>

        <FaqSection items={faqItems} />

        <div ref={locationSectionRef}>
          <Stack spacing={1.5}>
            <SectionHeading title={t('location')} />
            <MapEmbed address={address || `${name_english} ${city?.name_english || ''}`} locationGps={location_gps} />
          </Stack>
        </div>

        {/* <ClinicRelatedCarousel currentId={_id} sectorType={sector_type} cityId={city?._id} /> */}
      </Stack>

      <StickyBookingBar
        title={curLangAr ? name_arabic : name_english}
        priceLabel={address}
        ctaLabel={t('book appointment')}
        onBook={scrollToDoctors}
      />
    </Container>
  );
}

UnitServicePage.propTypes = {
  USData: PropTypes.object,
};
