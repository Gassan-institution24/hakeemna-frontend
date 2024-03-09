import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useGetwgroupEmployeeEngs } from 'src/api';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------
export function useAclGuard() {
  const { user } = useAuthContext();
  const { data } = useGetwgroupEmployeeEngs(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
  );
  const checkAcl = useCallback(
    ({ category, subcategory, acl }) => {
      const currentACL =
        user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.acl;
      if (category === 'work_group') {
        return (
          data?.some((eng) => eng?.acl?.[subcategory]?.includes(acl)) ||
          currentACL?.department?.[subcategory]?.includes(acl) ||
          currentACL?.unit_service?.[subcategory]?.includes(acl) ||
          false
        );
      }
      if (category === 'department') {
        return (
          currentACL?.department?.[subcategory]?.includes(acl) ||
          currentACL?.unit_service?.[subcategory]?.includes(acl) ||
          false
        );
      }
      return currentACL?.[category]?.[subcategory]?.includes(acl);
    },
    [user, data]
  );
  return checkAcl;
}
export default function ACLGuard({ category, subcategory, acl, children, sx }) {
  const { user } = useAuthContext();

  const currentACL = user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.acl;

  const { data } = useGetwgroupEmployeeEngs(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
  );

  if (category === 'work_group') {
    if (
      !data?.some((eng) => eng?.acl?.[subcategory]?.includes(acl)) ||
      currentACL?.department?.[subcategory]?.includes(acl) ||
      currentACL?.unit_service?.[subcategory]?.includes(acl)
    ) {
      return children;
    }
  }
  if (category === 'department') {
    if (
      currentACL?.department?.[subcategory]?.includes(acl) ||
      currentACL?.unit_service?.[subcategory]?.includes(acl)
    ) {
      return children;
    }
  }
  if (currentACL?.[category]?.[subcategory]?.includes(acl)) {
    return children;
  }

  return (
    <Container maxWidth="lg" component={MotionContainer} sx={{ textAlign: 'center', ...sx }}>
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
  );
}

ACLGuard.propTypes = {
  children: PropTypes.node,
  acl: PropTypes.string,
  category: PropTypes.string,
  subcategory: PropTypes.string,
  sx: PropTypes.object,
};
