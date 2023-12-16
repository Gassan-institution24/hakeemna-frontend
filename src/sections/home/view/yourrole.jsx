import Iconify from 'src/components/iconify';
import Button from '@mui/material/Button';
import { PATH_FOR_PATIENT, PATH_FOR_US } from 'src/config-global';
import { Box } from '@mui/system';

export default function yourrole() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        border: 1,
      }}
    >
      <h1>What is your role ?</h1>
      <Button
        color="inherit"
        variant="outlined"
        startIcon={<Iconify icon="prime:user" width={24} />}
        target="_blank"
        rel="noopener"
        href={PATH_FOR_PATIENT}
        sx={{ borderColor: 'text.primary', my: 1 }}
      >
        Patient
      </Button>
      <Button
        color="inherit"
        variant="outlined"
        startIcon={<Iconify icon="fluent-emoji-high-contrast:department-store" width={24} />}
        target="_blank"
        rel="noopener"
        href={PATH_FOR_US}
        sx={{ borderColor: 'text.primary', my: 1 }}
      >
        Unit Services
      </Button>
    </Box>
  );
}
