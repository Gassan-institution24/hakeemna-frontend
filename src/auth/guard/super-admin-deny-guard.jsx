import { m } from 'framer-motion';
import PropTypes from 'prop-types';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';
import { ForbiddenIllustration } from 'src/assets/illustrations';

import { varBounce, MotionContainer } from 'src/components/animate';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

export default function SuperAdminDenyGuard({ children, sx, permission }) {
    const { user } = useAuthContext();
    const { t } = useTranslate();
    // مش superadmin
    if (user?.role !== 'superadmin') {
        return null;
    }

    // level 1 full access
    if (user?.superadmin_level === 1) {
        return children;
    }

    // level 2 لازم permission
    if (user?.permissions?.includes(permission)) {
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


SuperAdminDenyGuard.propTypes = {
    permission: PropTypes.string.isRequired,
    children: PropTypes.node,
    sx: PropTypes.object,
};
