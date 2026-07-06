import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------
function getMergedPermissions(user) {
  const eng = user?.employee?.employee_engagements?.[user?.employee?.selected_engagement];
  if (!eng) return null;
  // is_owner engagements always get unconditional bypass (null = full access)
  if (eng.is_owner) return null;
  const allRoles = [
    ...(eng.roles?.length ? eng.roles : []),
    ...(eng.role ? [eng.role] : []),
  ];
  if (allRoles.length === 0) return null; // no RBAC roles assigned yet
  return [...new Set(allRoles.flatMap((r) => r?.permissions || []))];
}

function isOwnerEngagement(user) {
  const eng = user?.employee?.employee_engagements?.[user?.employee?.selected_engagement];
  return eng?.is_owner === true;
}

export function useAclGuard() {
  const { user } = useAuthContext();

  const checkAcl = useCallback(
    (permission) => {
      if (user?.role === 'superadmin') return true;
      // admin = unconditional full access regardless of any assigned roles / work groups.
      // Only the subscription (unit_service licence) restricts an admin (see ACLGuard below).
      if (user?.role === 'admin') return true;
      if (isOwnerEngagement(user)) return true; // unit service owner: always full access
      const perms = getMergedPermissions(user);
      if (perms === null) return false; // no RBAC roles assigned yet
      return perms.includes(permission);
    },
    [user]
  );
  return checkAcl;
}

export default function ACLGuard({ permission, children, sx }) {
  const { user } = useAuthContext();
  const { t } = useTranslate();

  const currentEngagement =
    user?.employee?.employee_engagements?.[user.employee.selected_engagement];
  const owner = currentEngagement?.is_owner === true;
  const mergedPerms = getMergedPermissions(user);
  const permArray = mergedPerms || [];

  if (
    currentEngagement?.unit_service?.status !== 'active' &&
    !permission?.startsWith('unit_service_info:')
  ) {
    return (
      <Container maxWidth="lg" component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            {t('unit of service Licence expired')}
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            {t('You cannot access data from this unit of service')}
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
        {(owner || permArray.includes('unit_service_info:create')) && (
          <Button
            component={RouterLink}
            href="/dashboard/us/profile/subscriptions/new"
            size="large"
            variant="contained"
          >
            {t('Add new licence')}
          </Button>
        )}
      </Container>
    );
  }

  const hasAccess =
    user?.role === 'superadmin' ||
    user?.role === 'admin' ||
    owner ||
    mergedPerms?.includes(permission);

  if (hasAccess) {
    return children;
  }

  return (
    <Container maxWidth="lg" component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
      <m.div variants={varBounce().in}>
        <Typography variant="h3" sx={{ mb: 2 }}>
          {t('Permission Denied')}
        </Typography>
      </m.div>

      <m.div variants={varBounce().in}>
        <Typography sx={{ color: 'text.secondary' }}>
          {t('You do not have permission to access this page')}
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

ACLGuard.propTypes = {
  children: PropTypes.node,
  permission: PropTypes.string,
  sx: PropTypes.object,
};
