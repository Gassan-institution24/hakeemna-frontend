import { paths } from 'src/routes/paths';

import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: '/',
  },
  {
    title: 'About us',
    icon: <Iconify icon="mdi:about" />,
    path: paths.pages.About,
  },
  {
    title: 'beneficiaries',
    icon: <Iconify icon="ph:users" />,
    path: paths.pages.patients,
  },
  {
    title: 'units of service',
    icon: <Iconify icon="la:hospital-solid" />,
    path: paths.pages.unit,
  },
  // {
  //   title: 'R&D',
  //   icon: <Iconify icon="solar:notebook-bold-duotone" />,
  //   path: 'https://front-pi-eight.vercel.app',
  //   sectionId: 'home',
  // },
  {
    title: 'Blogs',
    icon: <Iconify icon="iconoir:community" />,
    path: paths.pages.blogs,
    sectionId: 'blogs',
  },
  {
    title: 'Training',
    icon: <Iconify icon="oui:training" />,
    path: paths.pages.Training,
    sectionId: 'home',
  },
  {
    button: 'Book Appointment',
    icon: <Iconify icon="streamline:waiting-appointments-calendar" />,
    path: paths?.pages.book,
  },
  {
    button: 'Login',
    icon: <Iconify icon="material-symbols:login" />,
    path: PATH_AFTER_LOGIN,
  },
  {
    button: 'join as unit of service',
    icon: <Iconify icon="mdi:register" />,
    path: paths.auth.registersu,
  },
  {
    button: 'join as supplier',
    icon: <Iconify icon="mdi:register" />,
    path: paths.auth.stakeholderRegister,
  },
  {
    button: 'join as user',
    icon: <Iconify icon="mdi:register" />,
    path: paths.auth.register,
  },
];
