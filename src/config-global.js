import { paths } from 'src/routes/paths';

// API
// ----------------------------------------------------------------------

export const HOST_API = process.env.REACT_APP_API_URL;
export const ASSETS_API = process.env.REACT_APP_API_URL;

// export const MAPBOX_API = process.env.REACT_APP_MAPBOX_API;

// ROOT PATH AFTER LOGIN SUCCESSFUL
export const PATH_AFTER_LOGIN = paths.dashboard.root;
export const PATH_AFTER_SIGNUP = paths.auth.verify;
export const PATH_BEFORE_LOGIN = paths.between.root;
export const PATH_FOR_PATIENT_SERVICES = paths.pages.patients;
export const PATH_FOR_US_SERVICES = paths.pages.unit;
export const PATH_FOR_US =
  'https://www.prestashop.com/sites/default/files/wysiwyg/404_not_found.png';
export const PATH_FOR_PATIENT =
  'https://www.prestashop.com/sites/default/files/wysiwyg/404_not_found.png';
