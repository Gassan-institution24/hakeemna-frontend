import React from 'react'; 
 
import Button from '@mui/material/Button'; 
 
import { paths } from 'src/routes/paths'; 
import { useRouter } from 'src/routes/hooks'; 
 
import Iconify from 'src/components/iconify'; 
 
export default function SmallSidebar() { 
  const router = useRouter(); 
  const gotoHome = () => { 
    router.push(paths.dashboard.root); 
  }; 
  const gotoProfile = () => { 
    router.push(paths.dashboard.user.profile); 
  }; 
  const gotoSetting = () => { 
    router.push(paths.dashboard.user.account); 
  }; 
  // const gotoHome = () => { 
  //   router.push(paths.dashboard.root); 
  // }; 
  // const gotoHome = () => { 
  //   router.push(paths.dashboard.root); 
  // }; 
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
          <Button sx={{ position: 'relative', right: '25%' }}> 
            <Iconify 
              sx={{ color: 'green', width: '50%', height: '40%' }} 
              icon="gg:profile" 
              onClick={gotoProfile} 
            /> 
          </Button> 
        </li> 
        <li style={{ listStyle: 'none', width: '100%' }}> 
          <Button sx={{ position: 'relative', right: '25%' }}> 
            <Iconify sx={{ color: 'green', width: '50%', height: '40%' }} icon="ph:calendar-duotone" /> 
          </Button> 
        </li> 
        <li style={{ listStyle: 'none', width: '100%' }}> 
          <Button sx={{ position: 'relative', right: '25%' }} onClick={gotoHome}> 
            <Iconify sx={{ color: 'green', width: '50%', height: '40%' }} icon="cil:home" /> 
          </Button> 
        </li> 
        <li style={{ listStyle: 'none', width: '100%' }}> 
          <Button sx={{ position: 'relative', right: '25%' }}> 
            <Iconify 
              sx={{ color: 'green', width: '50%', height: '40%' }} 
              icon="material-symbols:history" 
            /> 
          </Button> 
        </li> 
        <li style={{ listStyle: 'none', width: '100%' }}> 
          <Button sx={{ position: 'relative', right: '25%' }}> 
            <Iconify 
              sx={{ color: 'green', width: '50%', height: '40%' }} 
              icon="ant-design:setting-outlined" 
              onClick={gotoSetting} 
            /> 
          </Button> 
        </li> 
      </ul> 
    </div> 
  ); 
}