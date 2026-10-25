import PropTypes from 'prop-types';
import { lazy, Suspense } from 'react';
import { Navigate } from 'react-router-dom';

import { paths } from 'src/routes/paths';

import MainLayout from 'src/layouts/main';
import DashboardLayout from 'src/layouts/dashboard';
import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';
import useSpecialityGuard from 'src/auth/guard/speciality-guard';

import { SplashScreen, LoadingScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

// Entry URLs of the two products. They add pages; every existing route is untouched and
// the screens behind them (patients, appointments, accounting, the dental chart) stay
// at their /dashboard URLs with their own guards.

const HomePage = lazy(() => import('src/pages/home/home'));
const DentalLandingPage = lazy(() => import('src/pages/dental/landing'));
const DentalDashboardPage = lazy(() => import('src/pages/dental/dashboard'));

// The dental dashboard is for dentists. Anyone else is sent to the dashboard they had
// before, rather than shown a product that does not match their speciality.
function DentistOnly({ children }) {
  const { isDentist } = useSpecialityGuard();

  if (!isDentist) {
    return <Navigate to={paths.dashboard.root} replace />;
  }

  return children;
}

DentistOnly.propTypes = {
  children: PropTypes.node,
};

// ----------------------------------------------------------------------

export const experienceRoutes = [
  {
    path: 'dental',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <DentalLandingPage />
        </MainLayout>
      </Suspense>
    ),
  },
  {
    path: 'dental/dashboard',
    element: (
      <AuthGuard>
        <RoleBasedGuard hasContent roles={['admin', 'employee']}>
          <DentistOnly>
            <DashboardLayout>
              <Suspense fallback={<LoadingScreen />}>
                <DentalDashboardPage />
              </Suspense>
            </DashboardLayout>
          </DentistOnly>
        </RoleBasedGuard>
      </AuthGuard>
    ),
  },
  {
    path: 'medicine',
    element: (
      <Suspense fallback={<SplashScreen />}>
        <MainLayout>
          <HomePage />
        </MainLayout>
      </Suspense>
    ),
  },
  {
    path: 'medicine/dashboard',
    element: <Navigate to={paths.dashboard.root} replace />,
  },
];
