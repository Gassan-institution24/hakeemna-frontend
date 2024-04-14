import { useState } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

import Blue from './images/Paint.png';

export default function WhoAreWe() {
  const [expandedCardIndex, setExpandedCardIndex] = useState(null); // Store the index of the expanded card

  const handleReadMoreClick = (index) => {
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null); // Collapse the description if it's already expanded
    } else {
      setExpandedCardIndex(index); // Expand the description of the clicked card
    }
  };

  const { t } = useTranslate();
  const CARDS = [
    {
      icon: 'https://static.vecteezy.com/system/resources/thumbnails/021/809/795/small/doctors-day-illustration-png.png',
      title: t('Electronic Medical Hub'),
      description: t(
        'A platform that brings together providers and providers of medical and health care services (institutions, doctors, and others) with users of those services at one conglomeration point, with the goal being for everyone to benefit from this alliance in the new and distinctive Arab world.'
      ),
    },
    {
      icon: 'https://static.thenounproject.com/png/5140056-200.png',
      title: t('Autonomy'),
      description: t(
        'The currently available electronic health records platforms cannot be used or benefited from them if you are not a subscriber as a beneficiary (patient) in health insurance coverage. Likewise, if you are a provider and provider of medical services or health care, you will not be able to use the platforms available in the market if you are not a member of one of them. Healthcare service management organizations. Therefore, the Hakeemna platform allows everyone (patient and medical service provider) to join our family and benefit from all the benefits independently without the requirement of joining one of the “health care services management” institutions or subscribing to an insurance company.'
      ),
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/10074/10074030.png',
      title: t('Credibility and transparency'),
      description: t(
        'Using our platform enables all categories of users (service providers and users of those services, such as patients) to communicate electronically in a convenient and transparent manner, which helps in expressing opinions and evaluating each party for the other, which increases awareness and raises credibility and transparency. This helps in the continuous development of the services provided and raises loyalty. Users of this distinguished medical group.'
      ),
    },
    {
      icon: 'https://www.zevenet.com/wp-content/uploads/2019/10/zevenet_website_icons-ABOUT_US_Research_and_development_Green-.svg',
      title: t('Research and Development'),
      description: t(
        'We seek to support and participate in scientific research in all relevant fields and development aimed at raising the level of performance and excellence in institutions in the Arab and Islamic world. Joining this platform contributes to supporting scientific research, development, and transfer of expertise and knowledge (knowledge transfer) from academic institutions to institutions operating in the private and government sectors.'
      ),
    },
    {
      icon: 'https://png.pngtree.com/png-vector/20220831/ourmid/pngtree-banyan-tree-logo-design-vector-png-image_6131481.png',
      title: t('Green Management'),
      description: t(
        'This platform is designed to be a gateway towards sustainability and management committed to protecting the environment. Joining this platform makes you partners in efforts to preserve the environment and combat desertification by raising awareness and reducing activities that pollute the environment.'
      ),
    },
    {
      icon: 'https://cdn-icons-png.flaticon.com/512/5695/5695909.png',
      title: t('User friendly and flexible'),
      description: t(
        'Easy to use and flexible: The platform is designed to be easy to learn and use. A free training program is also available for service providers to familiarize themselves with all aspects of this platform.'
      ),
    },
  ];

  // Inside your component...

  const renderDescription = (description, index) => {
    const variants = {
      open: { height: 'auto', opacity: 1 },
      closed: { height: 0, opacity: 0 },
    };

    if (expandedCardIndex === index) {
      return (
        <m.div // Use the m component
          initial="closed"
          animate="open"
          exit="closed"
          variants={variants}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {description}
        </m.div>
      );
    }
    return description.length > 90 ? (
      <>
        {description.substring(0, 90)}{' '}
        <Typography
          style={{ color: '#3399FF', marginLeft: '5px', cursor: 'pointer' }}
          onClick={() => handleReadMoreClick(index)}
        >
          {t('Read more')}
        </Typography>
      </>
    ) : (
      description
    );
  };

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
                visibility: { md: 'visible', xs: 'hidden' },
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
          {t(
            'The Hakeemna platform is the result of joint cooperation between the health sector and specialists in developing the performance of institutions that seek to achieve efficiency in work and production that is compatible with the goals of sustainability and environmental preservation.'
          )}{' '}
          <br />
          {t(
            'After studying the needs of medical institutions and users ( patients and others ) in the Arab world, a working team was formed to develop this platform.'
          )}{' '}
          <br />
          {t(
            'This team has full belief in the importance of developing electronic health services, especially the private sector in our Arab world, by raising the level of medical services and improving the efficiency of daily practices.'
          )}{' '}
          <br />
          {t(
            'For medical service providers, facilitating procedures for patients and keeping their medical information and documents securely and in one place.'
          )}
          <br />
          {t(
            'The platform is characterized by being comprehensive for all individuals and institutions, whether the user ( medical service provider or patient ) subscribes to the services of insurance companies or not, as you can benefit from the services provided to you independently and without association with any insurance or insurance management groups.'
          )}
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
                {idx === expandedCardIndex ? (
                  <m.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {card.description}{' '}
                    <Typography
                      style={{ color: '#3399FF', marginLeft: '5px', cursor: 'pointer' }}
                      onClick={() => handleReadMoreClick(idx)}
                    >
                      {t('Hide')}
                    </Typography>
                  </m.div>
                ) : (
                  <>
                    {card.description.length > 90 ? (
                      <>
                        {card.description.substring(0, 90)}{' '}
                        <Typography
                          style={{ color: '#3399FF', marginLeft: '5px', cursor: 'pointer' }}
                          onClick={() => handleReadMoreClick(idx)}
                        >
                          {t('Read more')}
                        </Typography>
                      </>
                    ) : (
                      card.description
                    )}
                  </>
                )}
              </Typography>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
