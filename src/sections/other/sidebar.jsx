import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

const stickySidebarStyle = {
  display: 'flex',
  right: 0,
  zIndex: 1,
  margin: 3,
  position: 'fixed',
  backgroundColor: 'rgba(255, 255, 255, 0.700)',
  height: '35.3%',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  borderRadius: '15px 0px 0px 15px',
};
const insidestickySidebar = {
  transform: 'translate(2%, 2%)',
};





export default function Sidebar() {
    const router = useRouter();
    const goto = () =>{
        router.push(paths.dashboard.root);
    }
  return (
    <Box style={stickySidebarStyle}>
      <Box style={insidestickySidebar}>
        <Button sx={{ display: 'inline', '&:hover': {
      bgcolor:'inherit',
    }, }} onClick={goto} >
          <Iconify sx={{ color: 'green' }} icon="cil:home" />
          <Typography>Home</Typography>
        </Button>

        <Divider />
        <Button sx={{ display: 'inline', '&:hover': {
      bgcolor:'inherit',
    }, }}>
          <Iconify sx={{ color: 'green' }} icon="ic:baseline-search" />
          <Typography>Search</Typography>
        </Button>
        <Divider />
        <Button sx={{ display: 'inline', '&:hover': {
      bgcolor:'inherit',
    }, }}>
          <Iconify sx={{ color: 'green' }} icon="gg:profile" />
          <Typography>Profile</Typography>
        </Button>
        <Divider />
        <Button sx={{ display: 'inline', '&:hover': {
      bgcolor:'inherit',
    }, }}>
          <Iconify sx={{ color: 'green' }} icon="material-symbols:wifi-sharp" />
          <Typography>Test</Typography>
        </Button>
        <Divider />
        <Button sx={{ display: 'inline', '&:hover': {
      bgcolor:'inherit',
    }, }}>
          <Iconify sx={{ color: 'green' }} icon="ant-design:setting-outlined" />
          <Typography>Setting</Typography>
        </Button>
      </Box>
    </Box>
  );
}
