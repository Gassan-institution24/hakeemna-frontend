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
  height: 'auto',
  width: 'auto',
  margin: 3,
  position: 'fixed',
  backgroundColor: 'rgba(255, 255, 255, 0.700)',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.4)',
  borderRadius: '15px 0px 0px 15px',
};
const insidestickySidebar = {
  transform: 'translate(2%, 2%)',
};

export default function Sidebar() {
  const router = useRouter();
  const goto = () => {
    router.push(paths.dashboard.root);
  };
  return (
    <Box style={stickySidebarStyle}>
      <Box style={insidestickySidebar}>
        <Button sx={{ display: 'inline','&:hover': {
      bgcolor:'inherit',
    }, }} onClick={goto} >
          <Iconify sx={{ color: 'green',  width:'50%', height:'40%'  }} icon="cil:home" />
          <Typography sx={{ fontSize:12}} >Home</Typography>
        </Button>

        <Divider />
        <Button sx={{ display: 'inline', '&:hover': {
      bgcolor:'inherit',
    }, }}>
          <Iconify sx={{ color: 'green',  width:'50%', height:'40%'  }} icon="bx:search" />
          <Typography sx={{ fontSize:12}} >Search</Typography>
        </Button>
        <Divider />
        <Button sx={{ display: 'inline', '&:hover': {
      bgcolor:'inherit',
    }, }}>
          <Iconify sx={{ color: 'green',  width:'50%', height:'40%'  }} icon="gg:profile" />
          <Typography sx={{ fontSize:12}} >Profile</Typography>
        </Button>
        <Divider />
        <Button sx={{ display: 'inline', '&:hover': {
      bgcolor:'inherit',
    }, }}>
          <Iconify sx={{ color: 'green',  width:'50%', height:'40%'  }} icon="material-symbols:wifi-sharp" />
          <Typography sx={{ fontSize:12}} >Test</Typography>
        </Button>
        <Divider />
        <Button sx={{ display: 'inline', '&:hover': {
      bgcolor:'inherit',
    }, }}>
          <Iconify sx={{ color: 'green',  width:'50%', height:'40%'  }} icon="ant-design:setting-outlined" />
          <Typography sx={{ fontSize:12}} >Setting</Typography>
        </Button>
      </Box>
    </Box>


  );
}
