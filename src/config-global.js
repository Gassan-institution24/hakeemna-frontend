import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

// export const HOST_API = 'http://localhost:3000/';
export const HOST_API = 'http://localhost:3000';
export const ASSETS_API = 'http://localhost:3000';
// export const HOST_API =  'https://doctorna-mauve.vercel.app';
// export const ASSETS_API = 'https://doctorna-mauve.vercel.app';

export const FIREBASE_API = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

export const AMPLIFY_API = {
  userPoolId: process.env.REACT_APP_AWS_AMPLIFY_USER_POOL_ID,
  userPoolWebClientId: process.env.REACT_APP_AWS_AMPLIFY_USER_POOL_WEB_CLIENT_ID,
  region: process.env.REACT_APP_AWS_AMPLIFY_REGION,
};

export const AUTH0_API = {
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
  domain: process.env.REACT_APP_AUTH0_DOMAIN,
  callbackUrl: process.env.REACT_APP_AUTH0_CALLBACK_URL,
};

export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root;
export const PATH_BEFORE_LOGIN = paths.between.root;
export const PATH_FOR_PATIENT_SERVICES = paths.pages.patients;
export const PATH_FOR_US_SERVICES = paths.pages.unit;
export const PATH_FOR_US =
  'https://www.prestashop.com/sites/default/files/wysiwyg/404_not_found.png';
export const PATH_FOR_PATIENT =
  'https://www.prestashop.com/sites/default/files/wysiwyg/404_not_found.png';
