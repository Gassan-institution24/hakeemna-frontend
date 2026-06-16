import PropTypes from 'prop-types';

import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import useScrollTrigger from '@mui/material/useScrollTrigger';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function StickyBookingBar({ title, priceLabel, ctaLabel, onBook, threshold = 360 }) {
  const { t } = useTranslate();
  const trigger = useScrollTrigger({ disableHysteresis: true, threshold });

  return (
    <Slide appear={false} direction="down" in={trigger}>
      <Paper
        elevation={6}
        sx={{
          position: 'fixed',
          top: 0,
          insetInlineStart: 0,
          insetInlineEnd: 0,
          zIndex: (theme) => theme.zIndex.appBar + 1,
          borderRadius: 0,
        }}
      >
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            sx={{ py: 1.5 }}
          >
            <Stack sx={{ overflow: 'hidden' }}>
              <Typography variant="subtitle2" noWrap>
                {title}
              </Typography>
              {priceLabel && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {priceLabel}
                </Typography>
              )}
            </Stack>
            <Button variant="contained" onClick={onBook} sx={{ flexShrink: 0 }}>
              {ctaLabel || t('book appointment')}
            </Button>
          </Stack>
        </Container>
      </Paper>
    </Slide>
  );
}

StickyBookingBar.propTypes = {
  title: PropTypes.node,
  priceLabel: PropTypes.node,
  ctaLabel: PropTypes.node,
  onBook: PropTypes.func,
  threshold: PropTypes.number,
};
