import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { useCallback } from 'react';

import { Button } from '@mui/material';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';
import { useGetwgroupEmployeeEngs } from 'src/api';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------
export function useAclGuard() {
  const { user } = useAuthContext();
  const { data } = useGetwgroupEmployeeEngs(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]._id
  );

  const checkAcl = useCallback(
    ({ category, subcategory, acl }) => {
      // if (
      //   user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?.status !==
      //   'active'
      // ) {
      //   return false;
      // }
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
  const { t } = useTranslate();

  const currentACL = user?.employee?.employee_engagements?.[user.employee.selected_engagement].acl;

  const { data } = useGetwgroupEmployeeEngs(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]._id
  );

  if (
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service
      ?.status !== 'active' &&
    subcategory !== 'unit_service_info'
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
        {currentACL?.unit_service?.unit_service_info?.includes('create') && (
          <Button
            component={RouterLink}
            href="/dashboard/us/subscriptions/new"
            size="large"
            variant="contained"
          >
            {t('Add new licence')}
          </Button>
        )}
      </Container>
    );
  }

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
  acl: PropTypes.string,
  category: PropTypes.string,
  subcategory: PropTypes.string,
  sx: PropTypes.object,
};
