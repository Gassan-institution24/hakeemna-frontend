import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { isDemoUser } from 'src/utils/demo';

import { useTranslate } from 'src/locales';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

/**
 * Blocks a whole route subtree for demo/trial accounts and explains why.
 *
 * Used for features a trial deliberately does not include — blogs today. Unlike a plain
 * `return null`, this renders a message, so a demo user who follows an old link or bookmark
 * understands the feature is withheld rather than broken.
 *
 * Follows the same shape as SuperAdminDenyGuard: wraps an <Outlet /> in the route definition.
 * Normal accounts pass straight through, so this is inert for everyone else.
 */
export default function DemoDenyGuard({ children, sx }) {
  const { user } = useAuthContext();
  const { t } = useTranslate();

  if (!isDemoUser(user)) {
    return children;
  }

  return (
    <Container maxWidth="lg" component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('Not available for demo accounts')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('This feature is not included in the demo account.')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <ForbiddenIllustration
          sx={{
            height: 260,
            my: { xs: 5, sm: 10 },
          }}
        />
      </m.div>
    </Container>
  );
}

DemoDenyGuard.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
