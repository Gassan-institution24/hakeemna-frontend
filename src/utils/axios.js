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
  countries: {
    all: '/api/countries/',
    many: '/api/countries/many',
    one: (id) => `/api/countries/${id}`,
  },
  cities: {
    all: '/api/cities/',
    many: '/api/cities/many',
    one: (id) => `/api/cities/${id}`,
    country: (id) => `/api/cities/country/${id}`,
  },
  currency: {
    all: '/api/currency/',
    many: '/api/currency/many',
    one: (id) => `/api/currency/${id}`,
  },
  companies: {
    all: '/api/companies/',
    many: '/api/companies/many',
    one: (id) => `/api/companies/${id}`,
  },
  diets: {
    all: '/api/diets/',
    many: '/api/diets/many',
    one: (id) => `/api/diets/${id}`,
  },
  diseases: {
    all: '/api/diseases/',
    many: '/api/diseases/many',
    one: (id) => `/api/diseases/${id}`,
  },
  analyses: {
    all: '/api/analysis/',
    many: '/api/analysis/many',
    one: (id) => `/api/analysis/${id}`,
  },
  hospitals: {
    all: '/api/hospital',
    many: '/api/hospital/many',
    one: (id) => `/api/hospital/${id}`,
  },
  medCategories: {
    all: '/api/medCategories/',
    many: '/api/medCategories/many',
    one: (id) => `/api/medCategories/${id}`,
  },
  oldmedicalreports: {
    all: '/api/oldmedicalreports/',
    patient: (id) => `/api/oldmedicalreports/patient/${id}`,
    one: (id) => `/api/oldmedicalreports/${id}`,
    findReport: ({ name }) => `/api/oldmedicalreports/report?name=${name}`,
  },
  medfamilies: {
    all: '/api/drugfamilies/',
    many: '/api/drugfamilies/many',
    one: (id) => `/api/drugfamilies/${id}`,
  },
  medicines: {
    all: '/api/medicines/',
    many: '/api/medicines/many',
    one: (id) => `/api/medicines/${id}`,
  },
  specialities: {
    all: '/api/specialities',
    many: '/api/specialities/many',
    one: (id) => `/api/specialities/${id}`,
  },
  subspecialities: {
    all: '/api/subspecialities/',
    many: '/api/subspecialities/many',
    one: (id) => `/api/subspecialities/${id}`,
  },
  surgeries: {
    all: '/api/surgeries/',
    many: '/api/surgeries/many',
    one: (id) => `/api/surgeries/${id}`,
  },
  symptoms: {
    all: '/api/symptoms/',
    many: '/api/symptoms/many',
    one: (id) => `/api/symptoms/${id}`,
  },
  rooms: {
    all: '/api/rooms/',
    many: '/api/rooms/many',
    one: (id) => `/api/rooms/${id}`,
    active: '/api/rooms/active',
    unit_service: {
      all: (id) => `/api/rooms/unitservice/${id}`,
      active: (id) => `/api/rooms/unitservice/${id}/active`,
    },
    department: {
      all: (id) => `/api/rooms/department/${id}`,
      active: (id) => `/api/rooms/department/${id}/active`,
    },
  },
  employee_types: {
    all: '/api/employeetypes/',
    active: '/api/employeetypes/active',
    one: (id) => `/api/employeetypes/${id}`,
    unit_service: {
      all: (id) => `/api/employeetypes/unitservice/${id}`,
      active: (id) => `/api/employeetypes/unitservice/${id}/active`,
    },
  },
  employees: {
    all: '/api/employees/',
    one: (id) => `/api/employees/${id}`,
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
    one: (id) => `/api/employees/engagement/${id}`,
    service_unit: {
      all: (id) => `/api/employees/engagement/unitservice/${id}`,
      active: (id) => `/api/employees/engagement/unitservice/${id}/active`,
    },
    department: {
      all: (id) => `/api/employees/engagement/department/${id}`,
      active: (id) => `/api/employees/engagement/department/${id}/active`,
    },
    work_group: {
      all: (id) => `/api/employees/engagement/workgroup/${id}`,
      active: (id) => `/api/employees/engagement/workgroup/${id}/active`,
    },
    speciality: {
      all: (id) => `/api/employees/engagement/specialty/${id}`,
      active: (id) => `/api/employees/engagement/specialty/${id}/active`,
    },
  },
  insurance_companies: {
    all: '/api/insurance/companies',
    active: '/api/insurance/companies/active',
    many: '/api/insurance/companies/many',
    one: (id) => `/api/insurance/companies/${id}`,
  },
  insurance_types: {
    all: '/api/insurance/types',
    one: (id) => `/api/insurance/types/${id}`,
  },
  insurance_data: {
    all: '/api/insurance/data',
    one: (id) => `/api/insurance/data/${id}/patient`,
  },
  measurment_types: {
    all: '/api/measurementtypes',
    one: (id) => `/api/measurementtypes/${id}`,
    active: '/api/measurementtypes/active',
    many: '/api/measurmenttypes/many',
  },
  payment_methods: {
    all: '/api/paymentmethod',
    one: (id) => `/api/paymentmethod/${id}`,
    active: '/api/paymentmethod/active',
  },
  stakeholder_types: {
    all: '/api/stakeholdertype',
    one: (id) => `/api/stakeholdertype/${id}`,
    active: '/api/stakeholdertype/active',
  },
  stakeholders: {
    all: '/api/stakeholder',
    one: (id) => `/api/stakeholder/${id}`,
    active: '/api/stakeholder/active',
  },
  statistics: {
    all: '/api/statistics',
    one: (id) => `/api/statistics/${id}`,
  },
  service_types: {
    all: '/api/servicetypes',
    active: '/api/servicetypes/active',
    one: (id) => `/api/servicetypes/${id}`,
    unit_service: {
      all: (id) => `/api/servicetypes/unitservice/${id}`,
      active: (id) => `/api/servicetypes/unitservice/${id}/active`,
    },
  },
  subscriptions: {
    all: '/api/subscription',
    allinhome: '/api/subscription/inhome',
    unit_service: (id) => `/api/subscription/unitservice/${id}`,
    active: '/api/subscription/active',
    one: (id) => `/api/subscription/${id}`,
  },
  unit_service_types: {
    all: '/api/ustypes',
    active: '/api/ustypes/active',
    one: (id) => `/api/ustypes/${id}`,
  },
  unit_services: {
    all: '/api/unitservice',
    active: '/api/unitservice/active',
    one: (id) => `/api/unitservice/${id}`,
  },
  departments: {
    all: '/api/departments',
    active: '/api/departments/active',
    one: (id) => `/api/departments/${id}`,
    unit_service: {
      all: (id) => `/api/departments/unitservice/${id}`,
      active: (id) => `/api/departments/unitservice/${id}/active`,
    },
  },
  work_shifts: {
    all: '/api/wshifts',
    one: (id) => `/api/wshifts/${id}`,
    unit_service: {
      all: (id) => `/api/wshifts/unitservice/${id}`,
      active: (id) => `/api/wshifts/unitservice/${id}/active`,
    },
  },
  work_groups: {
    all: '/api/wgroups',
    one: (id) => `/api/wgroups/${id}`,
    unit_service: {
      all: (id) => `/api/wgroups/unitservice/${id}`,
      active: (id) => `/api/wgroups/unitservice/${id}/active`,
    },
    department: {
      all: (id) => `/api/wgroups/department/${id}`,
      active: (id) => `/api/wgroups/department/${id}/active`,
    },
    employee: {
      all: (id) => `/api/wgroups/employee/${id}`,
      active: (id) => `/api/wgroups/employee/${id}/active`,
      acl: (id) => `/api/wgroups/employee/${id}/acl`,
      engagement: (id) => `/api/wgroups/employee/engagement/${id}`,
    },
  },
  notifications: {
    all: '/api/notifications',
    readOne: (id) => `/api/notifications/${id}/read`,
    readMany: '/api/notifications/read',
    my: (id, emid, page) => `/api/notifications/user/${id}/employee/${emid}?page=${page}`,
    pateint: (id) => `/api/notifications/patient/${id}`,
  },
  appointment_types: {
    all: '/api/appointments/types',
    one: (id) => `/api/appointments/types/${id}`,
    unit: (id) => `/api/appointments/types/unit/${id}`,
  },
  appointment_configs: {
    all: '/api/appointments/config',
    one: (id) => `/api/appointments/config/${id}`,
    employee: {
      all: (emid) => `/api/appointments/config/employee/${emid}`,
    },
    unit_service: {
      all: (id) => `/api/appointments/config/unitservice/${id}`,
    },
    department: {
      all: (id) => `/api/appointments/config/department/${id}`,
    },
  },
  free_subscriptions: {
    all: '/api/freesubscription',
    one: (id) => `/api/freesubscription/${id}`,
  },
  taxes: {
    all: '/api/taxes',
    one: (id) => `/api/taxes/${id}`,
  },
  activities: {
    all: '/api/activities',
    one: (id) => `/api/activities/${id}`,
    unit_service: {
      all: (id) => `/api/activities/unitservice/${id}`,
    },
    department: {
      all: (id) => `/api/activities/department/${id}`,
    },
  },
  calender: {
    all: '/api/calender',
    // one: (id) => `/api/calender/${id}`,
    superadmin: '/api/calender/superadmin',
    employee: {
      all: (id) => `/api/calender/employee/${id}`,
    },
    patient: {
      all: (id) => `/api/calender/patient/${id}`,
    },
  },
  deductions: {
    all: '/api/deductionconfig',
    one: (id) => `/api/deductionconfig/${id}`,
  },
  keywords: {
    find: '/api/keywords/find',
    all: '/api/keywords',
    arabic: '/api/keywords/ar',
  },
  patients: {
    all: '/api/patient',
    deleteFamilyMember: (id) => `/api/patient/deleteFamilyMember/${id}`,
    find: `/api/patient/find`,
    employee: (id) => `/api/patient/employee/${id}`,
    unitservice: (id) => `/api/patient/unitservice/${id}`,
    // find: ({ identification_num, email, mobile_num1 }) =>
    //   `/api/patient/find?id=${identification_num}&&email=${email}&&mobile=${mobile_num1}`,
    findPatient: ({ identification_num, mobile_num1, name_english, name_arabic }) =>
      `/api/patient/findpatient?id=${identification_num}&&mobile_num1=${mobile_num1}&&name_english=${name_english}&&name_arabic=${name_arabic}`,
    family: (id) => `/api/patient/myfamily/${id}`,
    familyType: '/api/family',
    one: (id) => `/api/patient/${id}`,
  },
  oldpatient: {
    all: '/api/oldpatientsdata',
    details: '/api/oldpatientsdata/details',
    one: (id) => `/api/oldpatientsdata/${id}`,
    unit_service: {
      all: (id) => `/api/oldpatientsdata/unitservice/${id}`,
    },
    employee: {
      all: (id) => `/api/oldpatientsdata/employee/${id}`,
    },
  },
  license_movements: {
    all: '/api/licensemovements',
    one: (id) => `/api/licensemovements/${id}`,
    unit_service: {
      all: `/api/licensemovements/unitservice`,
      one: (id) => `/api/licensemovements/unitservice/${id}`,
    },
    stakeholder: {
      all: `/api/licensemovements/stakeholder`,
      one: (id) => `/api/licensemovements/stakeholder/${id}`,
    },
  },
  feedbacks: {
    all: '/api/feedback',
    one: (id) => `/api/feedback/${id}`,
    unit_service: {
      all: `/api/feedback/unitservices`,
      one: (id) => `/api/feedback/unitservice/${id}`,
    },
    stakeholder: {
      all: `/api/feedback/stakeholders`,
      one: (id) => `/api/feedback/stakeholder/${id}`,
    },
    doctorna: {
      all: `/api/feedback/doctorna`,
    },
    department: {
      one: (id) => `/api/feedback/department/${id}`,
    },
    employee: {
      one: (id) => `/api/feedback/employee/${id}`,
    },
    patient: {
      one: (id) => `/api/feedback/patient/${id}`,
    },
  },
  appointments: {
    all: '/api/appointments',
    one: (id) => `/api/appointments/${id}`,
    book: (id) => `/api/appointments/${id}/book`,
    available: '/api/appointments/available',
    employee: {
      one: ({ id, page = 0, sortBy = 'code', rowsPerPage = 100, order = 'asc', filters }) =>
        `/api/appointments/employee/${id}?page=${page}&&sortBy=${sortBy}&&rowsPerPage=${rowsPerPage}&&order=${order}&&status=${filters?.status}&&appointype=${filters?.types}&&startDate=${filters?.startDate}&&endDate=${filters?.endDate}&&group=${filters?.group}&&shift=${filters?.shift}&&startTime=${filters?.startTime}&&endTime=${filters?.endTime}`,
      nearst: (id) => `/api/appointments/nearst/${id}`,
      // select: ({ id, startDate }) =>
      //   `/api/appointments/employeeselect/${id}?startDate=${startDate}`,
      select: ({ id, startDate }) =>
        `/api/appointments/employeeselect/${id}?startDate=${startDate}`,
    },
    department: {
      one: ({ id, page = 0, sortBy = 'code', rowsPerPage = 5, order = 'asc', filters }) =>
        `/api/appointments/department/${id}?page=${page}&&sortBy=${sortBy}&&rowsPerPage=${rowsPerPage}&&order=${order}&&status=${filters?.status}&&appointype=${filters?.types}&&startDate=${filters?.startDate}&&endDate=${filters?.endDate}&&group=${filters?.group}&&shift=${filters?.shift}&&startTime=${filters?.startTime}&&endTime=${filters?.endTime}`,
    },
    unit_service: {
      one: ({ id, page = 0, sortBy = 'code', rowsPerPage = 100, order = 'asc', filters }) =>
        `/api/appointments/unitservice/${id}?page=${page}&&sortBy=${sortBy}&&rowsPerPage=${rowsPerPage}&&order=${order}&&status=${filters?.status}&&appointype=${filters?.types}&&startDate=${filters?.startDate}&&endDate=${filters?.endDate}&&group=${filters?.group}&&shift=${filters?.shift}`,
      available: (id) => `/api/appointments/available/${id}`,
    },
    patient: {
      many: (id) => `/api/appointments/patient/${id}`,
      notify: (id) => `/api/appointments/notify/${id}`,
      one: (id) => `/api/appointments/onepatient/${id}`,
      createPatientAndBookAppoint: (id) => `/api/appointments/${id}/newpatient`,
    },
  },
  economec_movements: {
    all: '/api/economicmovements',
    one: (id) => `/api/economicmovements/${id}`,
    department: {
      one: (id) => `/api/economicmovements/department/${id}`,
    },
    unit_service: {
      one: (id) => `/api/economicmovements/unitservice/${id}`,
      available: (id) => `/api/appointments/available/${id}`,
    },
    patient: {
      one: (id) => `/api/economicmovements/patient/${id}`,
    },
    stakeholder: {
      one: (id) => `/api/economicmovements/stakeholder/${id}`,
    },
  },
  income_payment: {
    all: '/api/incomepayment',
    one: (id) => `/api/incomepayment/${id}`,
    department: {
      one: (id) => `/api/incomepayment/department/${id}`,
    },
    unit_service: {
      one: (id) => `/api/incomepayment/unitservice/${id}`,
    },
    patient: {
      one: (id) => `/api/incomepayment/patient/${id}`,
    },
    stakeholder: {
      one: (id) => `/api/incomepayment/stakeholder/${id}`,
    },
  },
  offers: {
    all: '/api/suppliersoffers',
    one: (id) => `/api/suppliersoffers/${id}`,
    stakeholder: {
      one: (id) => `/api/suppliersoffers/stakeholder/${id}`,
    },
  },
  systemErrors: {
    all: '/api/systemerrors',
    one: (id) => `/api/systemerrors/${id}`,
  },
  TicketCategories: {
    all: '/api/tickets/categories',
    one: (id) => `/api/tickets/categories/${id}`,
  },
  tickets: {
    all: '/api/tickets',
    one: (id) => `/api/tickets/${id}`,
  },
  chat: {
    all: '/api/chat',
    one: (id) => `/api/chat/${id}`,
  },

  tables: {
    // countries: `/api/countries`,
    // country: (id) => `/api/countries/${id}`,
    // cities: '/api/cities',
    // manyCities: '/api/cities/many',
    // manyAnalyses: '/api/analysis/many',
    // city: (id) => `/api/cities/${id}`,
    // surgeries: '/api/surgeries',
    // surgery: (id) => `/api/surgeries/${id}`,
    // diseases: '/api/diseases',
    // disease: (id) => `/api/diseases/${id}`,
    // symptoms: '/api/symptoms',
    // symptom: (id) => `/api/symptoms/${id}`,
    // categories: '/api/medcategories',
    // category: (id) => `/api/medcategories/${id}`,
    // currencies: '/api/currency',
    // currency: (id) => `/api/currency/${id}`,
    // medfamilies: '/api/drugfamilies',
    // medfamily: (id) => `/api/drugfamilies/${id}`,
    // medicines: '/api/medicines',
    // medicine: (id) => `/api/medicines/${id}`,
    // notifications: '/api/notifications',
    // readNotification: (id) => `/api/notifications/${id}/read`,
    // readNotifications: '/api/notifications/read',
    // unreadNotificationsCount: '/api/notifications/unreadcount',
    // myNotifications: (id, emid, page) =>
    //   `/api/notifications/user/${id}/employee/${emid}?page=${page}`,
    // myUnreadNotifications: (id, emid) => `/api/notifications/user/${id}/employee/${emid}/count`,
    // diets: '/api/diets',
    // diet: (id) => `/api/diets/${id}`,
    // analyses: '/api/analysis',
    // analysis: (id) => `/api/analysis/${id}`,
    // insuranceCo: (id) => `/api/insurance/companies/${id}`,
    // insuranceTypes: '/api/insurance/types',
    // insuranceType: (id) => `/api/insurance/types/${id}`,
    // unitservice: (id) => `/api/unitservice/${id}`,
    // usId: () => `/api/unitservice/usId`,
    // departments: '/api/departments',
    // unitServiceDepartments: (id) => `/api/departments/unitservice/${id}`,
    // department: (id) => `/api/departments/${id}`,
    // specialities: '/api/specialities',
    // speciality: (id) => `/api/specialities/${id}`,
    // subspecialities: '/api/subspecialities',
    // subspeciality: (id) => `/api/subspecialities/${id}`,
    // appointmenttypes: '/api/appointments/types',
    // appointmenttype: (id) => `/api/appointments/types/${id}`,
    // appointmentconfigs: '/api/appointments/config',
    // employeeAppointmentconfig: (emid) => `/api/appointments/config/employee/${emid}`,
    // appointmentconfig: (id) => `/api/appointments/config/${id}`,
    // usappointmentconfig: (id) => `/api/appointments/config/unitservice/${id}`,
    // departmentappointmentconfig: (id) => `/api/appointments/config/department/${id}`,
    // freesubscriptions: '/api/freesubscription',
    // freesubscription: (id) => `/api/freesubscription/${id}`,
    // unitservicetype: (id) => `/api/ustypes/${id}`,
    // taxes: '/api/taxes',
    // tax: (id) => `/api/taxes/${id}`,
    // activities: '/api/activities',
    // usActivities: (id) => `/api/activities/unitservice/${id}`,
    // usActivitiesCount: (id) => `/api/activities/unitservice${id}/count`,
    // departmentActivities: (id) => `/api/activities/department/${id}`,
    // departmentActivitiesCount: (id) => `/api/activities/department/${id}/count`,
    // activity: (id) => `/api/activities/${id}`,
    // employeetypes: '/api/employeetypes',
    // usEmployeetypes: (id) => `/api/employeetypes/unitservice/${id}`,
    // employeetype: (id) => `/api/employeetypes/${id}`,
    // employees: '/api/employees',
    // employee: (id) => `/api/employees/${id}`,
    // findEmployee: `/api/employees/find`,
    // employeeEngagements: `/api/employees/engagement`,
    // employeeEngagement: (id) => `/api/employees/engagement/${id}`,
    // usEmployeesCount: (id) => `/api/employees/engagement/unitservice/${id}/count`,
    // departmentEmployeesCount: (id) => `/api/employees/engagement/department/${id}/count`,
    // paymentmethod: (id) => `/api/paymentmethod/${id}`,
    // stakeholdertypes: '/api/stakeholdertype',
    // stakeholdertype: (id) => `/api/stakeholdertype/${id}`,
    // stakeholders: '/api/stakeholder',
    // stakeholder: (id) => `/api/stakeholder/${id}`,
    // workshifts: '/api/wshifts',
    // workshift: (id) => `/api/wshifts/${id}`,
    // workgroups: '/api/wgroups',
    // usWorkgroups: (id) => `/api/wgroups/unitservice/${id}`,
    // employeeWorkgroups: (id) => `/api/wgroups/employee/${id}`,
    // departmentemployeeWorkgroups: (id, emid) => `/api/wgroups/department/${id}/employee/${emid}`,
    // usemployeeWorkgroups: (id, emid) => `/api/wgroups/unitservice/${id}/employee/${emid}`,
    // workgroup: (id) => `/api/wgroups/${id}`,
    // servicetype: (id) => `/api/servicetypes/${id}`,
    // measurmenttype: (id) => `/api/measurementtypes/${id}`,
    // employeeCalender: (id) => `/api/calender/employee/${id}`,
    // patientCalender: (id) => `/api/calender/patient/${id}`,
    // calender: `/api/calender`,
    // hospitals: '/api/hospital',
    // hospital: (id) => `/api/hospital/${id}`,
    // deductions: '/api/deductionconfig',
    // deduction: (id) => `/api/deductionconfig/${id}`,
    // rooms: '/api/rooms',
    // room: (id) => `/api/rooms/${id}`,
    // usRooms: (id) => `/api/rooms/unitservice/${id}`,
    // usRoomsCount: (id) => `/api/rooms/unitservice/${id}/count`,
    // departmentRooms: (id) => `/api/rooms/department/${id}`,
    // departmentRoomsCount: (id) => `/api/rooms/department/${id}/count`,
    // patients: '/api/patient',
    // oldpatientsdata: '/api/oldpatientsdata',
    // oldpatient: `/api/oldpatientsdata/details`,
    // findPatients: '/api/patient/find',
    // patient: (id) => `/api/patient/${id}`,
    // usOldpatients: (id) => `/api/oldpatientsdata/unitservice/${id}`,
    // employeeOldpatients: (id) => `/api/oldpatientsdata/employee/${id}`,
    // newOldPatient: `/api/oldpatientsdata/`,
    // unitServiceLicenseMovement: (id) => `/api/licensemovements/unitservice/${id}`,
    // unitServiceLicenseMovements: `/api/licensemovements/unitservice`,
    // stakeholderLicenseMovement: (id) => `/api/licensemovements/stakeholder/${id}`,
    // stakeholderLicenseMovements: `/api/licensemovements/stakeholder`,
    // licenseMovement: (id) => `/api/licensemovements/${id}`,
    // licenseMovements: `/api/licensemovements`,
    // subscription: (id) => `/api/subscription/${id}`,
    // feedbacks: '/api/feedback',
    // doctornafeedbacks: '/api/feedback/doctorna',
    // USsfeedbacks: '/api/feedback/unitservices',
    // stakeholdersfeedbacks: '/api/feedback/stakeholders',
    // USfeedbacks: (id) => `/api/feedback/unitservice/${id}`,
    // USfeedbacksCount: (id) => `/api/feedback/unitservice/${id}/count`,
    // departmentfeedbacks: (id) => `/api/feedback/department/${id}`,
    // employeefeedbacks: (id) => `/api/feedback/employee/${id}`,
    // usemployeefeedbacks: (id, emid) => `/api/feedback/unitservice/${id}/employee/${emid}`,
    // departmentemployeefeedbacks: (id, emid) => `/api/feedback/department/${id}/employee/${emid}`,
    // departmentfeedbacksCount: (id) => `/api/feedback/department/${id}/count`,
    // patientfeedbacks: (id) => `/api/feedback/patient/${id}`,
    // stakeholderFeedbacks: (id) => `/api/feedback/stakeholder/${id}`,
    // feedback: (id) => `/api/feedback/${id}`,
    // appointments: '/api/appointments',
    // availableAppointments: '/api/appointments/available',
    // appointment: (id) => `/api/appointments/${id}`,
    // nearstAppointment: (id) => `/api/appointments/nearst/${id}`,
    // createPatientAndBookAppoint: (id) => `/api/appointments/${id}/newpatient`,
    // usAppointmentsavilable: (id) => `/api/appointments/available/${id}`,
    // usAppointmentsCount: (id) => `/api/appointments/unitservice/${id}/count`,
    // departmentAppointmentsCount: (id) => `/api/appointments/department/${id}/count`,
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
    // patientAppointments: (id) => `/api/appointments/patient/${id}`,
    // patientoneAppointments: (id) => `/api/appointments/onepatient/${id}`,
    // economecMovements: '/api/economicmovements',
    // economicMovement: (id) => `/api/economicmovements/${id}`,
    // patienteconomicMovements: (id) => `/api/economicmovements/patient/${id}`,
    // stakeholdereconomicMovements: (id) => `/api/economicmovements/stakeholder/${id}`,
    // usEconomicMovements: (id) => `/api/economicmovements/unitservice/${id}`,
    // usEconomicMovementsCount: (id) => `/api/economicmovements/unitservice/${id}/count`,
    // departmentEconomicMovements: (id) => `/api/economicmovements/department/${id}`,
    // departmentEconomicMovementsCount: (id) => `/api/economicmovements/department/${id}/count`,
    // incomePaymentControl: '/api/incomepayment',
    // incomePayment: (id) => `/api/incomepayment/${id}`,
    // offers: '/api/suppliersoffers',
    // offer: (id) => `/api/suppliersoffers/${id}`,
    // stakeholderOffers: (id) => `/api/suppliersoffers/stakeholder/${id}`,
    // patientIncomePaymentControl: (id) => `/api/incomepayment/patient/${id}`,
    // departmentIncomePaymentControl: (id) => `/api/incomepayment/department/${id}`,
    // stakeholderIncomePaymentControl: (id) => `/api/incomepayment/stakeholder/${id}`,
    // systemErrors: '/api/systemerrors',
    // systemError: (id) => `/api/systemerrors/${id}`,
  },
  // chat: '/api/chat',
  // kanban: '/api/kanban',
  // calendar: '/api/calendar',
  auth: {
    user: (id) => `/api/auth/${id}`,
    patientUser: (id) => `/api/auth/patient/${id}`,
    users: '/api/auth',
    me: '/api/auth/me',
    login: '/api/auth/login',
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
  },
  posts: {
    getAll: '/api/post',
  },
  payment: {
    getAllpaymentmethods: '/api/paymentmethods',
  },
};
