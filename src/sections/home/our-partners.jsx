import { useState } from 'react';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import { Stack } from '@mui/material';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import { alpha, useTheme } from '@mui/material/styles';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import { bgGradient } from 'src/theme/css';
import { useGetActiveUnitservices } from 'src/api';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { varFade } from 'src/components/animate';
import TextMaxLine from 'src/components/text-max-line';
import { CarouselArrows } from 'src/components/carousel';

// ----------------------------------------------------------------------

export default function OurPartners() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const mdUp = useResponsive('up', 'md');
  const lgUp = useResponsive('up', 'xl');

  const [page, setPage] = useState(0);

  let rowsPerPage;
  if (lgUp) {
    rowsPerPage = 5;
  } else if (mdUp) {
    rowsPerPage = 3;
  } else {
    rowsPerPage = 1;
  }

  const { unitservicesData, length } = useGetActiveUnitservices({
    select: 'name_english name_arabic company_logo',
    page,
    rowsPerPage,
  });
  if (unitservicesData.length < 1) {
    return '';
  }
  return (
    <>
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          my: { xs: 5, md: 10 },
        }}
      >
        <m.div variants={varFade().inDown}>
          <Typography
            sx={{
              fontSize: 45,
              fontWeight: 600,
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
            }}
          >
            {t('our partners')}
          </Typography>
        </m.div>
      </Stack>
      <Stack sx={{ my: 5, position: 'relative' }}>
        <CarouselArrows
          filled
          icon="material-symbols:double-arrow"
          onNext={() =>
            setPage((prev) => (prev < Math.ceil(length / rowsPerPage) - 1 ? prev + 1 : 0))
          }
          onPrev={() =>
            setPage((prev) => (prev > 0 ? prev - 1 : Math.ceil(length / rowsPerPage) - 1))
          }
        >
          <Stack direction="row" justifyContent="space-around">
            {unitservicesData?.map((item, index) => (
              <Box key={item.id} sx={{ px: 1 }}>
                <CarouselItem key={item.id} item={item} />
              </Box>
            ))}
          </Stack>
        </CarouselArrows>
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

function CarouselItem({ item, active }) {
  const theme = useTheme();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();

  const { _id, company_logo, name_english, name_arabic } = item;

  return (
    <Paper sx={{ position: 'relative', height: { md: 300 }, width: { md: 300 } }}>
      <Image
        dir="ltr"
        alt={name_english}
        src={company_logo}
        sx={{ height: { md: 300, xs: 300 }, width: { md: 300, xs: 300 } }}
      />

      <CardContent
        sx={{
          bottom: 0,
          zIndex: 9,
          width: '100%',
          textAlign: 'left',
          position: 'absolute',
          color: 'common.white',
          pb: 10,
          ...bgGradient({
            direction: 'to top',
            startColor: `${theme.palette.grey[900]} 25%`,
            endColor: `${alpha(theme.palette.grey[900], 0)} 100%`,
          }),
        }}
      >
        <TextMaxLine
          variant="h5"
          onClick={() => router.push(paths.pages.serviceUnit(_id))}
          sx={{ cursor: 'pointer' }}
        >
          {curLangAr ? name_arabic : name_english}
        </TextMaxLine>
      </CardContent>
    </Paper>
  );
}

CarouselItem.propTypes = {
  active: PropTypes.bool,
  item: PropTypes.object,
};
