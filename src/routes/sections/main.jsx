import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import MainLayout from 'src/layouts/main';
import CompactLayout from 'src/layouts/compact';

import { SplashScreen } from 'src/components/loading-screen';
import Privacypolicy from 'src/components/terms_conditionAndPrivacy_policy/privacyPolicy';
import TermsAndCondition from 'src/components/terms_conditionAndPrivacy_policy/termsAndCondition';

// ----------------------------------------------------------------------

export const HomePage = lazy(() => import('src/pages/home/home'));

const MaintenancePage = lazy(() => import('src/pages/maintenance'));
const UsPricing = lazy(() => import('src/sections/home/view/usPricing'));
const AboutUs = lazy(() => import('src/sections/home/moreInfoAboutUs'));

const Patientsservices = lazy(() => import('src/pages/home/patients'));
const Unitservices = lazy(() => import('src/pages/home/unit'));
const ServiceUnitPage = lazy(() => import('src/pages/home/service-unit'));
const Training = lazy(() => import('src/sections/home/training'));
const FAQ = lazy(() => import('src/sections/home/FAQ'));
const Blogs = lazy(() => import('src/sections/home/Blogs'));
const BookAppointment = lazy(() => import('src/pages/home/book'));
const DoctorPage = lazy(() => import('src/pages/home/doctor-page'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <MainLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </MainLayout>
    ),
    children: [
      { path: 'patients', element: <Patientsservices /> },
      { path: 'termsandcondition', element: <TermsAndCondition /> },
      { path: 'privacypolicy', element: <Privacypolicy /> },
      { path: 'units', element: <Unitservices /> },
      { path: 'UsPricing', element: <UsPricing /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'about', element: <AboutUs /> },
      { path: 'training', element: <Training /> },
      { path: 'faq', element: <FAQ /> },
      { path: 'blogs', element: <Blogs /> },
      { path: 'book', element: <BookAppointment /> },
      { path: 'doctor/:name', element: <DoctorPage /> },
      { path: 'serviceunit/:id', element: <ServiceUnitPage /> },
    ],
  },
  {
    element: (
      <CompactLayout>
        <Suspense fallback={<SplashScreen />}>
          <Outlet />
        </Suspense>
      </CompactLayout>
    ),
    children: [{ path: 'maintenance', element: <MaintenancePage /> }],
  },
];
