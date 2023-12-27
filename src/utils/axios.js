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
  allTables: '/tables',
  tables: {
    countries: `/api/countries`,
    country: (id) => `/api/countries/${id}`,
    cities: '/api/cities',
    city: (id) => `/api/cities/${id}`,
    surgeries: '/api/surgeries',
    surgery: (id) => `/api/surgeries/${id}`,
    diseases: '/api/diseases',
    disease: (id) => `/api/diseases/${id}`,
    symptoms: '/api/symptoms',
    symptom: (id) => `/api/symptoms/${id}`,
    categories: '/api/medcategories',
    category: (id) => `/api/medcategories/${id}`,
    currencies: '/api/currency',
    currency: (id) => `/api/currency/${id}`,
    medfamilies: '/api/drugfamilies',
    medfamily: (id) => `/api/drugfamilies/${id}`,
    medicines: '/api/medicines',
    medicine: (id) => `/api/medicines/${id}`,
    diets: '/api/diets',
    diet: (id) => `/api/diets/${id}`,
    analyses: '/api/analysis',
    analysis: (id) => `/api/analysis/${id}`,
    insuranceCos: '/api/insurance/companies',
    insuranceCo: (id) => `/api/insurance/companies/${id}`,
    insuranceTypes: '/api/insurance/types',
    insuranceType: (id) => `/api/insurance/types/${id}`,
    unitservices: '/api/unitservice',
    unitservice: (id) => `/api/unitservice/${id}`,
    departments: '/api/departments',
    department: (id) => `/api/departments/${id}`,
    specialities: '/api/specialities',
    speciality: (id) => `/api/specialities/${id}`,
    subspecialties: '/api/subspecialities',
    subspeciality: (id) => `/api/subspecialities/${id}`,
    appointmenttypes: '/api/appointments/types',
    appointmenttype: (id) => `/api/appointments/types/${id}`,
    freesubscriptions: '/api/freesubscription',
    freesubscription: (id) => `/api/freesubscription/${id}`,
    unitservicetypes: '/api/ustypes',
    unitservicetype: (id) => `/api/ustypes/${id}`,
    taxes: '/api/taxes',
    tax: (id) => `/api/taxes/${id}`,
    activities: '/api/activities',
    activity: (id) => `/api/activities/${id}`,
    employeetypes: '/api/employeetypes',
    employeetype: (id) => `/api/employeetypes/${id}`,
    employees: '/api/employees',
    employee: (id) => `/api/employees/${id}`,
    paymentmethods: '/api/paymentmethod',
    paymentmethod: (id) => `/api/paymentmethod/${id}`,
    stakeholdertypes: '/api/stakeholdertype',
    stakeholdertype: (id) => `/api/stakeholdertype/${id}`,
    stakeholders: '/api/stakeholder',
    stakeholder: (id) => `/api/stakeholder/${id}`,
    workshifts: '/api/wshifts',
    workshift: (id) => `/api/wshifts/${id}`,
    servicetypes: '/api/servicetypes',
    servicetype: (id) => `/api/servicetypes/${id}`,
    measurmenttypes: '/api/measurementtypes',
    measurmenttype: (id) => `/api/measurementtypes/${id}`,
    hospitals: '/api/hospital',
    hospital: (id) => `/api/hospital/${id}`,
    deductions: '/api/deductionconfig',
    deduction: (id) => `/api/deductionconfig/${id}`,
    rooms: '/api/rooms',
    room: (id) => `/api/rooms/${id}`,
    patients: '/api/patient',
    patient: (id) => `/api/patient/${id}`,
    unitServiceLicenseMovement: (id) => `/api/licensemovements/unitservice/${id}`,
    unitServiceLicenseMovements: `/api/licensemovements/unitservice`,
    stakeholderLicenseMovement: (id) => `/api/licensemovements/stakeholder/${id}`,
    stakeholderLicenseMovements: `/api/licensemovements/stakeholder`,
    licenseMovement: (id) => `/api/licensemovements/${id}`,
    licenseMovements: `/api/licensemovements`,
    subscriptions: '/api/subscription',
    subscription: (id) => `/api/subscription/${id}`,
    feedbacks: '/api/feedback',
    USfeedbacks: (id) => `/api/feedback/unitservice/${id}`,
    patientfeedbacks: (id) => `/api/feedback/patient/${id}`,
    stakeholderFeedbacks: (id) => `/api/feedback/stakeholder/${id}`,
    feedback: (id) => `/api/feedback/${id}`,
    appointments: '/api/appointments',
    availableAppointments: '/api/appointments/available',
    appointment: (id) => `/api/appointments/${id}`,
    patientAppointments: (id) => `/api/appointments/patient/${id}`,
    economecMovements: '/api/economicmovements',
    economicMovement: (id) => `/api/economicmovements/${id}`,
    patienteconomicMovements: (id) => `/api/economicmovements/patient/${id}`,
    stakeholdereconomicMovements: (id) => `/api/economicmovements/stakeholder/${id}`,
    incomePaymentControl: '/api/incomepayment',
    incomePayment: (id) => `/api/incomepayment/${id}`,
    offers: '/api/suppliersoffers',
    offer: (id) => `/api/suppliersoffers/${id}`,
    stakeholderOffers: (id) => `/api/suppliersoffers/stakeholder/${id}`,
    patientIncomePaymentControl: (id) => `/api/incomepayment/patient/${id}`,
    stakeholderIncomePaymentControl: (id) => `/api/incomepayment/stakeholder/${id}`,
  },
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    login: '/api/auth/login',
    register: '/api/auth/signup',
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

  // patients:{
  //   onepatients: '/api/patient/656af6ccac70bc1aa4120dad',
  // },
  offers: {
    getoffers: '/api/suppliersoffers',
    getoffer: (id) => `/api/suppliersoffers/${id}`,
  },
  stakeholder: {
    getstakeholder: '/api/stakeholder',
  },
  posts: {
    getAll: '/api/post',
  },
  countries: {
    getAllcountries: '/api/countries/',
  },
  payment: {
    getAllpaymentmethods: '/api/paymentmethods',
  },
};
