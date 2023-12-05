import { paramCase } from 'src/utils/change-case';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  SUPERADMIN: '/super',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneUI: 'https://mui.com/store/items/zone-landing-page/',
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figma:
    'https://www.figma.com/file/hjxMnGUJCjY7pX8lQbS7kn/%5BPreview%5D-Minimal-Web.v5.4.0?type=design&node-id=0-1&mode=design&t=2fxnS70DuiTLGzND-0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id) => `/product/${id}`,
    demo: {
      details: `/product/${MOCK_ID}`,
    },
  },
  post: {
    root: `/post`,
    details: (title) => `/post/${paramCase(title)}`,
    demo: {
      details: `/post/${paramCase(MOCK_TITLE)}`,
    },
  },
  // AUTH
  auth: {
    amplify: {
      login: `${ROOTS.AUTH}/amplify/login`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      register: `${ROOTS.AUTH}/amplify/register`,
      newPassword: `${ROOTS.AUTH}/amplify/new-password`,
      forgotPassword: `${ROOTS.AUTH}/amplify/forgot-password`,
    },
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
    firebase: {
      login: `${ROOTS.AUTH}/firebase/login`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      register: `${ROOTS.AUTH}/firebase/register`,
      forgotPassword: `${ROOTS.AUTH}/firebase/forgot-password`,
    },
    auth0: {
      login: `${ROOTS.AUTH}/auth0/login`,
    },
  },
  authDemo: {
    classic: {
      login: `${ROOTS.AUTH_DEMO}/classic/login`,
      register: `${ROOTS.AUTH_DEMO}/classic/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/classic/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/classic/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/classic/verify`,
    },
    modern: {
      login: `${ROOTS.AUTH_DEMO}/modern/login`,
      register: `${ROOTS.AUTH_DEMO}/modern/register`,
      forgotPassword: `${ROOTS.AUTH_DEMO}/modern/forgot-password`,
      newPassword: `${ROOTS.AUTH_DEMO}/modern/new-password`,
      verify: `${ROOTS.AUTH_DEMO}/modern/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}`,
      edit: (title) => `${ROOTS.DASHBOARD}/post/${paramCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${paramCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
  // super adnim
  superadmin: {
    root: ROOTS.SUPERADMIN,
    
    tables: {
      root: `${ROOTS.SUPERADMIN}/tables`,
      list: `${ROOTS.SUPERADMIN}/tables/list`,
      details:(tablename)=> `${ROOTS.SUPERADMIN}/tables/${tablename}`,
      cities:{
        root: `${ROOTS.SUPERADMIN}/tables/cities`,
        new: `${ROOTS.SUPERADMIN}/tables/cities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/cities/edit/${id}`,
      },
      countries:{
        root: `${ROOTS.SUPERADMIN}/tables/countries`,
        new: `${ROOTS.SUPERADMIN}/tables/countries/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/countries/edit/${id}`,
      },
      taxes:{
        root: `${ROOTS.SUPERADMIN}/tables/added_value_taxes`,
        new: `${ROOTS.SUPERADMIN}/tables/added_value_taxes/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/added_value_taxes/edit/${id}`,
      },
      analysis:{
        root: `${ROOTS.SUPERADMIN}/tables/analyses`,
        new: `${ROOTS.SUPERADMIN}/tables/analyses/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/analyses/edit/${id}`,
      },
      appointypes:{
        root: `${ROOTS.SUPERADMIN}/tables/appointment_types`,
        new: `${ROOTS.SUPERADMIN}/tables/appointment_types/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/appointment_types/edit/${id}`,
      },
      currency:{
        root: `${ROOTS.SUPERADMIN}/tables/currencies`,
        new: `${ROOTS.SUPERADMIN}/tables/currencies/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/currencies/edit/${id}`,
      },
      departments:{
        root: `${ROOTS.SUPERADMIN}/tables/departments`,
        new: `${ROOTS.SUPERADMIN}/tables/departments/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/departments/edit/${id}`,
      },
      diets:{
        root: `${ROOTS.SUPERADMIN}/tables/diets`,
        new: `${ROOTS.SUPERADMIN}/tables/diets/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/diets/edit/${id}`,
      },
      diseases:{
        root: `${ROOTS.SUPERADMIN}/tables/diseases`,
        new: `${ROOTS.SUPERADMIN}/tables/diseases/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/diseases/edit/${id}`,
      },
      freesub:{
        root: `${ROOTS.SUPERADMIN}/tables/free_subscriptions`,
        new: `${ROOTS.SUPERADMIN}/tables/free_subscriptions/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/free_subscriptions/edit/${id}`,
      },
      insurancecomapnies:{
        root: `${ROOTS.SUPERADMIN}/tables/insurance_companies`,
        new: `${ROOTS.SUPERADMIN}/tables/insurance_companies/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/insurance_companies/edit/${id}`,
      },
      medcategories:{
        root: `${ROOTS.SUPERADMIN}/tables/medical_categories`,
        new: `${ROOTS.SUPERADMIN}/tables/medical_categories/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/medical_categories/edit/${id}`,
      },
      medicines:{
        root: `${ROOTS.SUPERADMIN}/tables/medicines`,
        new: `${ROOTS.SUPERADMIN}/tables/medicines/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/medicines/edit/${id}`,
      },
      medfamilies:{
        root: `${ROOTS.SUPERADMIN}/tables/medicines_families`,
        new: `${ROOTS.SUPERADMIN}/tables/medicines_families/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/medicines_families/edit/${id}`,
      },
      specialities:{
        root: `${ROOTS.SUPERADMIN}/tables/specialities`,
        new: `${ROOTS.SUPERADMIN}/tables/specialities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/specialities/edit/${id}`,
      },
      subspecialities:{
        root: `${ROOTS.SUPERADMIN}/tables/sub_specialities`,
        new: `${ROOTS.SUPERADMIN}/tables/sub_specialities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/sub_specialities/edit/${id}`,
      },
      surgeries:{
        root: `${ROOTS.SUPERADMIN}/tables/surgeries`,
        new: `${ROOTS.SUPERADMIN}/tables/surgeries/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/surgeries/edit/${id}`,
      },
      symptoms:{
        root: `${ROOTS.SUPERADMIN}/tables/symptoms`,
        new: `${ROOTS.SUPERADMIN}/tables/symptoms/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/symptoms/edit/${id}`,
      },
      unitservices:{
        root: `${ROOTS.SUPERADMIN}/tables/unit_services`,
        new: `${ROOTS.SUPERADMIN}/tables/unit_services/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/unit_services/edit/${id}`,
      },
    },
    
  },
};
