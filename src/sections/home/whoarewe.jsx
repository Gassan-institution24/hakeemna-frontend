import { m } from 'framer-motion';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { varFade, MotionViewport } from 'src/components/animate';

// ----------------------------------------------------------------------

const CARDS = [
  {
    icon: 'https://static.vecteezy.com/system/resources/thumbnails/021/809/795/small/doctors-day-illustration-png.png',
    title: 'Medical Hub',
    description:
      'An integrated platform that brings both medical service providers and beneficiaries in one place',
  },
  {
    icon: 'https://png.pngtree.com/png-vector/20220831/ourmid/pngtree-banyan-tree-logo-design-vector-png-image_6131481.png',
    title: 'Green Managment',
    description:
      'An integrated platform that brings both medical service providers and beneficiaries in one place',
  },
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/5695/5695909.png',
    title: 'User Friendly',
    description:
      'An integrated platform that brings both medical service providers and beneficiaries in one place',
  },
  {
    icon: 'https://www.zevenet.com/wp-content/uploads/2019/10/zevenet_website_icons-ABOUT_US_Research_and_development_Green-.svg',
    title: 'R & D Support',
    description:
      'An integrated platform that brings both medical service providers and beneficiaries in one place',
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
          textalign: 'center',
          mb: { xs: 5, md: 8 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography
            component="div"
            variant="overline"
            sx={{ color: 'text.disabled', textalign: 'center' }}
          >
            Doctona Online
          </Typography>
        </m.div>

        <m.div variants={varFade().inDown}>
          <Typography variant="h2">Who are we ?</Typography>
        </m.div>
      </Stack>

      <Box
        gap={{ xs: 3, lg: 5 }}
        display="grid"
        alignItems="center"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
      >
        {CARDS.map((card, index) => (
          <m.div variants={varFade().inUp} key={card.title}>
            <Card
              sx={{
                textalign: 'center',
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

              <Typography variant="h5" sx={{ mt: 8, mb: 2 }}>
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
