import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

import Blue from './images/Paint.png';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: 'https://static.vecteezy.com/system/resources/thumbnails/021/809/795/small/doctors-day-illustration-png.png',
    title: 'Electronic Medical Hub',
    description:
      'A platform that brings together providers and providers of medical and health care services ...',
  },
  {
    icon: 'https://static.thenounproject.com/png/5140056-200.png',
    title: 'Autonomy',
    description:
      'The currently available electronic health records platforms cannot be used or benefited from them...',
  },
  // number is 14
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/10074/10074030.png',
    title: 'Credibility and transparency',
    description:
      'Using our platform enables all categories of users (service providers and users of...',
  },
  {
    icon: 'https://www.zevenet.com/wp-content/uploads/2019/10/zevenet_website_icons-ABOUT_US_Research_and_development_Green-.svg',
    title: 'Research and Developmen',
    description:
      'We seek to support and participate in scientific research in all relevant fields and...',
  },
  {
    icon: 'https://png.pngtree.com/png-vector/20220831/ourmid/pngtree-banyan-tree-logo-design-vector-png-image_6131481.png',
    title: 'green management',
    description:
      'This platform is designed to be a gateway towards sustainability and management committed...',
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/5695/5695909.png',
    title: 'User friendly and flexible',
    description:
      'The platform is designed to be easy to learn and use, and a free training...',
  },
];

// ----------------------------------------------------------------------

export default function whoAreWe() {
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
          mb: { xs: 5, md: 8 },
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
              }}
            />
            <span style={{ position: 'relative', top: -80 }}> Who are we <span style={{color:'#3399FE'}}>?</span> </span>
          </Typography>
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
              <Box
                component="img"
                src={card.icon}
                alt={card.title}
                sx={{ mx: 'auto', width: 48, height: 48 }}
              />

              <Typography variant="h6" sx={{ mt: 8, mb: 2 }}>
                {card.title}
              </Typography>

              <Typography sx={{ color: 'text.secondary' }}>{card.description}</Typography>
            </Card>
          </m.div>
        ))}
      </Box>
    </Container>
  );
}
