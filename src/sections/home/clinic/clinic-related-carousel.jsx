import 'swiper/css';
import PropTypes from 'prop-types';
import { Swiper, SwiperSlide } from 'swiper/react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetActiveUnitservices } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';

import SectionHeading from '../components/section-heading';

// ----------------------------------------------------------------------

export default function ClinicRelatedCarousel({ currentId, sectorType, cityId }) {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { unitservicesData } = useGetActiveUnitservices({
    select: 'name_english name_arabic company_logo status sector_type city',
  });

  const related = unitservicesData.filter(
    (one) =>
      one._id !== currentId &&
      one.status === 'active' &&
      (one.sector_type === sectorType || one.city?._id === cityId || one.city === cityId)
  );

  if (!related.length) {
    return null;
  }

  return (
    <Stack spacing={1.5}>
      <SectionHeading title={t('related clinics')} />
      <Swiper slidesPerView={1.2} spaceBetween={16} breakpoints={{ 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 3.2 } }}>
        {related.map((clinic) => (
          <SwiperSlide key={clinic._id}>
            <Stack
              spacing={1}
              sx={{ p: 2, borderRadius: 1.5, cursor: 'pointer', border: (theme) => `solid 1px ${theme.palette.divider}` }}
              onClick={() => router.push(paths.pages.serviceUnit(clinic._id))}
            >
              {clinic.company_logo && (
                <Box sx={{ borderRadius: 1, overflow: 'hidden' }}>
                  <Image src={clinic.company_logo} ratio="16/9" alt={clinic.name_english} />
                </Box>
              )}
              <Typography variant="subtitle2" noWrap>
                {curLangAr ? clinic.name_arabic : clinic.name_english}
              </Typography>
            </Stack>
          </SwiperSlide>
        ))}
      </Swiper>
    </Stack>
  );
}

ClinicRelatedCarousel.propTypes = {
  currentId: PropTypes.string,
  sectorType: PropTypes.string,
  cityId: PropTypes.string,
};
