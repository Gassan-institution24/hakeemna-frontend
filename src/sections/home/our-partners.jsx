import 'swiper/css';
import 'swiper/css/pagination';
import { m } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

import { Box, Paper, Stack, Container, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetActiveUnitservices } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

export default function OurPartners() {
  const { t } = useTranslate();
  const router = useRouter();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { unitservicesData } = useGetActiveUnitservices({
    select: 'name_english name_arabic company_logo status show_on_homepage',
  });
  return (
    <Box
      component={MotionViewport}
      sx={{
        position: 'relative',
        backgroundColor: '#e4f6f2',
        py: { xs: 6, md: 6 },
        transform: 'skewY(-3deg)',
        mt: '150px',
        mb: '150px',
      }}
    >
      <Container sx={{ transform: 'skewY(3deg)' }}>
        <Stack spacing={3} sx={{ textAlign: 'center', mb: 5 }}>
          <m.div variants={varFade().inDown}>
            <Typography
              sx={{
                fontSize: 45,
                fontWeight: 600,
              }}
            >
              {t('our partners')}
            </Typography>
          </m.div>
        </Stack>

        {/* Swiper Carousel */}
        <Swiper
          modules={[Autoplay, Pagination]}
          slidesPerView={1}
          spaceBetween={20}
          loop
          speed={700}
          pagination={{ clickable: true, el: '.custom-pagination' }}
          autoplay={{ delay: 3200, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            480:  { slidesPerView: 2, spaceBetween: 16 },
            768:  { slidesPerView: 3, spaceBetween: 20 },
            1200: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {unitservicesData.map(
            (partner, index) =>
              partner?.status === 'active' &&
              partner?.show_on_homepage && (
                <SwiperSlide key={index} style={{ height: 'auto' }}>
                  <Box
                    sx={{ display: 'flex', height: '100%', cursor: 'pointer' }}
                    onClick={() => router.push(paths.pages.serviceUnit(partner?._id))}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        width: '100%',
                        height: 210,
                        overflow: 'hidden',
                        borderRadius: 3,
                        textAlign: 'center',
                        backgroundColor: 'white',
                        position: 'relative',
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        component="img"
                        src={
                          partner.company_logo &&
                          partner.company_logo !== 'https://hakeemna.com/doc.png'
                            ? partner.company_logo
                            : '/assets/placeholder.svg'
                        }
                        alt={partner.name_english}
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />

                      {/* Green Overlay at the Bottom */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '100px',
                          backgroundColor: '#2EA98D',
                          clipPath: 'ellipse(100% 50% at center bottom)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 'bold', color: 'white', fontSize: 13, pt: 6 }}
                        >
                          {curLangAr ? partner.name_arabic : partner.name_english}
                        </Typography>
                      </Box>
                    </Paper>
                  </Box>
                </SwiperSlide>
              )
          )}
        </Swiper>

        {/* Custom Pagination */}
        <Box
          className="custom-pagination"
          sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}
        />
      </Container>
    </Box>
  );
}
