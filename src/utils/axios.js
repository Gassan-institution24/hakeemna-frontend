import axios from 'axios';

import { HOST_API } from 'src/config-global';
// import { idText } from 'typescript';



// https://axios-http.com/docs/instance
// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {

  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  allTables:'/tables',
  tables:{
    countries:`/api/countries`,
    cities:'/api/cities',
    city:(id)=>`/api/cities/${id}`,
    unitservices:'/api/unitservice',
    departments:'/api/departments',
  },
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/register',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  patients:{
    onepatients: '/api/patient',
  },
  appointment:{
    patientsappointments: '/api/appointments/patient/656c76046ceed235b42948a0',
  }
};
