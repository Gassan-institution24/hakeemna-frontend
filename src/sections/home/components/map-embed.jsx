import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function MapEmbed({ address, locationGps }) {
  const { t } = useTranslate();

  // locationGps is typically a maps.app.goo.gl share link, not a geocodable string, so the
  // embeddable iframe must be built from the address text. The share link is still the most
  // accurate target for "get directions", so it's used there instead.
  if (!address) {
    return null;
  }

  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;

  return (
    <Stack spacing={1.5}>
      <Box
        component="iframe"
        title={t('location on map')}
        src={embedSrc}
        loading="lazy"
        sx={{
          width: 1,
          height: 280,
          border: 0,
          borderRadius: 2,
        }}
      />
      <Button
        variant="outlined"
        color="inherit"
        startIcon={<Iconify icon="solar:map-arrow-square-bold" />}
        onClick={() => window.open(locationGps || embedSrc, '_blank', 'noopener')}
        sx={{ alignSelf: 'flex-start' }}
      >
        {t('get directions')}
      </Button>
    </Stack>
  );
}

MapEmbed.propTypes = {
  address: PropTypes.string,
  locationGps: PropTypes.string,
};
