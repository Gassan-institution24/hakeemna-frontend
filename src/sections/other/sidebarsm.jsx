import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Iconify from 'src/components/iconify';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

export default function SmallSidebar() {
  const router = useRouter();
  const goto = () => {
    router.push(paths.dashboard.root);
  };
  return (
    <div
      style={{
        display: 'flex',
        bottom: -3,
        position: 'fixed',
        width: '100%',
        height: 'auto',
        margin: 3,
        backgroundColor: 'white',
        borderTop: '1px solid rgba(128, 128, 128, 0.244)',
      }}
    >
      <ul
        style={{
          display: 'inline-flex',
          width: '100%',
        }}
      >
        <li style={{ listStyle: 'none', width: '100%' }}>
          <Button sx={{position:'relative', right:'25%'}}>
            <Iconify sx={{ color: 'green' , width:'50%', height:'40%' }} icon="gg:profile" />
          </Button>
        </li>
        <li style={{ listStyle: 'none', width: '100%' }}>
          <Button sx={{position:'relative', right:'25%'}}>
            <Iconify sx={{ color: 'green' , width:'50%', height:'40%' }} icon="bx:search" />
          </Button>
        </li>
        <li style={{ listStyle: 'none', width: '100%' }}>
          <Button sx={{position:'relative', right:'25%'}} onClick={goto}>
            <Iconify sx={{ color: 'green' , width:'50%', height:'40%' }} icon="cil:home" />
          </Button>
        </li>
        <li style={{ listStyle: 'none', width: '100%' }}>
          <Button sx={{position:'relative', right:'25%'}}>
            <Iconify sx={{ color: 'green' , width:'50%', height:'40%' }} icon="material-symbols:wifi-sharp" />
          </Button>
        </li>
        <li style={{ listStyle: 'none', width: '100%' }}>
          <Button sx={{position:'relative', right:'25%'}}>
            <Iconify sx={{ color: 'green' , width:'50%', height:'40%' }} icon="ant-design:setting-outlined" />
          </Button>
        </li>
      </ul>
    </div>
  );
}
