import 'swiper/css';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';

import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { useGetEmployeeEngsBySpecialty } from 'src/api';

import SectionHeading from '../components/section-heading';

// ----------------------------------------------------------------------

export default function DoctorRelatedCarousel({ currentId, specialityId }) {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { data } = useGetEmployeeEngsBySpecialty(specialityId);

  const related = (data || []).filter((one) => one._id !== currentId);

  if (!related.length) {
    return null;
  }

  const goToDoctor = (doctor) => {
    router.push(
      paths.pages.doctor(`${doctor._id}_${doctor.employee?.name_english?.replace(/ /g, '-')}`)
    );
  };

  return (
    <Stack spacing={1.5}>
      <SectionHeading title={t('related doctors')} />
      <Swiper
        slidesPerView={1.4}
        spaceBetween={16}
        breakpoints={{ 640: { slidesPerView: 2.4 }, 1024: { slidesPerView: 3.4 } }}
      >
        {related.map((doctor) => (
          <SwiperSlide key={doctor._id}>
            <Stack
              spacing={1}
              alignItems="center"
              sx={{ p: 2, borderRadius: 1.5, cursor: 'pointer', border: (theme) => `solid 1px ${theme.palette.divider}`, textAlign: 'center' }}
              onClick={() => goToDoctor(doctor)}
            >
              <Avatar src={doctor.employee?.picture} sx={{ width: 64, height: 64 }} />
              <Typography variant="subtitle2" noWrap>
                {curLangAr ? doctor.employee?.name_arabic : doctor.employee?.name_english}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {curLangAr ? doctor.employee?.speciality?.name_arabic : doctor.employee?.speciality?.name_english}
              </Typography>
              {!!doctor.employee?.rate && (
                <Rating size="small" readOnly value={doctor.employee.rate} precision={0.1} max={5} />
              )}
            </Stack>
          </SwiperSlide>
        ))}
      </Swiper>
    </Stack>
  );
}

DoctorRelatedCarousel.propTypes = {
  currentId: PropTypes.string,
  specialityId: PropTypes.string,
};
