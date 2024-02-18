import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { varFade, MotionContainer } from 'src/components/animate';
import Carousel, { useCarousel, CarouselDots, CarouselArrows } from 'src/components/carousel';

// ----------------------------------------------------------------------

export default function AppFeatured({ list, ...other }) {
  const carousel = useCarousel({
    speed: 800,
    autoplay: true,
    ...CarouselDots({
      sx: {
        top: 16,
        left: 16,
        position: 'absolute',
        color: 'primary.light',
      },
    }),
  });
  const IMGES = [
    'https://pbs.twimg.com/media/ETOK9wUUcAQTLWn.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl1D6wCIYA8krMnIhzkvBvzPj8cc1_GJqFrg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSovMdcd6fWFK49CNXERHeqygbop8Tywm_oBQ&usqp=CAU',
  ];

  return (
    <Card {...other}>
      <Carousel ref={carousel.carouselRef} {...carousel.carouselSettings}>
        {IMGES?.map((app, index) => (
          <CarouselItem key={index} item={app} active={index === carousel.currentIndex} />
        ))}
      </Carousel>

      <CarouselArrows
        onNext={carousel.onNext}
        onPrev={carousel.onPrev}
        sx={{ top: 8, right: 8, position: 'absolute', color: 'common.white' }}
      />
    </Card>
  );
}

AppFeatured.propTypes = {
  list: PropTypes.array,
};

// ----------------------------------------------------------------------

function CarouselItem({ item, active }) {
  const theme = useTheme();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { coverUrl, title, description } = item;

  const IMGES = [
    'https://pbs.twimg.com/media/ETOK9wUUcAQTLWn.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRl1D6wCIYA8krMnIhzkvBvzPj8cc1_GJqFrg&usqp=CAU',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSovMdcd6fWFK49CNXERHeqygbop8Tywm_oBQ&usqp=CAU',
  ];

  const renderImg = (
    <Image
      alt={title}
      src={IMGES[0]}
      overlay={`linear-gradient(to bottom, ${alpha(theme.palette.grey[900], 0)} 0%, ${
        theme.palette.grey[700]
      } 85%)`}
      sx={{
        width: 1,
        height: {
          xs: 280,
          xl: 320,
        },
      }}
    />
  );

  return (
    <MotionContainer action animate={active} sx={{ position: 'relative' }}>
      <Stack
        spacing={1}
        sx={{
          p: 3,
          width: 1,
          bottom: 0,
          zIndex: 9,
          textalign: 'left',
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <m.div variants={varFade().inRight}>
          <Typography variant="overline" sx={{ color: 'primary.light', fontSize: 15 }}>
            {t('Available Offers')}
          </Typography>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Link color="inherit" underline="none">
            <Typography variant="h5" noWrap>
              {curLangAr ? 'خصم ۲٥ ٪' : '25% discount'}
            </Typography>
          </Link>
        </m.div>

        <m.div variants={varFade().inRight}>
          <Typography variant="body2" noWrap>
            {curLangAr
              ? 'خصم ۲٥ ٪ على كل الادوية لمدة شهر'
              : ' 25% discount on all medicines for a month'}
          </Typography>
        </m.div>
      </Stack>

      {renderImg}
    </MotionContainer>
  );
}

CarouselItem.propTypes = {
  active: PropTypes.bool,
  item: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
