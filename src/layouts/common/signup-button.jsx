import PropTypes from 'prop-types';

import Button from '@mui/material/Button';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

export default function SigupButton({ sx }) {
  const { t } = useTranslate();

  return (
    <Button
      onClick={() => {
        document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
      component={RouterLink}
      variant="outlined"
      sx={{
        mr: 3,
        ...sx,
        bgcolor: 'success.main',
        color: '#fff',
        '&:hover': {
          bgcolor: '#fff',
          color: 'success.main',
        },
      }}
    >
      {t('sign up')}
    </Button>
  );
}

SigupButton.propTypes = {
  sx: PropTypes.object,
};
