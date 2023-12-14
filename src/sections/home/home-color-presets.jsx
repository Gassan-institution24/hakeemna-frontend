import { color, m } from 'framer-motion';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

import { presetOptions } from 'src/theme/options/presets';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import { varFade, MotionViewport } from 'src/components/animate';
import { CardMedia } from '@mui/material';

// ----------------------------------------------------------------------

export default function HomeColorPresets() {
  const settings = useSettingsContext();

  const renderDescription = (
    <Stack spacing={3} sx={{ textAlign: 'center' }}>
      <m.div variants={varFade().inDown}>
        <Typography variant="h2"> Who are we <span style={{ color: 'green'}}>?</span></Typography>
        <br/>
        <br/>
        <br/>
      </m.div>
    </Stack>
  );

  const renderContent = (
    <Box sx={{ position: 'relative' }}>
    <iframe
      src="https://www.youtube.com/embed/4KIk8h9xNL8?si=ng1fBA7_X2uHQ4sF"
      title="YouTube video player"
    
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      height="400"
      allowfullscreen
      style={{
        position: "relative",
        left: "19%",
        width: "65%",
        borderRadius: "10px", // Added border radius here
        border:"none",
      }}
    />
    
        <Typography variant="h6" sx={{   position: 'relative' ,left:"48.5%" , marginTop:"25px"}}> Dr.Grendizer </Typography>
        <Typography sx={{ fontSize: 15,  position: 'relative' ,left:"38.5%" , marginTop:"15px"}} >Protection and bombing specialist based on the earth </Typography>
  </Box>
  );



  return (
    <Container
      component={MotionViewport}
      sx={{
        position: 'relative',
        py: { xs: 10, md: 15 },
      }}
    >
      {renderDescription}

 

      {renderContent}
    </Container>
  );
}
