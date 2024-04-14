import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

import Blue from './images/Paint.png';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: 'https://static.vecteezy.com/system/resources/thumbnails/021/809/795/small/doctors-day-illustration-png.png',
    title: 'Electronic Medical Hub',
    description:
      'A platform that brings together providers and providers of medical and health care services ',
  },
  {
    icon: 'https://static.thenounproject.com/png/5140056-200.png',
    title: 'Autonomy',
    description:
      'The currently available electronic health records platforms cannot be used or benefited from them',
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/10074/10074030.png',
    title: 'Credibility and transparency',
    description:
      'Using our platform enables all categories of users (service providers and users of',
  },
  {
    icon: 'https://www.zevenet.com/wp-content/uploads/2019/10/zevenet_website_icons-ABOUT_US_Research_and_development_Green-.svg',
    title: 'Research and Developmen',
    description:
      'We seek to support and participate in scientific research in all relevant fields and',
  },
  {
    icon: 'https://png.pngtree.com/png-vector/20220831/ourmid/pngtree-banyan-tree-logo-design-vector-png-image_6131481.png',
    title: 'green management',
    description:
      'This platform is designed to be a gateway towards sustainability and management committed',
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/5695/5695909.png',
    title: 'User friendly and flexible',
    description: 'The platform is designed to be easy to learn and use, and a free training',
  },
];

// ----------------------------------------------------------------------

export default function WhoAreWe() {
  const { t } = useTranslate();

  const renderDescription = (description) =>
    description.length > 17 ? (
      <>
        {description.substring(0, 90)}{' '}
        <a href="#" style={{ color: '#3399FF' }}>
          Read more
        </a>
      </>
    ) : (
      description
    );

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 10 },
      }}
      id="About"
    >
      <Stack
        spacing={3}
        sx={{
          textAlign: 'center',
          mb: { xs: 5, md: -1 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography
            component="div"
            variant="overline"
            sx={{ color: 'text.disabled', textAlign: 'center' }}
          >
            Hakeemna.com
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography sx={{}} variant="h2">
            <Box
              sx={{
                flexGrow: 1,
                backgroundImage: `url(${Blue})`,
                backgroundSize: '290px',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                textAlign: 'center',
                height: '100px',
                width: '90%',
                zIndex: -1,
                visibility:{md:'visible',xs:'hidden'}
              }}
            />
            <span style={{ position: 'relative', top: -80 }}>
              {' '}
              {t('Who are we')} <span style={{ color: '#3399FE' }}>?</span>{' '}
            </span>
          </Typography>
        </m.div>
        <Typography
          component="div"
          variant="overline"
          sx={{ color: 'text.disabled', textAlign: 'center' }}
        >
          {t('The Hakeemna platform is the result of joint cooperation between the health sector and specialists in developing the performance of institutions that seek to achieve efficiency in work and production that is compatible with the goals of sustainability and environmental preservation.')} <br/> 
          {t('After studying the needs of medical institutions and users ( patients and others ) in the Arab world, a working team was formed to develop this platform.')} <br/>
          {t('This team has full belief in the importance of developing electronic health services, especially the private sector in our Arab world, by raising the level of medical services and improving the efficiency of daily practices.')} <br/>
          {t('For medical service providers, facilitating procedures for patients and keeping their medical information and documents securely and in one place.')}<br/>
          {t('The platform is characterized by being comprehensive for all individuals and institutions, whether the user ( medical service provider or patient ) subscribes to the services of insurance companies or not, as you can benefit from the services provided to you independently and without association with any insurance or insurance management groups.')}
        </Typography>
      </Stack>

      <Box
        gap={{ xs: 3, lg: 5 }}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        {CARDS.map((card, idx) => (
          <m.div variants={varFade().inUp} key={idx}>
            <Card
              sx={{
                textAlign: 'center',
                boxShadow: { md: 'none' },
                bgcolor: 'rgba(102, 255, 102, 0)',
                p: (theme) => theme.spacing(10, 5),
              }}
            >
              <Box
                component="img"
                src={card.icon}
                alt={card.title}
                sx={{ mx: 'auto', width: 48, height: 48 }}
              />

              <Typography variant="h6" sx={{ mt: 8, mb: 2 }}>
                {card.title}
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>
                {renderDescription(card.description)}
              </Typography>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
