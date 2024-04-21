import { paths } from 'src/routes/paths';

import { PATH_AFTER_LOGIN } from 'src/config-global';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export const navConfig = [
  {
    title: 'Home',
    icon: <Iconify icon="solar:home-2-bold-duotone" />,
    path: '/',
    sectionId: 'home',
  },
  {
    title: 'About',
    icon: <Iconify icon="mdi:about" />,
    path: paths.pages.About,
    sectionId: 'About',
  },
  {
    title: 'Services',
    icon: <Iconify icon="medical-icon:social-services" />,
    path: '#',
    sectionId: 'services',
  },
  {
    title: 'R&D',
    icon: <Iconify icon="solar:notebook-bold-duotone" />,
    path: 'https://front-pi-eight.vercel.app',
    sectionId: 'home',
  },
  {
    title: 'Training',
    icon: <Iconify icon="oui:training" />,
    path: paths.comingSoon,
    sectionId: 'home',
  },
  {
    button: 'Login',
    icon: <Iconify icon="material-symbols:login" />,
    path: PATH_AFTER_LOGIN,
  },
  {
    button: 'Signup',
    icon: <Iconify icon="mdi:register" />,
    path: paths?.auth.register,
  },
];
