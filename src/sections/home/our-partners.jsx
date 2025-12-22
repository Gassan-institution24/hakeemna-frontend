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

import Image from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

export default function OurPartners() {
  const { t } = useTranslate();
  const router = useRouter();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { unitservicesData } = useGetActiveUnitservices({
    select: 'name_english name_arabic company_logo status',
  });
  console.log(unitservicesData);
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
          pagination={{ clickable: true, el: '.custom-pagination' }}
          autoplay={{ delay: 3000 }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {unitservicesData.map(
            (partner, index) =>
              partner?.status === 'active' && (
                <SwiperSlide key={index}>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer' }}
                    onClick={() => router.push(paths.pages.serviceUnit(partner?._id))}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        width: 250, // Set width
                        overflow: 'hidden',
                        borderRadius: 3,
                        textAlign: 'center',
                        backgroundColor: 'white',
                        position: 'relative',
                      }}
                    >
                      {partner.company_logo ? (
                        <Image
                          src={
                            partner.company_logo ||
                            'data:image/png;base64,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'
                          }
                          alt={partner.name_english}
                          sx={{
                            width: '100%',
                            height: 170,
                            objectFit: 'cover',
                          }}
                        />
                      ) : (
                        <Box sx={{ width: '100%', height: 170 }} />
                      )}

                      {/* Green Overlay at the Bottom */}
                      <Box
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: '80px',
                          backgroundColor: '#2EA98D',
                          clipPath: 'ellipse(100% 50% at center bottom)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: 'bold', color: 'white', fontSize: 15, pt: 8 }}
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
