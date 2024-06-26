// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  SUPERADMIN: '/dashboard',
  USER: '/user',
  BETWEEN: '/between',
  PAGES: '/pages',
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

  // AUTH
  auth: {
    login: `/login`,
    register: `/register`,
    registersu: `/register/serviceunit`,
    verify: (email) => `/verify?email=${email}`,
    newPassword: `/new-password`,
    forgotPassword: `/forgot-password`,
  },

  // PAGES
  between: {
    root: ROOTS.BETWEEN,
  },
  pages: {
    root: ROOTS.PAGES,
    patients: `/patients`,
    unit: `/unit`,
    UsPricing: `/UsPricing`,
    About: `/about`,
    Training: `/training`,

    serviceUnit: (id) => `/serviceunit/${id}`,
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
      qr: `${ROOTS.DASHBOARD}/myprofile/`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      prescriptions: `${ROOTS.DASHBOARD}/user/prescriptions`,
      family: `${ROOTS.DASHBOARD}/user/family`,
      insurance: `${ROOTS.DASHBOARD}/user/insurance`,
      history: `${ROOTS.DASHBOARD}/user/history`,
      historyinfo: (id) => `${ROOTS.DASHBOARD}/user/historyinfo/${id}`,
      medicalreports: `${ROOTS.DASHBOARD}/user/medicalreports`,
      sickLeave: `${ROOTS.DASHBOARD}/user/sickLeave`,
      cards: `${ROOTS.DASHBOARD}/user/appointments`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      exist: `${ROOTS.DASHBOARD}/user/exist`,
      create: `${ROOTS.DASHBOARD}/user/create`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      share: `${ROOTS.DASHBOARD}/user/share`,
      health: `${ROOTS.DASHBOARD}/user/myhealth`,
      products: {
        all: `${ROOTS.DASHBOARD}/user/products/all`,
        offer: (id) => `${ROOTS.DASHBOARD}/user/products/offer/${id}`,
        root: `${ROOTS.DASHBOARD}/user/products`,
        info: (id) => `${ROOTS.DASHBOARD}/user/products/${id}/info`,
        checkout: `${ROOTS.DASHBOARD}/user/products/checkout`,
        stakeholder: {
          root: `${ROOTS.DASHBOARD}/user/products/stakeholder`,
          one: (id) => `${ROOTS.DASHBOARD}/user/products/stakeholder/${id}`,
        },
      },
      orders: {
        root: `${ROOTS.SUPERADMIN}/user/orders`,
        info: (id) => `${ROOTS.SUPERADMIN}/user/orders/${id}/details`,
      },

      financilmovment: `${ROOTS.DASHBOARD}/user/financilmovment`,
      patientsappointments: `${ROOTS.DASHBOARD}/user/appointments`,
      bookappointment: (id) => `${ROOTS.DASHBOARD}/user/bookappointment/${id}`,
      oldmedicalreportsview: (id) => `${ROOTS.DASHBOARD}/user/oldmedicalreportsview/${id}`,
      doctorpage: (id, date) => `${ROOTS.DASHBOARD}/user/doctorpage/${id}`,
      specialities: `${ROOTS.DASHBOARD}/user/specialities`,
      watingroom: `${ROOTS.DASHBOARD}/user/watingroom`,
      bmi: `${ROOTS.DASHBOARD}/user/bmi`,
      oldpatientdata: `${ROOTS.DASHBOARD}/user/oldpatientdata`,
      emergency: `${ROOTS.DASHBOARD}/user/emergency`,
      edit: `${ROOTS.DASHBOARD}/user/contactus`,
    },
  },

  // STAKEHOLDERS
  stakeholder: {
    root: ROOTS.SUPERADMIN,
    profile: `${ROOTS.SUPERADMIN}/myprofile`,
    products: {
      root: `${ROOTS.SUPERADMIN}/myproducts`,
      new: `${ROOTS.SUPERADMIN}/myproducts/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/myproducts/${id}/edit`,
    },
    offers: {
      root: `${ROOTS.SUPERADMIN}/myoffers`,
      new: `${ROOTS.SUPERADMIN}/myoffers/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/myoffers/${id}/edit`,
    },
    orders: {
      root: `${ROOTS.SUPERADMIN}/myorders`,
      details: (id) => `${ROOTS.SUPERADMIN}/myorders/${id}/details`,
    },
    customers: {
      root: `${ROOTS.SUPERADMIN}/mycustomers`,
    },
    accounting: {
      root: `${ROOTS.SUPERADMIN}/myaccounting`,
    },
  },

  // super adnim
  superadmin: {
    root: ROOTS.SUPERADMIN,
    ourCalendar: `${ROOTS.SUPERADMIN}/ourcalender`,
    mail: `${ROOTS.SUPERADMIN}/mail`,
    unitservices: {
      root: `${ROOTS.SUPERADMIN}/unitservices`,
      list: `${ROOTS.SUPERADMIN}/unitservices/list`,
      departments: {
        root: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/departments`,
        new: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/new`,
        info: (id, depid) => `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/info`,
        employees: {
          root: (id, depid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees`,
          new: (id, depid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/new`,
          edit: (id, depid, emid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/edit`,
          info: (id, depid, emid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/info`,
          appointments: (id, depid, emid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/appointments`,
          appointmentconfig: {
            root: (id, depid, emid) =>
              `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/appointmentconfig`,
            details: (id, depid, emid, coid) =>
              `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/appointmentconfig/${coid}`,
            new: (id, depid, emid) =>
              `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/appointmentconfig/new`,
          },
          accounting: (id, depid, emid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/accounting`,
          feedback: (id, depid, emid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/feedback`,
          attendence: (id, depid, emid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/attendence`,
          offers: (id, depid, emid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/offers`,
          activities: {
            root: (id, depid, emid) =>
              `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/activities`,
            new: (id, depid, emid) =>
              `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/activities/new`,
            edit: (id, depid, emid) =>
              `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/activities`,
          },
          acl: (id, depid, emid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/employees/${emid}/acl`,
        },
        accounting: (id, depid) =>
          `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/accounting`,
        activities: {
          root: (id, depid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/activities`,
          new: (id, depid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/activities/new`,
          edit: (id, depid, acid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/activities/${acid}/edit`,
        },
        rooms: {
          root: (id, depid) => `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/rooms`,
          new: (id, depid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/rooms/new`,
          edit: (id, depid, acid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/rooms/${acid}/edit`,
        },
        workGroups: {
          root: (id, depid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/wgroups`,
          new: (id, depid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/wgroups/new`,
          edit: (id, depid, acid) =>
            `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/wgroups/${acid}/edit`,
        },
        appointments: (id, depid) =>
          `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/appointments`,
        appointmentconfiguration: (id, depid) =>
          `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/appointmentconfiguration`,
        qualityControl: (id, depid) =>
          `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/qc`,
        edit: (id, depid) => `${ROOTS.SUPERADMIN}/unitservices/${id}/departments/${depid}/edit`,
      },
      employees: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/employees`,
      appointments: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/appointments`,
      accounting: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/accounting`,
      newAccounting: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/accounting/new`,
      editAccounting: (id, ID) => `${ROOTS.SUPERADMIN}/unitservices/${id}/accounting/${ID}/edit`,
      communications: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/communications`,
      feedback: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/feedback`,
      insurance: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/insurance`,
      info: (id) => `${ROOTS.SUPERADMIN}/unitservices/${id}/info`,
    },
    patients: {
      root: `${ROOTS.SUPERADMIN}/patients`,
      list: `${ROOTS.SUPERADMIN}/patients/list`,
      new: `${ROOTS.SUPERADMIN}/patients/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/patients/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/patients/${id}/info`,
      communications: (id) => `${ROOTS.SUPERADMIN}/patients/${id}/communications`,
      history: {
        root: (id) => `${ROOTS.SUPERADMIN}/patients/${id}/history`,
        addAppointment: (id) => `${ROOTS.SUPERADMIN}/patients/${id}/bookappoint`,
        editAppointment: (id) => `${ROOTS.SUPERADMIN}/patients/${id}/history/addappoint`,
        new: `${ROOTS.SUPERADMIN}/tables/cities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/cities/${id}/edit`,
        invoices: {
          // root: `${ROOTS.SUPERADMIN}/invoices`,
          info: (id, inid) => `${ROOTS.SUPERADMIN}/patients/${id}/invoices/${inid}/info`,
          // edit:(id,inid) => `${ROOTS.SUPERADMIN}/patients/${id}/invoices/${inid}/edit`,
        },
        payment: {
          // root: `${ROOTS.SUPERADMIN}/invoices`,
          info: (id, inid) => `${ROOTS.SUPERADMIN}/patients/${id}/payment/${inid}/info`,
          // edit:(id,inid) => `${ROOTS.SUPERADMIN}/patients/${id}/invoices/${inid}/edit`,
        },
      },
      feedback: (id) => `${ROOTS.SUPERADMIN}/patients/${id}/feedback`,
      insurance: (id) => `${ROOTS.SUPERADMIN}/patients/${id}/insurance`,
    },
    stakeholders: {
      root: `${ROOTS.SUPERADMIN}/stakeholders`,
      list: `${ROOTS.SUPERADMIN}/stakeholders/list`,
      new: `${ROOTS.SUPERADMIN}/stakeholders/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/info`,
      offers: (id) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/offers`,
      offer: (id, ofid) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/offers/${ofid}`,
      communications: (id) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/communications`,
      history: {
        root: (id) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/history`,
        addAppointment: (id) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/bookappoint`,
        editAppointment: (id) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/history/addappoint`,
        new: `${ROOTS.SUPERADMIN}/tables/cities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/cities/${id}/edit`,
        invoices: {
          // root: `${ROOTS.SUPERADMIN}/invoices`,
          info: (id, inid) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/invoices/${inid}/info`,
          // edit:(id,inid) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/invoices/${inid}/edit`,
        },
        payment: {
          // root: `${ROOTS.SUPERADMIN}/invoices`,
          info: (id, inid) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/payment/${inid}/info`,
          // edit:(id,inid) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/invoices/${inid}/edit`,
        },
      },
      feedback: (id) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/feedback`,
      insurance: (id) => `${ROOTS.SUPERADMIN}/stakeholders/${id}/insurance`,
    },
    accounting: {
      root: `${ROOTS.SUPERADMIN}/accounting`,
      unitservice: {
        root: (id) => `${ROOTS.SUPERADMIN}/accounting/unitservice/${id}`,
        add: (id) => `${ROOTS.SUPERADMIN}/accounting/unitservice/${id}/new`,
        edit: (id, acid) => `${ROOTS.SUPERADMIN}/accounting/unitservice/${id}/edit/${acid}`,
      },
      stakeholder: {
        root: (id) => `${ROOTS.SUPERADMIN}/accounting/stakeholder/${id}`,
        add: (id) => `${ROOTS.SUPERADMIN}/accounting/stakeholder/${id}/new`,
        edit: (id, acid) => `${ROOTS.SUPERADMIN}/accounting/stakeholder/${id}/edit/${acid}`,
      },
    },
    statistics: {
      root: `${ROOTS.SUPERADMIN}/statistics`,
      new: `${ROOTS.SUPERADMIN}/statistics/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/statistics/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/statistics/${id}/info`,
    },
    users: {
      root: `${ROOTS.SUPERADMIN}/users`,
      new: `${ROOTS.SUPERADMIN}/users/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/users/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/statistics/${id}/info`,
    },
    employees: {
      root: `${ROOTS.SUPERADMIN}/employees`,
      new: `${ROOTS.SUPERADMIN}/employees/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/employees/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/statistics/${id}/info`,
    },
    subscriptions: {
      root: `${ROOTS.SUPERADMIN}/subscriptions`,
      new: `${ROOTS.SUPERADMIN}/subscriptions/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/subscriptions/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/subscriptions/${id}/info`,
    },
    communication: {
      root: `${ROOTS.SUPERADMIN}/communication`,
      new: `${ROOTS.SUPERADMIN}/communication/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/communication/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/communication/${id}`,
    },
    accessControlList: {
      root: `${ROOTS.SUPERADMIN}/acl`,
      new: `${ROOTS.SUPERADMIN}/acl/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/acl/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/acl/${id}/info`,
    },
    customersTraining: {
      root: `${ROOTS.SUPERADMIN}/training`,
      new: `${ROOTS.SUPERADMIN}/training/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/training/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/training/${id}/info`,
    },
    doctornaTeamTraining: {
      root: `${ROOTS.SUPERADMIN}/traineeship`,
      new: `${ROOTS.SUPERADMIN}/traineeship/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/traineeship/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/traineeship/${id}/info`,
    },
    adjustableServices: {
      root: `${ROOTS.SUPERADMIN}/asc`,
      new: `${ROOTS.SUPERADMIN}/asc/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/asc/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/asc/${id}/info`,
    },
    qualityControl: {
      root: `${ROOTS.SUPERADMIN}/qc`,
      doctorna: `${ROOTS.SUPERADMIN}/qc/doctorna`,
      unitservices: `${ROOTS.SUPERADMIN}/qc/unitservices`,
      unitservice: (id) => `${ROOTS.SUPERADMIN}/qc/unitservices/${id}`,
      stakeholders: `${ROOTS.SUPERADMIN}/qc/stakeholders`,
      stakeholder: (id) => `${ROOTS.SUPERADMIN}/qc/stakeholders/${id}`,
      new: `${ROOTS.SUPERADMIN}/qc/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/qc/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/qc/${id}/info`,
    },
    tables: {
      root: `${ROOTS.SUPERADMIN}/tables`,
      list: `${ROOTS.SUPERADMIN}/tables/list`,
      details: (tablename) => `${ROOTS.SUPERADMIN}/tables/${tablename}`,
      cities: {
        root: `${ROOTS.SUPERADMIN}/tables/cities`,
        new: `${ROOTS.SUPERADMIN}/tables/cities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/cities/${id}/edit`,
      },
      countries: {
        root: `${ROOTS.SUPERADMIN}/tables/countries`,
        new: `${ROOTS.SUPERADMIN}/tables/countries/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/countries/${id}/edit`,
      },
      ticketCategories: {
        root: `${ROOTS.SUPERADMIN}/tables/ticket_categories`,
        new: `${ROOTS.SUPERADMIN}/tables/ticket_categories/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/ticket_categories/${id}/edit`,
      },
      taxes: {
        root: `${ROOTS.SUPERADMIN}/tables/added_value_tax_GD`,
        new: `${ROOTS.SUPERADMIN}/tables/added_value_tax_GD/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/added_value_tax_GD/${id}/edit`,
      },
      analysis: {
        root: `${ROOTS.SUPERADMIN}/tables/analyses`,
        new: `${ROOTS.SUPERADMIN}/tables/analyses/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/analyses/${id}/edit`,
      },
      appointypes: {
        root: `${ROOTS.SUPERADMIN}/tables/appointment_types`,
        new: `${ROOTS.SUPERADMIN}/tables/appointment_types/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/appointment_types/${id}/edit`,
      },
      currency: {
        root: `${ROOTS.SUPERADMIN}/tables/currencies`,
        new: `${ROOTS.SUPERADMIN}/tables/currencies/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/currencies/${id}/edit`,
      },
      departments: {
        root: `${ROOTS.SUPERADMIN}/tables/departments`,
        new: `${ROOTS.SUPERADMIN}/tables/departments/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/departments/${id}/edit`,
      },
      diets: {
        root: `${ROOTS.SUPERADMIN}/tables/diets`,
        new: `${ROOTS.SUPERADMIN}/tables/diets/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/diets/${id}/edit`,
      },
      companies: {
        root: `${ROOTS.SUPERADMIN}/tables/companies`,
        new: `${ROOTS.SUPERADMIN}/tables/companies/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/companies/${id}/edit`,
      },
      diseases: {
        root: `${ROOTS.SUPERADMIN}/tables/diseases`,
        new: `${ROOTS.SUPERADMIN}/tables/diseases/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/diseases/${id}/edit`,
      },
      freesub: {
        root: `${ROOTS.SUPERADMIN}/tables/free_subscriptions`,
        new: `${ROOTS.SUPERADMIN}/tables/free_subscriptions/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/free_subscriptions/${id}/edit`,
      },
      insurancecomapnies: {
        root: `${ROOTS.SUPERADMIN}/tables/insurance_companies`,
        new: `${ROOTS.SUPERADMIN}/tables/insurance_companies/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/insurance_companies/${id}/edit`,
      },
      insuranceTypes: {
        root: `${ROOTS.SUPERADMIN}/tables/insurance_types`,
        new: `${ROOTS.SUPERADMIN}/tables/insurance_types/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/insurance_types/${id}/edit`,
      },
      medcategories: {
        root: `${ROOTS.SUPERADMIN}/tables/medical_categories`,
        new: `${ROOTS.SUPERADMIN}/tables/medical_categories/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/medical_categories/${id}/edit`,
      },
      medicines: {
        root: `${ROOTS.SUPERADMIN}/tables/medicines`,
        new: `${ROOTS.SUPERADMIN}/tables/medicines/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/medicines/${id}/edit`,
      },
      medfamilies: {
        root: `${ROOTS.SUPERADMIN}/tables/medicines_families`,
        new: `${ROOTS.SUPERADMIN}/tables/medicines_families/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/medicines_families/${id}/edit`,
      },
      specialities: {
        root: `${ROOTS.SUPERADMIN}/tables/specialities`,
        new: `${ROOTS.SUPERADMIN}/tables/specialities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/specialities/${id}/edit`,
      },
      subspecialities: {
        root: `${ROOTS.SUPERADMIN}/tables/sub_specialities`,
        new: `${ROOTS.SUPERADMIN}/tables/sub_specialities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/sub_specialities/${id}/edit`,
      },
      surgeries: {
        root: `${ROOTS.SUPERADMIN}/tables/surgeries`,
        new: `${ROOTS.SUPERADMIN}/tables/surgeries/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/surgeries/${id}/edit`,
      },
      symptoms: {
        root: `${ROOTS.SUPERADMIN}/tables/symptoms`,
        new: `${ROOTS.SUPERADMIN}/tables/symptoms/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/symptoms/${id}/edit`,
      },
      unitservices: {
        root: `${ROOTS.SUPERADMIN}/tables/unit_services`,
        new: `${ROOTS.SUPERADMIN}/tables/unit_services/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/unit_services/${id}/edit`,
      },
      unitservicetypes: {
        root: `${ROOTS.SUPERADMIN}/tables/unit_service_types`,
        new: `${ROOTS.SUPERADMIN}/tables/unit_service_types/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/unit_service_types/${id}/edit`,
      },
      activities: {
        root: `${ROOTS.SUPERADMIN}/tables/activities`,
        new: `${ROOTS.SUPERADMIN}/tables/activities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/activities/${id}/edit`,
      },
      employeetypes: {
        root: `${ROOTS.SUPERADMIN}/tables/employee_types`,
        new: `${ROOTS.SUPERADMIN}/tables/employee_types/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/employee_types/${id}/edit`,
      },
      paymentmethods: {
        root: `${ROOTS.SUPERADMIN}/tables/payment_methods`,
        new: `${ROOTS.SUPERADMIN}/tables/payment_methods/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/payment_methods/${id}/edit`,
      },
      stakeholdertypes: {
        root: `${ROOTS.SUPERADMIN}/tables/stakeholder_types`,
        new: `${ROOTS.SUPERADMIN}/tables/stakeholder_types/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/stakeholder_types/${id}/edit`,
      },
      workshifts: {
        root: `${ROOTS.SUPERADMIN}/tables/work_shifts`,
        new: `${ROOTS.SUPERADMIN}/tables/work_shifts/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/work_shifts/${id}/edit`,
      },
      servicetypes: {
        root: `${ROOTS.SUPERADMIN}/tables/service_types`,
        new: `${ROOTS.SUPERADMIN}/tables/service_types/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/service_types/${id}/edit`,
      },
      measurementtypes: {
        root: `${ROOTS.SUPERADMIN}/tables/measurement_types`,
        new: `${ROOTS.SUPERADMIN}/tables/measurement_types/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/measurement_types/${id}/edit`,
      },
      hospitallist: {
        root: `${ROOTS.SUPERADMIN}/tables/hospital_list`,
        new: `${ROOTS.SUPERADMIN}/tables/hospital_list/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/hospital_list/${id}/edit`,
      },
      deductionconfig: {
        root: `${ROOTS.SUPERADMIN}/tables/deduction_config`,
        new: `${ROOTS.SUPERADMIN}/tables/deduction_config/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/deduction_config/${id}/edit`,
      },
      rooms: {
        root: `${ROOTS.SUPERADMIN}/tables/rooms`,
        new: `${ROOTS.SUPERADMIN}/tables/rooms/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/rooms/${id}/edit`,
      },
      family_relation: {
        root: `${ROOTS.SUPERADMIN}/tables/family_relation`,
        new: `${ROOTS.SUPERADMIN}/tables/family_relation/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/family_relation/${id}/edit`,
      },
      checklist: {
        root: `${ROOTS.SUPERADMIN}/tables/checklist`,
        new: `${ROOTS.SUPERADMIN}/tables/checklist/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/checklist/${id}/edit`,
      },
      productCat: {
        root: `${ROOTS.SUPERADMIN}/tables/product_categories`,
        new: `${ROOTS.SUPERADMIN}/tables/product_categories/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/tables/product_categories/${id}/edit`,
      },
    },
  },

  // unit of service
  unitservice: {
    root: `${ROOTS.SUPERADMIN}/us`,
    acl: {
      root: `${ROOTS.SUPERADMIN}/us/acl`,
      unitservice: `${ROOTS.SUPERADMIN}/us/acl/unitservice`,
      department: `${ROOTS.SUPERADMIN}/us/acl/departments`,
      workgroups: `${ROOTS.SUPERADMIN}/us/acl/workgroups`,
      employees: `${ROOTS.SUPERADMIN}/us/acl/employees`,
    },
    oldPatient: `${ROOTS.SUPERADMIN}/us/oldpatient`,
    departments: {
      processingPage: `${ROOTS.SUPERADMIN}/us/processingpage`,
      viewgPage: `${ROOTS.SUPERADMIN}/us/viewgpage`,
      root: `${ROOTS.SUPERADMIN}/us/departments`,
      new: `${ROOTS.SUPERADMIN}/us/departments/new`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/info`,
      employees: {
        root: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/employees`,
        new: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/new`,
        edit: (id, emid) => `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/edit`,
        info: (id, emid) => `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/info`,
        appointments: (id, emid) =>
          `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/appointments`,
        appointmentconfig: {
          root: (id, emid) =>
            `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/appointmentconfig`,
          details: (id, emid, coid) =>
            `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/appointmentconfig/${coid}`,
          new: (id, emid) =>
            `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/appointmentconfig/new`,
        },
        accounting: (id, emid) =>
          `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/accounting`,
        feedback: (id, emid) =>
          `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/feedback`,
        attendence: (id, emid) =>
          `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/attendence`,
        offers: (id, emid) => `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/offers`,
        activities: {
          root: (id, emid) =>
            `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/activities`,
          new: (id, emid) =>
            `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/activities/new`,
          edit: (id, emid) =>
            `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/activities`,
        },
        acl: (id, emid) => `${ROOTS.SUPERADMIN}/us/departments/${id}/employees/${emid}/acl`,
      },
      accounting: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/accounting`,
      activities: {
        root: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/activities`,
        new: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/activities/new`,
        edit: (id, acid) => `${ROOTS.SUPERADMIN}/us/departments/${id}/activities/${acid}/edit`,
      },
      rooms: {
        root: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/rooms`,
        new: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/rooms/new`,
        edit: (id, acid) => `${ROOTS.SUPERADMIN}/us/departments/${id}/rooms/${acid}/edit`,
      },
      workGroups: {
        root: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/wgroups`,
        new: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/wgroups/new`,
        edit: (id, acid) => `${ROOTS.SUPERADMIN}/us/departments/${id}/wgroups/${acid}/edit`,
        permissions: {
          root: (id, wgid) => `${ROOTS.SUPERADMIN}/us/departments/${id}/wgroups/${wgid}`,
          employee: (id, wgid, emid) =>
            `${ROOTS.SUPERADMIN}/us/departments/${id}/wgroups/${wgid}/employee/${emid}`,
        },
      },
      permissions: {
        root: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/acl`,
        employee: (id, emid) => `${ROOTS.SUPERADMIN}/us/departments/${id}/acl/${emid}`,
      },
      appointments: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/appointments`,
      appointmentconfiguration: (id) =>
        `${ROOTS.SUPERADMIN}/us/departments/${id}/appointmentconfiguration`,
      qualityControl: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/qc`,
      edit: (id) => `${ROOTS.SUPERADMIN}/us/departments/${id}/edit`,
    },
    employees: {
      root: `${ROOTS.SUPERADMIN}/us/employees`,
      new: `${ROOTS.SUPERADMIN}/us/employees/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/info`,
      appointments: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/appointments`,
      appointmentconfig: {
        root: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/appointmentconfig`,
        details: (id, coid) => `${ROOTS.SUPERADMIN}/us/employees/${id}/appointmentconfig/${coid}`,
        new: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/appointmentconfig/new`,
      },
      accounting: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/accounting`,
      feedback: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/feedback`,
      attendence: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/attendence`,
      offers: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/offers`,
      activities: {
        root: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/activities`,
        new: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/activities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/activities`,
      },
      acl: (id) => `${ROOTS.SUPERADMIN}/us/employees/${id}/acl`,
    },
    patients: {
      all: `${ROOTS.SUPERADMIN}/us/patients`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/patients/${id}`,
    },
    orders: {
      root: `${ROOTS.SUPERADMIN}/us/orders`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/orders/${id}/details`,
    },
    appointments: {
      root: `${ROOTS.SUPERADMIN}/us/appointments`,
      book: `${ROOTS.SUPERADMIN}/us/book`,
      edit: (id) => `${ROOTS.SUPERADMIN}/us/appointments/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/appointments/${id}/info`,
    },
    appointmentconfiguration: {
      root: `${ROOTS.SUPERADMIN}/us/appointmentconfiguration`,
      new: `${ROOTS.SUPERADMIN}/us/appointmentconfiguration/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/us/appointmentconfiguration/${id}/edit`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/appointmentconfiguration/${id}/info`,
    },
    accounting: {
      root: `${ROOTS.SUPERADMIN}/us/accounting`,
      economicmovements: {
        root: `${ROOTS.SUPERADMIN}/us/accounting/economicmovements`,
        add: `${ROOTS.SUPERADMIN}/us/accounting/economicmovements/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/accounting/economicmovements/${id}/edit`,
        info: (id) => `${ROOTS.SUPERADMIN}/us/accounting/economicmovements/${id}/info`,
      },
      paymentcontrol: {
        root: `${ROOTS.SUPERADMIN}/us/accounting/paymentcontrol`,
        add: `${ROOTS.SUPERADMIN}/us/accounting/paymentcontrol/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/accounting/paymentcontrol/${id}/edit`,
        info: (id) => `${ROOTS.SUPERADMIN}/us/accounting/paymentcontrol/${id}/info`,
      },
      reciepts: {
        root: `${ROOTS.SUPERADMIN}/us/accounting/reciepts`,
        add: `${ROOTS.SUPERADMIN}/us/accounting/reciepts/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/accounting/reciepts/${id}/edit`,
        info: (id) => `${ROOTS.SUPERADMIN}/us/accounting/reciepts/${id}/info`,
      },
    },
    insurance: {
      root: `${ROOTS.SUPERADMIN}/us/insurance`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/insurance/${id}/info`,
    },
    products: {
      all: `${ROOTS.SUPERADMIN}/us/products/all`,
      offer: (id) => `${ROOTS.SUPERADMIN}/us/products/offer/${id}`,
      root: `${ROOTS.SUPERADMIN}/us/products`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/products/${id}/info`,
      checkout: `${ROOTS.SUPERADMIN}/us/products/checkout`,
      stakeholder: {
        root: `${ROOTS.SUPERADMIN}/us/products/stakeholder`,
        one: (id) => `${ROOTS.SUPERADMIN}/us/products/stakeholder/${id}`,
      },
    },
    communication: {
      root: `${ROOTS.SUPERADMIN}/us/communication`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/communication/${id}`,
    },
    qualityControl: {
      root: `${ROOTS.SUPERADMIN}/us/qc`,
    },
    subscriptions: {
      root: `${ROOTS.SUPERADMIN}/us/subscriptions`,
      new: `${ROOTS.SUPERADMIN}/us/subscriptions/new`,
      info: (id) => `${ROOTS.SUPERADMIN}/us/subscriptions/${id}/info`,
    },
    profile: {
      root: `${ROOTS.SUPERADMIN}/us/profile`,
      edit: `${ROOTS.SUPERADMIN}/us/edit`,
    },
    tables: {
      root: `${ROOTS.SUPERADMIN}/us/tables`,
      details: (tablename) => `${ROOTS.SUPERADMIN}/us/tables/${tablename}`,
      activities: {
        root: `${ROOTS.SUPERADMIN}/us/tables/activities`,
        new: `${ROOTS.SUPERADMIN}/us/tables/activities/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/tables/activities/${id}/edit`,
      },
      appointypes: {
        root: `${ROOTS.SUPERADMIN}/us/tables/appointment_types`,
        new: `${ROOTS.SUPERADMIN}/us/tables/appointment_types/new`,
      },
      employeetypes: {
        root: `${ROOTS.SUPERADMIN}/us/tables/employee_types`,
        new: `${ROOTS.SUPERADMIN}/us/tables/employee_types/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/tables/employee_types/${id}/edit`,
      },
      workshifts: {
        root: `${ROOTS.SUPERADMIN}/us/tables/work_shifts`,
        new: `${ROOTS.SUPERADMIN}/us/tables/work_shifts/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/tables/work_shifts/${id}/edit`,
      },
      workgroups: {
        root: `${ROOTS.SUPERADMIN}/us/tables/work_groups`,
        new: `${ROOTS.SUPERADMIN}/us/tables/work_groups/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/tables/work_groups/${id}/edit`,
        permissions: {
          root: (wgid) => `${ROOTS.SUPERADMIN}/us/tables/work_groups/${wgid}`,
          employee: (wgid, emid) =>
            `${ROOTS.SUPERADMIN}/us/tables/work_groups/${wgid}/employee/${emid}`,
        },
      },
      rooms: {
        root: `${ROOTS.SUPERADMIN}/us/tables/rooms`,
        new: `${ROOTS.SUPERADMIN}/us/tables/rooms/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/tables/rooms/${id}/edit`,
      },
      services: {
        root: `${ROOTS.SUPERADMIN}/us/tables/services`,
        new: `${ROOTS.SUPERADMIN}/us/tables/services/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/us/tables/services/${id}/edit`,
      },
    },
  },

  employee: {
    root: ROOTS.SUPERADMIN,
    workGroups: {
      root: `${ROOTS.SUPERADMIN}/wgroups`,
      permissions: {
        root: (wgid) => `${ROOTS.SUPERADMIN}/wgroups/${wgid}`,
        employee: (wgid, emid) => `${ROOTS.SUPERADMIN}/wgroups/${wgid}/employee/${emid}`,
      },
    },
    patients: {
      info: (id) => `${ROOTS.SUPERADMIN}/mypatients/${id}`,
      all: `${ROOTS.SUPERADMIN}/mypatients`,
    },
    entrancemanagement: {
      root: `${ROOTS.SUPERADMIN}/entrancemanagement`,
      new: `${ROOTS.SUPERADMIN}/entrancemanagement/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/entrancemanagement/${id}/edit`,
    },
    appointments: {
      book: `${ROOTS.SUPERADMIN}/book`,
      root: `${ROOTS.SUPERADMIN}/appointments`,
      edit: (id) => `${ROOTS.SUPERADMIN}/appointments/${id}`,
    },
    checklist: {
      root: `${ROOTS.SUPERADMIN}/checklist`,
      new: `${ROOTS.SUPERADMIN}/checklist/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/checklist/${id}/edit`,
    },
    appointmentconfiguration: {
      root: `${ROOTS.SUPERADMIN}/appointmentconfig`,
      new: `${ROOTS.SUPERADMIN}/appointmentconfig/new`,
      edit: (id) => `${ROOTS.SUPERADMIN}/appointmentconfig/${id}`,
      info: (id) => `${ROOTS.SUPERADMIN}/appointmentconfig/${id}`,
    },
    accounting: {
      root: `${ROOTS.SUPERADMIN}/accounting`,
      economicmovements: {
        root: `${ROOTS.SUPERADMIN}/accounting/economicmovements`,
        add: `${ROOTS.SUPERADMIN}/accounting/economicmovements/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/accounting/economicmovements/${id}/edit`,
        info: (id) => `${ROOTS.SUPERADMIN}/accounting/economicmovements/${id}/info`,
      },
      paymentcontrol: {
        root: `${ROOTS.SUPERADMIN}/accounting/paymentcontrol`,
        add: `${ROOTS.SUPERADMIN}/accounting/paymentcontrol/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/accounting/paymentcontrol/${id}/edit`,
        info: (id) => `${ROOTS.SUPERADMIN}/accounting/paymentcontrol/${id}/info`,
      },
      reciepts: {
        root: `${ROOTS.SUPERADMIN}/accounting/reciepts`,
        add: `${ROOTS.SUPERADMIN}/accounting/reciepts/new`,
        edit: (id) => `${ROOTS.SUPERADMIN}/accounting/reciepts/${id}/edit`,
        info: (id) => `${ROOTS.SUPERADMIN}/accounting/reciepts/${id}/info`,
      },
    },
    communication: {
      root: `${ROOTS.SUPERADMIN}/communication`,
    },
    qualityControl: {
      root: `${ROOTS.SUPERADMIN}/qc`,
    },
    calender: `${ROOTS.SUPERADMIN}/calender`,
    appointmentsToday: `${ROOTS.SUPERADMIN}/appointmentsToday`,
    recored: (id) => `${ROOTS.SUPERADMIN}/recored/${id}`,
    profile: {
      root: `${ROOTS.SUPERADMIN}/profile`,
      edit: `${ROOTS.SUPERADMIN}/edit`,
    },
  },
};
