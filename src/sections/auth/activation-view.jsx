import { useState, useEffect } from 'react';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { EmailInboxIcon } from 'src/assets/icons';

// ----------------------------------------------------------------------

export default function ActivationView() {
  const { token } = useParams();

  const [error, setError] = useState();

  useEffect(() => {
    async function activation() {
      try {
        await axios.get(endpoints.auth.activate(token));
      } catch (e) {
        setError(e.message);
      }
    }
    activation();
  }, [token]);
  const renderHead = (
    <>
      <EmailInboxIcon sx={{ height: 96 }} />

      <Stack spacing={1} sx={{ my: 5 }}>
        {!error && (
          <Typography variant="h3" sx={{ color: 'success.main' }}>
            Your account has activated successfully!
          </Typography>
        )}
        {error && (
          <Typography variant="h3" sx={{ color: 'error.main' }}>
            {error}
          </Typography>
        )}

        {!error && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            We are absolutely delighted to have you here
          </Typography>
        )}
        {error === 'invalid token!' && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Please enter a valid token!
          </Typography>
        )}
        {error === 'Token has expired!' && (
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            We have sent you a new one, please check your email again!
          </Typography>
        )}
      </Stack>
    </>
  );

  return <>{renderHead}</>;
}
