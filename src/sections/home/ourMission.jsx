import { useState } from 'react';
import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import { varFade, MotionViewport } from 'src/components/animate';

import Orange from './images/orange.png';
import Autonomy from './images/Autonomy.png';
import GreenManagement from './images/GreenManagement.png';
import Friendly from './images/UserFriendlyAndFlexible.png';
import MedicalHub from './images/Electronic Medical Hub.png';
import Credibility from './images/Credibility And Transparency.png';
import ResearchDevelopment from './images/ResearchAndDevelopment.png';

export default function WhoAreWe() {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  const [expandedCardIndex, setExpandedCardIndex] = useState(null); // Store the index of the expanded card
  const handleReadMoreClick = (index) => {
    if (expandedCardIndex === index) {
      setExpandedCardIndex(null); // Collapse the description if it's already expanded
    } else {
      setExpandedCardIndex(index); // Expand the description of the clicked card
    }
  };

  const CARDS = [
    {
      icon: MedicalHub,
      title: t('Electronic Medical Hub'),
      description: t(
        'A platform that brings together providers and providers of medical and health care services (institutions, doctors, and others) with users of those services at one conglomeration point, with the goal being for everyone to benefit from this alliance in the new and distinctive Arab world.'
      ),
    },
    {
      icon: Autonomy,
      title: t('Autonomy'),
      description: t(
        'The currently available electronic health records platforms cannot be used or benefited from them if you are not a subscriber as a beneficiary (patient) in health insurance coverage. Likewise, if you are a provider and provider of medical services or health care, you will not be able to use the platforms available in the market if you are not a member of one of them. Healthcare service management organizations. Therefore, the Hakeemna platform allows everyone (patient and medical service provider) to join our family and benefit from all the benefits independently without the requirement of joining one of the “health care services management” institutions or subscribing to an insurance company.'
      ),
    },
    {
      icon: Credibility,
      title: t('Credibility and transparency'),
      description: t(
        'Using our platform enables all categories of users (service providers and users of those services, such as patients) to communicate electronically in a convenient and transparent manner, which helps in expressing opinions and evaluating each party for the other, which increases awareness and raises credibility and transparency. This helps in the continuous development of the services provided and raises loyalty. Users of this distinguished medical group.'
      ),
    },
    {
      icon: ResearchDevelopment,
      title: t('Research and Development'),
      description: t(
        'We seek to support and participate in scientific research in all relevant fields and development aimed at raising the level of performance and excellence in institutions in the Arab and Islamic world. Joining this platform contributes to supporting scientific research, development, and transfer of expertise and knowledge (knowledge transfer) from academic institutions to institutions operating in the private and government sectors.'
      ),
    },
    {
      icon: GreenManagement,
      title: t('Green Management'),
      description: t(
        'This platform is designed to be a gateway towards sustainability and management committed to protecting the environment. Joining this platform makes you partners in efforts to preserve the environment and combat desertification by raising awareness and reducing activities that pollute the environment.'
      ),
    },
    {
      icon: Friendly,
      title: t('User Friendly And Flexible'),
      description: t(
        'Easy to use and flexible: The platform is designed to be easy to learn and use. A free training program is also available for service providers to familiarize themselves with all aspects of this platform.'
      ),
    },
  ];

  return (
    <Container
      component={MotionViewport}
      sx={{
        py: { xs: 10, md: 10 },
      }}
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
            sx={{
              color: 'text.disabled',
              textAlign: 'center',
              display: curLangAr ? 'none' : 'inline',
            }}
          >
            Hakeemna.com
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">{t('our mission')}</Typography>
          <Image
            src={Orange}
            sx={{
              position: 'absolute',
              top: curLangAr ? 14: 29,
              left: curLangAr ? '41.5%' : '53.3%',
            }}
          />
        </m.div>
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
              <Image
                src={card.icon}
                alt={card.title}
                sx={{ mx: 'auto', width: 100, height: 100 }}
              />
              <Box
                alt={card.title}
                // sx={{ mx: 'auto', width: 48, height: 48 }}
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
