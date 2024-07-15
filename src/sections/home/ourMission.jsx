import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

import Autonomy from './images/Autonomy.png';
import GreenManagement from './images/green.png';
import Friendly from './images/userFriendly.png';
import MedicalHub from './images/medicalHub.png';
import Credibility from './images/transparency.png';
import ResearchDevelopment from './images/research.png';

export default function WhoAreWe() {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  const CARDS = [
    {
      icon: MedicalHub,
      title: t('Electronic Medical Hub'),
      description: t(
        'A platform that brings together providers and providers of medical and health care services (institutions, doctors, and others) with users of those services at one conglomeration point, with the goal being for everyone to benefit from this alliance in the new and distinctive Arab world.'
      ),
      color: '#fff1e6',
    },
    {
      icon: Autonomy,
      title: t('Autonomy'),
      description: t(
        'The currently available electronic health records platforms cannot be used or benefited from them if you are not a subscriber as a beneficiary (patient) in health insurance coverage. Likewise, if you are a provider and provider of medical services or health care, you will not be able to use the platforms available in the market if you are not a member of one of them. Healthcare service management organizations. Therefore, the Hakeemna platform allows everyone (patient and medical service provider) to join our family and benefit from all the benefits independently without the requirement of joining one of the “health care services management” institutions or subscribing to an insurance company.'
      ),
      color: '#c5dedd',
    },
    {
      icon: Credibility,
      title: t('Credibility and transparency'),
      description: t(
        'Using our platform enables all categories of users (service providers and users of those services, such as patients) to communicate electronically in a convenient and transparent manner, which helps in expressing opinions and evaluating each party for the other, which increases awareness and raises credibility and transparency. This helps in the continuous development of the services provided and raises loyalty. Users of this distinguished medical group.'
      ),
      color: '#f1e4f3',
    },
    {
      icon: ResearchDevelopment,
      title: t('Research and Development'),
      description: t(
        'We seek to support and participate in scientific research in all relevant fields and development aimed at raising the level of performance and excellence in institutions in the Arab and Islamic world. Joining this platform contributes to supporting scientific research, development, and transfer of expertise and knowledge (knowledge transfer) from academic institutions to institutions operating in the private and government sectors.'
      ),
      color: '#dbe7e4',
    },
    {
      icon: GreenManagement,
      title: t('Green Management'),
      description: t(
        'This platform is designed to be a gateway towards sustainability and management committed to protecting the environment. Joining this platform makes you partners in efforts to preserve the environment and combat desertification by raising awareness and reducing activities that pollute the environment.'
      ),
      color: '#eddcd2',
    },
    {
      icon: Friendly,
      title: t('User Friendly And Flexible'),
      description: t(
        'Easy to use and flexible: The platform is designed to be easy to learn and use. A free training program is also available for service providers to familiarize themselves with all aspects of this platform.'
      ),
      color: '#bcd4e6',
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
        <m.div variants={varFade().inDown}>
          <Typography
            sx={{
              fontSize: 45,
              fontWeight: 600,
              fontFamily: curLangAr ? 'Beiruti, sans-serif' : 'Playwrite US Modern, cursive',
            }}
          >
            {t('our goals')}
          </Typography>
        </m.div>
      </Stack>

      <Box
        mt={5}
        gap={{ xs: 2, lg: 4 }}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(1, 1fr)',
        }}
        sx={{
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '50%', // Adjust this based on your layout
            transform: 'translateX(-50%)',
            width: '2px',
            height: '100%',
            backgroundColor: 'grey',
            zIndex: -1,
          },
        }}
      >
        {CARDS.map((card, idx) => {
          let direction;
          if (idx % 2 === 0) {
            direction = curLangAr ? 'row-reverse' : 'row';
          } else {
            direction = curLangAr ? 'row' : 'row-reverse';
          }

          let backgroundPosition;
          if (idx % 2 === 0) {
            backgroundPosition = curLangAr ? '' : '';
          } else {
            backgroundPosition = curLangAr ? '0% 0' : '100% 0';
          }

          return (
            <m.div variants={idx % 2 ? varFade().inRight : varFade().inLeft} key={idx}>
              <Stack
                direction={{ xs: 'column', md: direction }}
                alignItems="center"
                justifyContent="space-between"
                gap={2}
                sx={{
                  // border: '1px solid',
                  // p: 4,
                  // borderRadius: 10,
                  position: 'relative',
                }}
              >
                {/* <Image
                src={card.icon}
                alt={card.title}
                sx={{ mx: 'auto', width: 200, height: 200, size:  }}
              /> */}
                <Box
                  width={200}
                  height={card.icon === Friendly ? 130 : 170}
                  flex={0.1}
                  sx={{
                    backgroundImage: `url(${card.icon})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition,
                  }}
                />
                <Stack flex={1} sx={{ backgroundColor: card.color, p: 2 }}>
                  <Typography variant="h6" textAlign="center">
                    {card.title}
                  </Typography>
                  <Typography
                    variant="subtitle2"
                    textAlign="center"
                    sx={{ color: 'text.secondary', textTransform: 'lowercase' }}
                  >
                    {card.description}
                  </Typography>
                </Stack>
              </Stack>
            </m.div>
          );
        })}
      </Box>
    </Container>
  );
}
