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
          {
            unitservicesData.map((partner, index) => (
              partner?.status === 'active' &&
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
                        src={partner.company_logo}
                        // src="https://gratisography.com/wp-content/uploads/2024/11/gratisography-augmented-reality-800x525.jpg"
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
                        sx={{ fontWeight: 'bold', color: 'white', fontSize: 16, pt: 5 }}
                      >
                        {curLangAr ? partner.name_arabic : partner.name_english}
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              </SwiperSlide>
            ))}
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
