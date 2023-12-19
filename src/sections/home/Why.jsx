import { color, m } from 'framer-motion';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { CardMedia } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import { varFade, MotionViewport } from 'src/components/animate';

export default function Whydoc() {
  const settings = useSettingsContext();

  const renderDescription = (
    <Stack spacing={3} sx={{ textAlign: 'center' }}>
      <m.div variants={varFade().inDown}>
        <Typography variant="h2">Why Doctorna <span style={{ color: 'green' }}>?</span></Typography>
        <br />
        <br />
        <br />
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ position: 'relative' }}>
      <div style={{ position: 'relative', paddingBottom: '56.25%', width: '100%' }}>
        <iframe
          src="https://www.youtube.com/embed/4KIk8h9xNL8?si=ng1fBA7_X2uHQ4sF"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '80%',
            borderRadius: '10px',
            border: 'none',
          }}
        />
      </div>
      <Typography variant="h6" sx={{ textAlign: 'center', marginTop: '15px' }}> Dr.Grendizer </Typography>
      <Typography sx={{ fontSize: 15, textAlign: 'center', marginTop: '10px' }}>Protection and bombing specialist based on the earth </Typography>
    </Box>
  );

  return (
    <Container
      component={MotionViewport}
      sx={{
        position: 'relative',
        py: { xs: 10, md: 15 },
        maxWidth: '100%',
      }}
    >
      {renderDescription}
      {renderContent}
    </Container>
  );
}
