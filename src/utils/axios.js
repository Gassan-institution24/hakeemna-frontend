import axios from 'axios';

import { HOST_API } from 'src/config-global';
// import { idText } from 'typescript';

// https://axios-http.com/docs/instance
// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'check internet connection')
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
  mail: '/mail',
  allTables: '/tables',
  countries: {
    all: '/api/countries/',
    many: '/api/countries/many',
    one: (id) => (!id ? null : `/api/countries/${id}`),
  },
  cities: {
    all: '/api/cities/',
    many: '/api/cities/many',
    one: (id) => (!id ? null : `/api/cities/${id}`),
    country: (id) => (!id ? null : `/api/cities/country/${id}`),
  },
  products: {
    all: '/api/products/',
    many: '/api/products/many',
    one: (id) => (!id ? null : `/api/products/${id}`),
    stakeholder: (id) => (!id ? null : `/api/products/stakeholder/${id}`),
  },
  productcategories: {
    all: '/api/productcategories/',
    many: '/api/productcategories/many',
    one: (id) => (!id ? null : `/api/productcategories/${id}`),
  },
  blogs: {
    all: '/api/blogs/',
    one: (id) => `/api/blogs/${id}`,
    user: (id) => `/api/blogs/user/${id}`,
  },
  currency: {
    all: '/api/currency/',
    many: '/api/currency/many',
    one: (id) => (!id ? null : `/api/currency/${id}`),
  },
  companies: {
    all: '/api/companies/',
    many: '/api/companies/many',
    one: (id) => (!id ? null : `/api/companies/${id}`),
  },
  doctors: {
    all: '/api/doctors/',
    many: '/api/doctors/many',
    one: (id) => (!id ? null : `/api/doctors/${id}`),
  },
  diets: {
    all: '/api/diets/',
    many: '/api/diets/many',
    one: (id) => (!id ? null : `/api/diets/${id}`),
  },
  diseases: {
    all: '/api/diseases/',
    many: '/api/diseases/many',
    one: (id) => (!id ? null : `/api/diseases/${id}`),
  },
  analyses: {
    all: '/api/analysis/',
    many: '/api/analysis/many',
    one: (id) => (!id ? null : `/api/analysis/${id}`),
  },
  hospitals: {
    all: '/api/hospital',
    many: '/api/hospital/many',
    one: (id) => (!id ? null : `/api/hospital/${id}`),
  },
  medCategories: {
    all: '/api/medCategories/',
    many: '/api/medCategories/many',
    one: (id) => (!id ? null : `/api/medCategories/${id}`),
  },
  oldmedicalreports: {
    all: '/api/oldmedicalreports/',
    patient: (id) => (!id ? null : `/api/oldmedicalreports/patient/${id}`),
    one: (id) => (!id ? null : `/api/oldmedicalreports/${id}`),
    findReport: ({ name }) => `/api/oldmedicalreports/report?name=${name}`,
  },
  patientMedicalAnalysis: {
    all: '/api/patientanalysis/',
    one: (id) => (!id ? null : `/api/patientanalysis/${id}`),
    patient: (id) => (!id ? null : `/api/patientanalysis/patient/${id}`),
  },
  medicalreports: {
    all: '/api/examination/',
    one: (id) => (!id ? null : `/api/examination/${id}`),
    entrance: (id) => (!id ? null : `/api/examination/entranceExamination/${id}`),
    patiet: (id) => (!id ? null : `/api/examination/patiet/${id}`),
  },
  doctorreport: {
    all: '/api/doctorreport/',
    one: (id) => (!id ? null : `/api/doctorreport/${id}`),
    entrance: (id) => (!id ? null : `/api/doctorreport/entrancedoctorreport/${id}`),
    patiet: (id) => (!id ? null : `/api/doctorreport/patiet/${id}`),
  },
  sickleave: {
    all: '/api/sickleave/',
    one: (id) => (!id ? null : `/api/sickleave/patient/${id}`),
    onee: (id) => (!id ? null : `/api/sickleave/${id}`),
    entrance: (id) => (!id ? null : `/api/sickleave/entrancesickleave/${id}`),
  },
  uspcommunication: {
    all: '/api/uspcommunication/',
    one: (id) => (!id ? null : `/api/uspcommunication/patient/${id}`),
    onee: (id) => (!id ? null : `/api/uspcommunication/${id}`),
    entrance: (id) => (!id ? null : `/api/uspcommunication/entrance/${id}`),
  },
  drugs: {
    all: '/api/drugs/',
    taken: '/api/drugs/taken',
    one: (id) => (!id ? null : `/api/drugs/${id}`),
    patient: (id) => (!id ? null : `/api/drugs/patient/${id}`),
  },
  adjustabledocument: {
    all: '/api/adjustabledocument/',
    one: (id) => (!id ? null : `/api/adjustabledocument/${id}`),
    employee: (id) => (!id ? null : `/api/adjustabledocument/employee/${id}`),
  },
  medfamilies: {
    all: '/api/drugfamilies/',
    many: '/api/drugfamilies/many',
    one: (id) => (!id ? null : `/api/drugfamilies/${id}`),
  },
  medicines: {
    all: '/api/medicines/',
    many: '/api/medicines/many',
    one: (id) => (!id ? null : `/api/medicines/${id}`),
  },
  prescription: {
    all: '/api/drugs/',
    many: '/api/drugs/many',
    one: (id) => (!id ? null : `/api/drugs/${id}`),
    current: (id) => (!id ? null : `/api/drugs/current/patient/${id}`),
    entrance: (id) => (!id ? null : `/api/drugs/entranceprescription/${id}`),
  },
  specialities: {
    all: '/api/specialities',
    options: '/api/specialities/options',
    many: '/api/specialities/many',
    one: (id) => (!id ? null : `/api/specialities/${id}`),
  },
  subspecialities: {
    all: '/api/subspecialities/',
    many: '/api/subspecialities/many',
    one: (id) => (!id ? null : `/api/subspecialities/${id}`),
  },
  surgeries: {
    all: '/api/surgeries/',
    many: '/api/surgeries/many',
    one: (id) => (!id ? null : `/api/surgeries/${id}`),
  },
  symptoms: {
    all: '/api/symptoms/',
    many: '/api/symptoms/many',
    one: (id) => (!id ? null : `/api/symptoms/${id}`),
  },
  rooms: {
    all: '/api/rooms/',
    many: '/api/rooms/many',
    one: (id) => (!id ? null : `/api/rooms/${id}`),
    active: '/api/rooms/active',
    unit_service: {
      all: (id) => (!id ? null : `/api/rooms/unitservice/${id}`),
      active: (id) => (!id ? null : `/api/rooms/unitservice/${id}/active`),
      byactivity: (id, acId) => `/api/rooms/unitservice/${id}/activity/${acId}`,
    },
    employee: {
      all: (id) => (!id ? null : `/api/rooms/unitserviceemployee/${id}`),
    },
    department: {
      all: (id) => (!id ? null : `/api/rooms/department/${id}`),
      active: (id) => (!id ? null : `/api/rooms/department/${id}/active`),
    },
  },
  blogcategory: {
    all: '/api/blogcategory',
    one: (id) => (!id ? null : `/api/blogcategory/${id}`),
  },

  employee_types: {
    all: '/api/employeetypes/',
    active: '/api/employeetypes/active',
    one: (id) => (!id ? null : `/api/employeetypes/${id}`),
    unit_service: {
      all: (id) => (!id ? null : `/api/employeetypes/unitservice/${id}`),
      active: (id) => (!id ? null : `/api/employeetypes/unitservice/${id}/active`),
    },
  },
  employees: {
    all: '/api/employees/',
    keywords: '/api/employees/keywords',
    one: (id) => (!id ? null : `/api/employees/${id}`),
    find: ({
      email,
      identification_num,
      code,
      phone,
      profrssion_practice_num,
      name_english,
      name_arabic,
    }) =>
      `/api/employees/find?id=${identification_num}&&email=${email}&&code=${code}&&name_english=${name_english}&&name_arabic=${name_arabic}&&profrssion_practice_num=${profrssion_practice_num}&&phone=${phone}`,
  },
  employee_engagements: {
    all: '/api/employees/engagement/',
    one: (id) => (!id ? null : `/api/employees/engagement/${id}`),
    service_unit: {
      all: (id) => (!id ? null : `/api/employees/engagement/unitservice/${id}`),
      active: (id) => (!id ? null : `/api/employees/engagement/unitservice/${id}/active`),
    },
    department: {
      all: (id) => (!id ? null : `/api/employees/engagement/department/${id}`),
      active: (id) => (!id ? null : `/api/employees/engagement/department/${id}/active`),
    },
    work_group: {
      all: (id) => (!id ? null : `/api/employees/engagement/workgroup/${id}`),
      active: (id) => (!id ? null : `/api/employees/engagement/workgroup/${id}/active`),
    },
    speciality: {
      all: (id) => (!id ? null : `/api/employees/engagement/specialty/${id}`),
      active: (id) => (!id ? null : `/api/employees/engagement/specialty/${id}/active`),
    },
  },
  insurance_companies: {
    all: '/api/insurance/companies',
    active: '/api/insurance/companies/active',
    many: '/api/insurance/companies/many',
    one: (id) => (!id ? null : `/api/insurance/companies/${id}`),
  },
  insurance_types: {
    all: '/api/insurance/types',
    one: (id) => (!id ? null : `/api/insurance/types/${id}`),
  },
  insurance_data: {
    all: '/api/insurance/data',
    one: (id) => (!id ? null : `/api/insurance/data/${id}/`),
    patient: (id) => (!id ? null : `/api/insurance/data/${id}/patient`),
  },
  measurment_types: {
    all: '/api/measurementtypes',
    one: (id) => (!id ? null : `/api/measurementtypes/${id}`),
    active: '/api/measurementtypes/active',
    many: '/api/measurmenttypes/many',
  },
  payment_methods: {
    all: '/api/paymentmethod',
    one: (id) => (!id ? null : `/api/paymentmethod/${id}`),
    active: '/api/paymentmethod/active',
  },
  stakeholder_types: {
    all: '/api/stakeholdertype',
    one: (id) => (!id ? null : `/api/stakeholdertype/${id}`),
    active: '/api/stakeholdertype/active',
  },
  stakeholders: {
    all: '/api/stakeholder',
    one: (id) => (!id ? null : `/api/stakeholder/${id}`),
    active: '/api/stakeholder/active',
  },
  statistics: {
    all: '/api/statistics',
    one: (id) => (!id ? null : `/api/statistics/${id}`),
  },
  service_types: {
    all: '/api/servicetypes',
    active: '/api/servicetypes/active',
    one: (id) => (!id ? null : `/api/servicetypes/${id}`),
    unit_service: {
      all: (id) => (!id ? null : `/api/servicetypes/unitservice/${id}`),
      active: (id) => (!id ? null : `/api/servicetypes/unitservice/${id}/active`),
    },
  },
  subscriptions: {
    all: '/api/subscription',
    allinhome: '/api/subscription/inhome',
    unit_service: (id) => (!id ? null : `/api/subscription/unitservice/${id}`),
    active: '/api/subscription/active',
    one: (id) => (!id ? null : `/api/subscription/${id}`),
  },
  unit_service_types: {
    all: '/api/ustypes',
    active: '/api/ustypes/active',
    one: (id) => (!id ? null : `/api/ustypes/${id}`),
  },
  unit_services: {
    all: '/api/unitservice',
    active: '/api/unitservice/active',
    one: (id) => (!id ? null : `/api/unitservice/${id}`),
  },
  departments: {
    all: '/api/departments',
    active: '/api/departments/active',
    one: (id) => (!id ? null : `/api/departments/${id}`),
    unit_service: {
      all: (id) => (!id ? null : `/api/departments/unitservice/${id}`),
      active: (id) => (!id ? null : `/api/departments/unitservice/${id}/active`),
    },
  },
  work_shifts: {
    all: '/api/wshifts',
    one: (id) => (!id ? null : `/api/wshifts/${id}`),
    unit_service: {
      all: (id) => (!id ? null : `/api/wshifts/unitservice/${id}`),
      active: (id) => (!id ? null : `/api/wshifts/unitservice/${id}/active`),
    },
  },
  work_groups: {
    all: '/api/wgroups',
    one: (id) => (!id ? null : `/api/wgroups/${id}`),
    unit_service: {
      all: (id) => (!id ? null : `/api/wgroups/unitservice/${id}`),
      active: (id) => (!id ? null : `/api/wgroups/unitservice/${id}/active`),
    },
    department: {
      all: (id) => (!id ? null : `/api/wgroups/department/${id}`),
      active: (id) => (!id ? null : `/api/wgroups/department/${id}/active`),
    },
    employee: {
      all: (id) => (!id ? null : `/api/wgroups/employee/${id}`),
      active: (id) => (!id ? null : `/api/wgroups/employee/${id}/active`),
      acl: (id) => (!id ? null : `/api/wgroups/employee/${id}/acl`),
      engagement: (id) => (!id ? null : `/api/wgroups/employee/engagement/${id}`),
    },
  },
  notifications: {
    all: '/api/notifications',
    readOne: (id) => (!id ? null : `/api/notifications/${id}/read`),
    readMany: '/api/notifications/read',
    my: `/api/notifications/my`,
    pateint: (id) => (!id ? null : `/api/notifications/patient/${id}`),
  },
  appointment_types: {
    all: '/api/appointments/types',
    one: (id) => (!id ? null : `/api/appointments/types/${id}`),
    unit: (id) => (!id ? null : `/api/appointments/types/unit/${id}`),
  },
  appointment_configs: {
    all: '/api/appointments/config',
    one: (id) => (!id ? null : `/api/appointments/config/${id}`),
    employee: {
      all: (emid) => `/api/appointments/config/employee/${emid}`,
    },
    unit_service: {
      all: (id) => (!id ? null : `/api/appointments/config/unitservice/${id}`),
    },
    department: {
      all: (id) => (!id ? null : `/api/appointments/config/department/${id}`),
    },
  },
  free_subscriptions: {
    all: '/api/freesubscription',
    one: (id) => (!id ? null : `/api/freesubscription/${id}`),
  },
  taxes: {
    all: '/api/taxes',
    one: (id) => (!id ? null : `/api/taxes/${id}`),
  },
  activities: {
    all: '/api/activities',
    one: (id) => (!id ? null : `/api/activities/${id}`),
    unit_service: {
      all: (id) => (!id ? null : `/api/activities/unitservice/${id}`),
    },
    department: {
      all: (id) => (!id ? null : `/api/activities/department/${id}`),
    },
  },
  imaging: {
    all: '/api/imaging',
    one: (id) => (!id ? null : `/api/imaging/${id}`),
    unit_service: {
      all: (id) => (!id ? null : `/api/imaging/unitservice/${id}`),
    },
    department: {
      all: (id) => (!id ? null : `/api/imaging/department/${id}`),
    },
  },
  calender: {
    all: '/api/calender',
    // one: (id) => id&& `/api/calender/${id}`,
    superadmin: '/api/calender/superadmin',
    employee: {
      all: (id) => (!id ? null : `/api/calender/employee/${id}`),
    },
    patient: {
      all: (id) => (!id ? null : `/api/calender/patient/${id}`),
    },
  },
  deductions: {
    all: '/api/deductionconfig',
    one: (id) => (!id ? null : `/api/deductionconfig/${id}`),
  },
  keywords: {
    find: '/api/keywords/find',
    all: '/api/keywords',
    arabic: '/api/keywords/ar',
  },
  customers: {
    all: '/api/customers',
    stakeholder: (id) => (!id ? null : `/api/customers/stakeholder/${id}`),
  },
  patients: {
    all: '/api/patient',
    deleteFamilyMember: (id) => (!id ? null : `/api/patient/deleteFamilyMember/${id}`),
    find: `/api/patient/find`,
    employee: (id) => (!id ? null : `/api/patient/employee/${id}`),
    unitservice: (id) => (!id ? null : `/api/patient/unitservice/${id}`),
    findPatient: ({ identification_num, name_english, name_arabic }) =>
      `/api/patient/findpatient?id=${identification_num}&&name_english=${name_english}&&name_arabic=${name_arabic}`,
    family: (id) => (!id ? null : `/api/patient/myfamily/${id}`),
    familyType: '/api/family',
    onefamilyType: (id) => (!id ? null : `/api/family/${id}`),
    one: (id) => (!id ? null : `/api/patient/${id}`),
    resend: (id) => (!id ? null : `/api/patient/resend_id/${id}`),
  },
  history: {
    all: '/api/history',
    one: (id) => `/api/history/${id}`,
    patientinUs: (id, pId) => `/api/history/patient/${id}/unit_service_patient/${pId}`,
    patient: (id) => `/api/history/patient/${id}`,
  },
  Instructions: {
    all: '/api/instructions',
    one: (id) => `/api/instructions/${id}`,
    patient: (id) => (!id ? null : `/api/instructions/patient/${id}`),
  },
  generalCheckList: {
    all: '/api/generlaCL',
    one: (id) => (!id ? null : `/api/generlaCL/${id}`),
  },
  checklist: {
    all: '/api/checklist',
    employee: (id) => (!id ? null : `/api/checklist/employee/${id}`),
    one: (id) => (!id ? null : `/api/checklist/${id}`),
  },
  localCheckList: {
    all: '/api/localCL',
    one: (id) => (!id ? null : `/api/localCL/${id}`),
  },
  attendence: {
    all: '/api/attendence',
    create: '/api/attendence/create',
    leave: '/api/attendence/leave',
    lastAttendance: '/api/attendence/mylast',
    one: (id) => (!id ? null : `/api/attendence/${id}`),
    employee: (id) => (!id ? null : `/api/attendence/employee/${id}`),
  },
  monthlyReport: {
    all: '/api/monthlyreport',
    one: (id) => `/api/monthlyreport/${id}`,
    employee: (id) => `/api/monthlyreport/employee/${id}`,
  },
  yearlyReport: {
    all: '/api/yearlyreport',
    one: (id) => `/api/yearlyreport/${id}`,
    employee: (id) => `/api/yearlyreport/employee/${id}`,
  },
  answers: {
    all: '/api/answersandquestiones',
    one: (id) => (!id ? null : `/api/answersandquestiones/${id}`),
    entrance: (id) => (!id ? null : `/api/answersandquestiones/entrance/${id}`),
    uspatient: (id) => (!id ? null : `/api/answersandquestiones/uspatient/${id}`),
  },
  entranceManagement: {
    all: '/api/entrance',
    inwatingnow: '/api/entrance/inwatingnow',
    one: (id) => (!id ? null : `/api/entrance/${id}`),
    inwating: (id) => (!id ? null : `/api/entrance/inwating/${id}`),
    wating: (id) => (!id ? null : `/api/entrance/wating/${id}`),
    inrooms: (id) => (!id ? null : `/api/entrance/inrooms/${id}`),
    byactivity: (id, usId) => (!id ? null : `/api/entrance/activity/${id}/us/${usId}`),
    finishedAppointments: (usId) => `/api/entrance/finishedAppointments/us/${usId}`,
  },
  medRecord: {
    all: '/api/entrance',
    one: (id) => (!id ? null : `/api/medrecord/patient/${id}`),
    two: (id, id2, id3) => `/api/medrecord/unit/${id}/patient/${id2}/unit_service_patient/${id3}`,
  },
  usPatients: {
    all: '/api/uspatients',
    many: '/api/uspatients/many',
    find: '/api/uspatients/find',
    addOne: '/api/uspatients/',
    one: (id) => (!id ? null : `/api/uspatients/${id}`),
    unit_service: {
      all: (id) => (!id ? null : `/api/uspatients/unitservice/${id}`),
    },
    employee: {
      all: (id) => (!id ? null : `/api/uspatients/employee/${id}`),
    },
  },
  license_movements: {
    all: '/api/licensemovements',
    one: (id) => (!id ? null : `/api/licensemovements/${id}`),
    unit_service: {
      all: `/api/licensemovements/unitservice`,
      one: (id) => (!id ? null : `/api/licensemovements/unitservice/${id}`),
    },
    stakeholder: {
      all: `/api/licensemovements/stakeholder`,
      one: (id) => (!id ? null : `/api/licensemovements/stakeholder/${id}`),
    },
  },
  feedbacks: {
    all: '/api/feedback',
    one: (id) => (!id ? null : `/api/feedback/${id}`),
    unit_service: {
      all: `/api/feedback/unitservices`,
      one: (id) => (!id ? null : `/api/feedback/unitservice/${id}`),
    },
    stakeholder: {
      all: `/api/feedback/stakeholders`,
      one: (id) => (!id ? null : `/api/feedback/stakeholder/${id}`),
    },
    doctorna: {
      all: `/api/feedback/doctorna`,
    },
    department: {
      one: (id) => (!id ? null : `/api/feedback/department/${id}`),
    },
    employee: {
      one: (id) => (!id ? null : `/api/feedback/employee/${id}`),
    },
    patient: {
      one: (id) => (!id ? null : `/api/feedback/patient/${id}`),
    },
  },
  appointments: {
    all: '/api/appointments',
    one: (id) => (!id ? null : `/api/appointments/${id}`),
    book: (id) => (!id ? null : `/api/appointments/${id}/book`),
    available: '/api/appointments/available',
    employee: {
      one: (id) => (!id ? null : `/api/appointments/employee/${id}`),
      nearst: (id) => (!id ? null : `/api/appointments/nearst/${id}`),
      employeetodayappointment: (id) =>
        !id ? null : `/api/appointments/employeetodayappointment/${id}`,
      select: ({ id, startDate, appointmentType }) =>
        `/api/appointments/employeeselect/${id}?startDate=${startDate}&&appointmentType=${appointmentType}`,
    },
    department: {
      one: ({ id, page = 0, sortBy = 'code', rowsPerPage = 5, order = 'asc', filters }) =>
        `/api/appointments/department/${id}?page=${page}&&sortBy=${sortBy}&&rowsPerPage=${rowsPerPage}&&order=${order}&&status=${filters?.status}&&appointype=${filters?.types}&&startDate=${filters?.startDate}&&endDate=${filters?.endDate}&&group=${filters?.group}&&shift=${filters?.shift}&&startTime=${filters?.startTime}&&endTime=${filters?.endTime}`,
    },
    unit_service: {
      one: (id) => (!id ? null : `/api/appointments/unitservice/${id}`),
      available: (id) => (!id ? null : `/api/appointments/available/${id}`),
      patient: (id, pid, uspId) => `/api/appointments/unitservice/${id}/patient/${pid}/${uspId}`,
      today: (id) => (!id ? null : `/api/appointments/unitserviceappointments/${id}`),
      comingpatients: (id) => (!id ? null : `/api/appointments/comingpatients/${id}`),
    },
    patient: {
      many: (id) => (!id ? null : `/api/appointments/patient/${id}`),
      finished: (id) => (!id ? null : `/api/appointments/patientfinished/${id}`),
      notify: (id) => (!id ? null : `/api/appointments/notify/${id}`),
      one: (id) => (!id ? null : `/api/appointments/onepatient/${id}`),
      createPatientAndBookAppoint: (id) => (!id ? null : `/api/appointments/${id}/newpatient`),
    },
  },
  economec_movements: {
    all: '/api/economicmovements',
    invoice: '/api/invoice',
    one: (id) => (!id ? null : `/api/economicmovements/${id}`),
    department: {
      one: (id) => (!id ? null : `/api/economicmovements/department/${id}`),
    },
    unit_service: {
      one: (id) => (!id ? null : `/api/economicmovements/unitservice/${id}`),
      available: (id) => (!id ? null : `/api/appointments/available/${id}`),
    },
    patient: {
      one: (id) => (!id ? null : `/api/economicmovements/patient/${id}`),
    },
    stakeholder: {
      one: (id) => (!id ? null : `/api/economicmovements/stakeholder/${id}`),
    },
  },
  receipts: {
    all: '/api/receipts',
  },
  income_payment: {
    all: '/api/incomepayment',
    pay: (id) => (!id ? null : `/api/incomepayment/pay/${id}`),
    one: (id) => (!id ? null : `/api/incomepayment/${id}`),
    department: {
      one: (id) => (!id ? null : `/api/incomepayment/department/${id}`),
    },
    unit_service: {
      one: (id) => (!id ? null : `/api/incomepayment/unitservice/${id}`),
    },
    patient: {
      one: (id) => (!id ? null : `/api/incomepayment/patient/${id}`),
    },
    stakeholder: {
      one: (id) => (!id ? null : `/api/incomepayment/stakeholder/${id}`),
    },
  },
  offers: {
    all: '/api/suppliersoffers',
    one: (id) => (!id ? null : `/api/suppliersoffers/${id}`),
    stakeholder: {
      one: (id) => (!id ? null : `/api/suppliersoffers/stakeholder/${id}`),
    },
  },
  orders: {
    all: '/api/orders',
    one: (id) => (!id ? null : `/api/orders/${id}`),
    stakeholder: (id) => (!id ? null : `/api/orders/stakeholder/${id}`),
    unitservice: (id) => (!id ? null : `/api/orders/unitservice/${id}`),
    patient: (id) => (!id ? null : `/api/orders/patient/${id}`),
  },
  systemErrors: {
    all: '/api/systemerrors',
    one: (id) => (!id ? null : `/api/systemerrors/${id}`),
  },
  TicketCategories: {
    all: '/api/tickets/categories',
    one: (id) => (!id ? null : `/api/tickets/categories/${id}`),
  },
  tickets: {
    all: '/api/tickets',
    one: (id) => (!id ? null : `/api/tickets/${id}`),
  },
  upload_records: {
    all: '/api/upload_records',
    one: (id) => (!id ? null : `/api/upload_records/${id}`),
  },
  chat: {
    all: '/api/chat',
    one: (id) => (!id ? null : `/api/chat/${id}`),
    message: (id) => (!id ? null : `/api/msg/${id}`),
    unreadMsg: (id) => (!id ? null : `/api/msg/unread/user/${id}`),
    unreadMsgSA: (id) => (!id ? null : `/api/msg/unread/sa/${id}`),
  },
  training: {
    all: '/api/training',
    one: (id) => (!id ? null : `/api/training/${id}`),
  },

  tables: {
    // countries: `/api/countries`,
    // country: (id) => id&& `/api/countries/${id}`,
    // cities: '/api/cities',
    // manyCities: '/api/cities/many',
    // manyAnalyses: '/api/analysis/many',
    // city: (id) => id&& `/api/cities/${id}`,
    // surgeries: '/api/surgeries',
    // surgery: (id) => id&& `/api/surgeries/${id}`,
    // diseases: '/api/diseases',
    // disease: (id) => id&& `/api/diseases/${id}`,
    // symptoms: '/api/symptoms',
    // symptom: (id) => id&& `/api/symptoms/${id}`,
    // categories: '/api/medcategories',
    // category: (id) => id&& `/api/medcategories/${id}`,
    // currencies: '/api/currency',
    // currency: (id) => id&& `/api/currency/${id}`,
    // medfamilies: '/api/drugfamilies',
    // medfamily: (id) => id&& `/api/drugfamilies/${id}`,
    // medicines: '/api/medicines',
    // medicine: (id) => id&& `/api/medicines/${id}`,
    // notifications: '/api/notifications',
    // readNotification: (id) => id&& `/api/notifications/${id}/read`,
    // readNotifications: '/api/notifications/read',
    // unreadNotificationsCount: '/api/notifications/unreadcount',
    // myNotifications: (id, emid, page) =>
    //   `/api/notifications/user/${id}/employee/${emid}?page=${page}`,
    // myUnreadNotifications: (id, emid) => `/api/notifications/user/${id}/employee/${emid}/count`,
    // diets: '/api/diets',
    // diet: (id) => id&& `/api/diets/${id}`,
    // analyses: '/api/analysis',
    // analysis: (id) => id&& `/api/analysis/${id}`,
    // insuranceCo: (id) => id&& `/api/insurance/companies/${id}`,
    // insuranceTypes: '/api/insurance/types',
    // insuranceType: (id) => id&& `/api/insurance/types/${id}`,
    // unitservice: (id) => id&& `/api/unitservice/${id}`,
    // usId: () => `/api/unitservice/usId`,
    // departments: '/api/departments',
    // unitServiceDepartments: (id) => id&& `/api/departments/unitservice/${id}`,
    // department: (id) => id&& `/api/departments/${id}`,
    // specialities: '/api/specialities',
    // speciality: (id) => id&& `/api/specialities/${id}`,
    // subspecialities: '/api/subspecialities',
    // subspeciality: (id) => id&& `/api/subspecialities/${id}`,
    // appointmenttypes: '/api/appointments/types',
    // appointmenttype: (id) => id&& `/api/appointments/types/${id}`,
    // appointmentconfigs: '/api/appointments/config',
    // employeeAppointmentconfig: (emid) => `/api/appointments/config/employee/${emid}`,
    // appointmentconfig: (id) => id&& `/api/appointments/config/${id}`,
    // usappointmentconfig: (id) => id&& `/api/appointments/config/unitservice/${id}`,
    // departmentappointmentconfig: (id) => id&& `/api/appointments/config/department/${id}`,
    // freesubscriptions: '/api/freesubscription',
    // freesubscription: (id) => id&& `/api/freesubscription/${id}`,
    // unitservicetype: (id) => id&& `/api/ustypes/${id}`,
    // taxes: '/api/taxes',
    // tax: (id) => id&& `/api/taxes/${id}`,
    // activities: '/api/activities',
    // usActivities: (id) => id&& `/api/activities/unitservice/${id}`,
    // usActivitiesCount: (id) => id&& `/api/activities/unitservice${id}/count`,
    // departmentActivities: (id) => id&& `/api/activities/department/${id}`,
    // departmentActivitiesCount: (id) => id&& `/api/activities/department/${id}/count`,
    // activity: (id) => id&& `/api/activities/${id}`,
    // employeetypes: '/api/employeetypes',
    // usEmployeetypes: (id) => id&& `/api/employeetypes/unitservice/${id}`,
    // employeetype: (id) => id&& `/api/employeetypes/${id}`,
    // employees: '/api/employees',
    // employee: (id) => id&& `/api/employees/${id}`,
    // findEmployee: `/api/employees/find`,
    // employeeEngagements: `/api/employees/engagement`,
    // employeeEngagement: (id) => id&& `/api/employees/engagement/${id}`,
    // usEmployeesCount: (id) => id&& `/api/employees/engagement/unitservice/${id}/count`,
    // departmentEmployeesCount: (id) => id&& `/api/employees/engagement/department/${id}/count`,
    // paymentmethod: (id) => id&& `/api/paymentmethod/${id}`,
    // stakeholdertypes: '/api/stakeholdertype',
    // stakeholdertype: (id) => id&& `/api/stakeholdertype/${id}`,
    // stakeholders: '/api/stakeholder',
    // stakeholder: (id) => id&& `/api/stakeholder/${id}`,
    // workshifts: '/api/wshifts',
    // workshift: (id) => id&& `/api/wshifts/${id}`,
    // workgroups: '/api/wgroups',
    // usWorkgroups: (id) => id&& `/api/wgroups/unitservice/${id}`,
    // employeeWorkgroups: (id) => id&& `/api/wgroups/employee/${id}`,
    // departmentemployeeWorkgroups: (id, emid) => `/api/wgroups/department/${id}/employee/${emid}`,
    // usemployeeWorkgroups: (id, emid) => `/api/wgroups/unitservice/${id}/employee/${emid}`,
    // workgroup: (id) => id&& `/api/wgroups/${id}`,
    // servicetype: (id) => id&& `/api/servicetypes/${id}`,
    // measurmenttype: (id) => id&& `/api/measurementtypes/${id}`,
    // employeeCalender: (id) => id&& `/api/calender/employee/${id}`,
    // patientCalender: (id) => id&& `/api/calender/patient/${id}`,
    // calender: `/api/calender`,
    // hospitals: '/api/hospital',
    // hospital: (id) => id&& `/api/hospital/${id}`,
    // deductions: '/api/deductionconfig',
    // deduction: (id) => id&& `/api/deductionconfig/${id}`,
    // rooms: '/api/rooms',
    // room: (id) => id&& `/api/rooms/${id}`,
    // usRooms: (id) => id&& `/api/rooms/unitservice/${id}`,
    // usRoomsCount: (id) => id&& `/api/rooms/unitservice/${id}/count`,
    // departmentRooms: (id) => id&& `/api/rooms/department/${id}`,
    // departmentRoomsCount: (id) => id&& `/api/rooms/department/${id}/count`,
    // patients: '/api/patient',
    // oldpatientsdata: '/api/oldpatientsdata',
    // oldpatient: `/api/oldpatientsdata/details`,
    // findPatients: '/api/patient/find',
    // patient: (id) => id&& `/api/patient/${id}`,
    // usOldpatients: (id) => id&& `/api/oldpatientsdata/unitservice/${id}`,
    // employeeOldpatients: (id) => id&& `/api/oldpatientsdata/employee/${id}`,
    // newOldPatient: `/api/oldpatientsdata/`,
    // unitServiceLicenseMovement: (id) => id&& `/api/licensemovements/unitservice/${id}`,
    // unitServiceLicenseMovements: `/api/licensemovements/unitservice`,
    // stakeholderLicenseMovement: (id) => id&& `/api/licensemovements/stakeholder/${id}`,
    // stakeholderLicenseMovements: `/api/licensemovements/stakeholder`,
    // licenseMovement: (id) => id&& `/api/licensemovements/${id}`,
    // licenseMovements: `/api/licensemovements`,
    // subscription: (id) => id&& `/api/subscription/${id}`,
    // feedbacks: '/api/feedback',
    // doctornafeedbacks: '/api/feedback/doctorna',
    // USsfeedbacks: '/api/feedback/unitservices',
    // stakeholdersfeedbacks: '/api/feedback/stakeholders',
    // USfeedbacks: (id) => id&& `/api/feedback/unitservice/${id}`,
    // USfeedbacksCount: (id) => id&& `/api/feedback/unitservice/${id}/count`,
    // departmentfeedbacks: (id) => id&& `/api/feedback/department/${id}`,
    // employeefeedbacks: (id) => id&& `/api/feedback/employee/${id}`,
    // usemployeefeedbacks: (id, emid) => `/api/feedback/unitservice/${id}/employee/${emid}`,
    // departmentemployeefeedbacks: (id, emid) => `/api/feedback/department/${id}/employee/${emid}`,
    // departmentfeedbacksCount: (id) => id&& `/api/feedback/department/${id}/count`,
    // patientfeedbacks: (id) => id&& `/api/feedback/patient/${id}`,
    // stakeholderFeedbacks: (id) => id&& `/api/feedback/stakeholder/${id}`,
    // feedback: (id) => id&& `/api/feedback/${id}`,
    // appointments: '/api/appointments',
    // availableAppointments: '/api/appointments/available',
    // appointment: (id) => id&& `/api/appointments/${id}`,
    // nearstAppointment: (id) => id&& `/api/appointments/nearst/${id}`,
    // createPatientAndBookAppoint: (id) => id&& `/api/appointments/${id}/newpatient`,
    // usAppointmentsavilable: (id) => id&& `/api/appointments/available/${id}`,
    // usAppointmentsCount: (id) => id&& `/api/appointments/unitservice/${id}/count`,
    // departmentAppointmentsCount: (id) => id&& `/api/appointments/department/${id}/count`,
    // departmentAppointments: ({
    //   id,
    //   page = 0,
    //   sortBy = 'code',
    //   rowsPerPage = 5,
    //   order = 'asc',
    //   filters,
    // }) =>
    //   `/api/appointments/department/${id}?page=${page}&&sortBy=${sortBy}&&rowsPerPage=${rowsPerPage}&&order=${order}&&status=${filters?.status}&&appointype=${filters?.types}&&startDate=${filters?.startDate}&&endDate=${filters?.endDate}&&group=${filters?.group}&&shift=${filters?.shift}`,
    // usAppointments: ({ id, page = 0, sortBy = 'code', rowsPerPage = 5, order = 'asc', filters }) =>
    //   `/api/appointments/unitservice/${id}?page=${page}&&sortBy=${sortBy}&&rowsPerPage=${rowsPerPage}&&order=${order}&&status=${filters?.status}&&appointype=${filters?.types}&&startDate=${filters?.startDate}&&endDate=${filters?.endDate}&&group=${filters?.group}&&shift=${filters?.shift}`,
    // employeeAppointments: ({
    //   id,
    //   page = 0,
    //   sortBy = 'code',
    //   rowsPerPage = 5,
    //   order = 'asc',
    //   filters,
    // }) =>
    //   `/api/appointments/employee/${id}?page=${page}&&sortBy=${sortBy}&&rowsPerPage=${rowsPerPage}&&order=${order}&&status=${filters?.status}&&appointype=${filters?.types}&&startDate=${filters?.startDate}&&endDate=${filters?.endDate}&&group=${filters?.group}&&shift=${filters?.shift}`,
    // employeeselect: ({ id, startDate }) =>
    //   `/api/appointments/employeeselect/${id}?startDate=${startDate}`,
    // patientAppointments: (id) => id&& `/api/appointments/patient/${id}`,
    // patientoneAppointments: (id) => id&& `/api/appointments/onepatient/${id}`,
    // economecMovements: '/api/economicmovements',
    // economicMovement: (id) => id&& `/api/economicmovements/${id}`,
    // patienteconomicMovements: (id) => id&& `/api/economicmovements/patient/${id}`,
    // stakeholdereconomicMovements: (id) => id&& `/api/economicmovements/stakeholder/${id}`,
    // usEconomicMovements: (id) => id&& `/api/economicmovements/unitservice/${id}`,
    // usEconomicMovementsCount: (id) => id&& `/api/economicmovements/unitservice/${id}/count`,
    // departmentEconomicMovements: (id) => id&& `/api/economicmovements/department/${id}`,
    // departmentEconomicMovementsCount: (id) => id&& `/api/economicmovements/department/${id}/count`,
    // incomePaymentControl: '/api/incomepayment',
    // incomePayment: (id) => id&& `/api/incomepayment/${id}`,
    // offers: '/api/suppliersoffers',
    // offer: (id) => id&& `/api/suppliersoffers/${id}`,
    // stakeholderOffers: (id) => id&& `/api/suppliersoffers/stakeholder/${id}`,
    // patientIncomePaymentControl: (id) => id&& `/api/incomepayment/patient/${id}`,
    // departmentIncomePaymentControl: (id) => id&& `/api/incomepayment/department/${id}`,
    // stakeholderIncomePaymentControl: (id) => id&& `/api/incomepayment/stakeholder/${id}`,
    // systemErrors: '/api/systemerrors',
    // systemError: (id) => id&& `/api/systemerrors/${id}`,
  },
  // chat: '/api/chat',
  // kanban: '/api/kanban',
  // calendar: '/api/calendar',
  auth: {
    user: (id) => (!id ? null : `/api/auth/${id}`),
    patientUser: (id) => (!id ? null : `/api/auth/patient/${id}`),
    users: '/api/auth',
    deletMe: '/api/auth/deletMe',
    me: '/api/auth/me',
    login: '/api/auth/login',
    changeId: '/api/auth/changeid',
    resendActivation: `/api/auth/resendactivate`,
    activate: `/api/auth/activate`,
    register: '/api/auth/signup',
    forgotpassword: '/api/auth/forgotpassword',
    resetpassword: '/api/auth/resetpassword',
    updatepassword: '/api/auth/updateCurrentPassowrd',
    checkPassword: '/api/auth/checkpassword',
    toggleRole: '/api/auth/togglerole',
    newUser: '/api/auth/newuser',
  },
  stakeholder: {
    getstakeholder: '/api/stakeholder',
    all: '/api/stakeholder',
    one: (id) => (!id ? null : `/api/stakeholder/${id}`),
  },
  posts: {
    getAll: '/api/post',
  },
  payment: {
    getAllpaymentmethods: '/api/paymentmethods',
  },
};
