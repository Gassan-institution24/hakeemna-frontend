import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------
export function useAclGuard() {
  const { user } = useAuthContext();
  const checkAcl = useCallback(
    (category, subcategory, acl) => {
      const currentACL =
        user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.acl;
      return typeof acl === 'undefined' || !currentACL?.[category]?.[subcategory]?.includes(acl);
    },
    [user]
  );
  return checkAcl;
}
export default function ACLGuard({ hasContent, category, subcategory, acl, children, sx }) {
  const { user } = useAuthContext();

  const currentACL = user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.acl;

  if (
    typeof acl === 'undefined' ||
    (!currentACL?.[category]?.[subcategory]?.includes(acl) && user?.role !== 'superadmin')
  ) {
    return hasContent ? (
      <Container component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
        <m.div variants={varBounce().in}>
          <Typography variant="h3" sx={{ mb: 2 }}>
            Permission Denied
          </Typography>
        </m.div>

        <m.div variants={varBounce().in}>
          <Typography sx={{ color: 'text.secondary' }}>
            You do not have permission to access this page
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
    ) : (
      false
    );
  }

  return <> {hasContent ? children : true} </>;
}

ACLGuard.propTypes = {
  children: PropTypes.node,
  hasContent: PropTypes.bool,
  acl: PropTypes.string,
  category: PropTypes.string,
  subcategory: PropTypes.string,
  sx: PropTypes.object,
};
