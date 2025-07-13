# Module Name: Book Appointment

## Purpose
- This module enables users to create, manage, and book patient appointments within the system. It provides an interactive interface for searching existing patients, adding new ones, selecting time slots, and finalizing bookings — all while ensuring data validation and seamless integration with backend services for real-time updates and calendar synchronization.
---

## 1. Frontend Overview

### Component Structure
- **Security Component**: `BookAppointmentPage` (`src/pages/unit-service/appointments/book.jsx`)
  - The `BookAppointmentPage` component renders the appointments dashboard protected by role-based access control (ACL), with dynamic page titles based on the user's current service unit.
- **Parent Component**: `TableCreateView` (`src/sections/unit-service/appointments/view/book.jsx`)
- **Child Components**:
  - `CustomBreadcrumbs` (Breadcrumb navigation)
  - `FormProvider`, `RHFTextField`, `RHFSelect`, `RHFRadioGroup`, `RHFPhoneNumber` (Form input fields using React Hook Form)
  - `BookDetails` (Calendar/time picker UI)
  - `PatientsFound` (Lists found patients during search)
  - `AddEmegencyAppointment` (Modal for urgent/online appointments)
  - `TimePicker` (From MUI X for selecting time ranges)
  - `LoadingButton` (Submit button with loading spinner)
  - `Iconify` (Icon rendering utility)
  - `IconButton` (For resetting filters)
  - `RHFRadioGroup` (To choose patient type: my/new/existing)

### State Management
- **Context Providers**:
  - `useAuthContext()` (Get current logged-in user)
  - `useAclGuard()` (Checks permissions like 'create' for appointments)
  - `useUSTypeGuard()` (Optional: Determines if unit is MedLab — commented out)

- **Hooks**:
  - `useTranslate()`, `useLocales()` (Handles language localization)
  - `useSnackbar()` (Displays success/error toast messages)
  - `useBoolean()` (Manages visibility of `AddEmegencyAppointment` modal)
  - `useGetCountries()` (Fetches country list for nationality input)
  - `useGetUSAppointments(unit_service_id, filters)` (Gets filtered appointment slots)
  - `useGetEmployeeActiveWorkGroups(employee_engagement_id)` (Fetches employee’s work groups)
  - `useGetAppointment(appointment_id)` (Gets details of selected appointment)
  - `useSearchParams()` (Reads URL query params for pre-selecting date/appointment)
  - `useForm({ resolver: yupResolver(NewUserSchema) })` (Manages and validates patient form inputs)
  - `useWatch()` (Tracks real-time form values for search/debounce logic)
  - `useDebounce()` (Delays API requests during input typing)
  - `useState()` (Manages local state for):
    - `filters` (Applied filters like work_group, start/end times)
    - `selectedDate` (Currently selected date for time slots)
    - `selected` (Selected appointment ID)
    - `canReset` (Indicates if filters can be reset)
  - `useEffect()` (Handles side effects like error notifications and date reset)

#### Key State
- `filters`: Holds active filters like status, date range, time, group, shift
- `minToDelay`: Stores delay duration (in minutes) for bulk delay action
- `selected`: Tracks selected appointment IDs for bulk actions
- `tableData`: Local copy of filtered appointment data for rendering
- `canReset`: Boolean indicating if filters have been modified
- `selectedDate`: Currently selected date for filtering time slots
- `selectedAppointData`: Data of currently selected appointment
- `isNotFound`: Flag to show "No results found" message

### Workflow
### 1. **Navigate to Appointments Booking Page**
- User accesses: `/appointments/book`
- Component initializes state and fetches data

### 2. **Data Fetching**
- Fetches unit service ID from authenticated user
- Loads appointments via `useGetUSAppointments(unit_service_id, filters)`
- Loads work groups via `useGetEmployeeActiveWorkGroups(...)`
- Applies filters from query params or defaults

### 3. **User Interaction Options**

#### Filtering
- Status tabs: `available`, `booked`, `canceled`, etc.
- Date/time range pickers
- Dropdown filters: work group, shift
- Search with debounce

####  Selecting Appointment Slot
- Calendar view shows available dates
- Time selection updates `selected` and `selectedDate`

#### Patient Selection
- Choose between:
  - "My Patient"
  - "New Patient"
- Uses `react-hook-form` for validation

### API Integration
| Endpoint | Method | Description |
|----------|--------|-------------|
| `Get /api/patient/find` | Get | Find registered patients on the system |
| `Get /api/countries/` | Get | Get all countries info |
| `Get /api/uspatients/find` | Get | Find unit service patient |
| `Get /api/appointments/:id` | Get | Get single appointment |
| `Get /api/appointments/unitservice/:id` | Get | Get single appointment from the unit service appointments |
| `Get /api/wgroups/employee/:id/active` | Get | Get active work groups for a specific employee |
| `Patch /api/appointments/:id/newpatient` | Patch | Creates appointment and a patient account |

All API calls use `axiosInstance` with appropriate endpoints from `src/utils/axios`.

### Error Handling
| Error type | Handling |
|------------|----------|
| `400 Bad Request` | The client sent an invalid request (missing parameters, invalid data, etc.) |
| `404 Not Found` | Resource not found |
| `409 Conflict` | Conflicting data (e.g., duplicate appointment booking) |
| `401 Unauthorized / 403 Forbidden` | User is not authenticated or authorized to perform the action |
| `500 Internal Server Error` | Something went wrong on the server side |
| `503 Service Unavailable` | The server is temporarily unable to handle the request |

### Security Considerations

#### 1. **Role-Based Access Control (RBAC)**
- Uses `useAclGuard()` hook to enforce permissions
- Example usage:
  ```js
  checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'create' })
  ```
- Ensures only users with appropriate permissions can:
  - Create new appointments
  - Cancel or delay existing ones

#### 2. **Authentication**
- Based on JWT tokens via `useAuthContext()`
- Protected routes ensure only logged-in users can access `/appointments/book`

#### 3. **Authorization & Data Ownership**
- Users only view/edit appointments linked to their unit service
- Backend validates ownership and permissions even if frontend is bypassed

#### 4. **Form Input Validation**
- Validated using `react-hook-form` + `yupResolver`
- Arabic inputs sanitized using regex:
  ```js
  const arabicRegex = /^[\u0600-\u06FF0-9\s!@#\$%\^&*(),.?":;{}|<>]*$/;
  ```

#### 5. **API Call Protection**
- All API calls use `axiosInstance` with:
  - Bearer token authorization
  - Global error handling
- Unauthorized or invalid requests are caught and displayed securely

#### 6. **Audit Trail / Logging**
- Tracks:
  - Who created/modified records
  - When modifications occurred
- Socket events emitted for real-time updates and audit visibility

#### 7. **Sensitive Data Handling**
- User IDs and internal references are hidden using:
  ```js
  select: 'email -_id'
  ```
- Patient data only visible to authorized users

#### 8. **Input Sanitization & XSS Protection**
- Form values are automatically sanitized
- Dynamic content rendered safely to avoid script injection

#### 9. **Session & Token Management**
- Token expiration handled via Axios interceptors
- Secure redirects post-submission using `router.back()`



### Related Files
| File | Role |
|------|------|
| `/src/api/index.js` | Contains hooks like `useGetUSAppointments`, `useGetEmployeeActiveWorkGroups`, etc. |
| `/src/hooks/useAclGuard.js` | Manages ACL-based access control |
| `/src/auth/guard/acl-guard.js` | Implementation of ACL guard for route and action protection |
| `/src/sections/unit-service/appointments/book-details.js` | Renders calendar and time picker UI |
| `/src/sections/unit-service/appointments/patients-found.js` | Displays list of found patients during search |
| `/src/sections/unit-service/appointments/add-emergency-appointment.js` | Modal for creating urgent/emergency appointments |
| `/src/components/hook-form/form-provider.js` | Provides React Hook Form context |
| `/src/components/hook-form/RHFTextField.js`, `RHFSelect.js`, etc. | Custom form inputs using React Hook Form |
| `/src/utils/axios.js` | Axios instance for API calls (used in form submission) |
| `/src/utils/calender.js` | Utility for adding events to calendar |
| `/src/components/snackbar.js` | Handles success/error toast notifications |
| `/src/socket.js` | Socket connection for real-time updates after actions |
| `/src/locales/...` | Translation files for multilingual support (Arabic/English) |

---

## 2. Backend Overview

### Authentication & Authorization

All routes are protected using middleware:
- `protect`: Ensures user is authenticated.
- `restrictTo(admin, employee, patient, superadmin)`: Restricts access to certain roles.
- `mustBeIn(...)`: Validates that the requested appointment/unit belongs to the user's permissions.

---
### Endpoints Overview

| Endpoint | Method | Description |
|---------|--------|-------------|
| `/api/patient/find` | GET | Search registered patients |
| `/api/countries` | GET | Get all countries |
| `/api/uspatients/find` | GET | Find unit service patients |
| `/api/appointments/:id` | GET | Get single appointment details |
| `/api/appointments/unitservice/:id` | GET | Get appointments for a specific unit service |
| `/appointments/:id/newpatient` | PATCH | Create new patient and book an appointment |

---

### 1. `GET /api/patient/find`

#### Purpose
Searches for registered patients based on various criteria.

#### Access
- Authenticated
- Roles: `patient`, `admin`, `employee`

#### Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| `sequence_number` | string | Format: "JO-123" |
| `name_english` | string | English name search (fuzzy) |
| `name_arabic` | string | Arabic name search with variant matching |
| `email` | string | Exact email match |
| `identification_num` | string | ID number match |
| `mobile_num1`, `mobile_num2` | string | Mobile number match (either field) |
| `select` | string | Fields to return |

#### Controller Logic
```js
exports.findPatient = async (req, res, next) => {
  const query = [];

  if (sequence_number) {
    const [countryCode, sequence] = sequence_number.split('-');
    const nationality = await countriesModel.findOne({ code: countryCode }).select('_id');
    query.push({ sequence_number: Number(sequence), nationality: nationality._id });
  }

  if (name_english) {
    let normalizedName = name_english.normalize('NFC');
    const regexPattern = new RegExp(normalizedName.split('').join('.*?'), 'i');
    query.push({ name_english: { $regex: regexPattern } });
  }

  if (name_arabic) {
    const regexPattern = new RegExp(
      name_arabic
        .split('')
        .map(char => (char === 'أ' || char === 'ا' ? '[اأ]' : char))
        .join('.*?'),
      'i'
    );
    query.push({ name_arabic: { $regex: regexPattern } });
  }

  if (identification_num) query.push({ identification_num });

  if (mobile_num1) {
    query.push({ mobile_num1 });
    query.push({ mobile_num2: mobile_num1 });
  }

  if (mobile_num2) {
    query.push({ mobile_num2 });
    query.push({ mobile_num1: mobile_num2 });
  }

  if (email) query.push({ email });

  const patients = await model.find({ $or: query })
    .select(select)
    .populate([
      { path: 'user_info', select: 'name_english name_arabic -_id' },
      { path: 'nationality', select: 'name_english name_arabic code -_id' }
    ])
    .lean();

  res.json(patients);
};
```

### Response Example
```json
[
  {
    "_id": "654321",
    "name_english": "John Doe",
    "name_arabic": "جون دو",
    "mobile_num1": "+962790000000",
    "email": "john@example.com"
  }
]
```

---

### 2. `GET /api/countries`

#### Purpose
Fetch all country information.

#### Access
- Authenticated

#### Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| `select` | string | Fields to return |
| `populate` | string | Related fields to populate |

#### Controller Logic
```js
exports.getAllCountries = async (req, res, next) => {
  const countries = await countriesModel.find()
    .select(req.query.select)
    .populate(req.query.populate)
    .lean()
    .exec();
  res.json(countries);
};
```

#### Response Example
```json
[
  {
    "_id": "JO",
    "name_english": "Jordan",
    "name_arabic": "الأردن"
  }
]
```

---

### 3. `GET /api/uspatients/find`

#### Purpose
Search for unit service patients.

#### Access
- Authenticated
- Roles: `patient`, `admin`, `employee`

#### Query Parameters
Same as `/api/patient/find` + additional:
| Param | Type | Description |
|-------|------|-------------|
| `work_group` | string | Filter by work group |

#### Controller Logic
```js
exports.findPatient = async (req, res, next) => {
  const findQuery = { unit_service: req.user.unit_service._id };
  if (work_group) findQuery.work_group = work_group;
  findQuery.$or = query;

  const patients = await model.find(findQuery)
    .select(select)
    .populate([
      { path: 'user_info', select: 'name_english name_arabic -_id' },
      { path: 'nationality', select: 'name_english name_arabic code -_id' }
    ])
    .lean();

  res.json(patients);
};
```

#### Response Example
```json
[
  {
    "_id": "789012",
    "name_english": "Ahmad Ali",
    "name_arabic": "أحمد علي",
    "mobile_num1": "+962791234567"
  }
]
```

---

### 4. `GET /api/appointments/:id`

#### Purpose
Get a single appointment by ID.

#### Access
- Authenticated
- Roles: `admin`, `employee`, `patient`

#### Query Parameters
| Param | Type | Description |
|-------|------|-------------|
| `select` | string | Fields to return |
| `populate` | string (`all`) | Full data population |

#### Controller Logic
```js
exports.getOneAppointment = async (req, res, next) => {
  const appointment = await model
    .findOne({ _id: id })
    .select(select)
    .populate(populate === 'all' ? fullPopulateArray : populate);
  res.json(appointment);
};
```

#### Response Example
```json
{
  "_id": "654321",
  "start_time": "2025-04-05T08:00:00Z",
  "code": "APT-123",
  "patient": { "name_english": "John Doe", "name_arabic": "جون دو" },
  "unit_service": {
    "name_english": "Cardiology Unit",
    "name_arabic": "وحدة القلب"
  },
  "work_group": { "name_english": "Cardiology Group" }
}
```

---

### 5. `GET /api/appointments/unitservice/:id`

#### Purpose
Get appointments for a specific unit service.

#### Access
- Authenticated
- Roles: `superadmin`, `admin`, `employee`

#### Query Parameters
See in overview table above for full list.

#### Controller Logic
Includes filters by date/time/status/group/work_shift and returns paginated results along with statistics.

#### Response Example
```json
{
  "appointments": [
    {
      "_id": "654321",
      "start_time": "2025-04-05T08:00:00Z",
      "code": "APT-123",
      "patient": { "name_english": "John Doe" },
      "work_group": { "name_english": "Cardiology" },
      "status": "booked"
    }
  ],
  "lengths": {
    "length": 1,
    "all": 100,
    "notBooked": 20,
    "available": 5,
    "finished": 10,
    "processing": 5,
    "booked": 75,
    "canceled": 5,
    "arrived": 2,
    "notArrived": 1,
    "late": 1
  },
  "dates": ["2025-04-05"]
}
```

---

### 6. `PATCH /api/appointments/:id/newpatient`

#### Purpose
Create a new patient and assign them to an existing appointment.

#### Access
- Authenticated
- Roles: `superadmin`, `admin`, `employee`

#### Request Body
```json
{
  "name_english": "Sarah Smith",
  "name_arabic": "سارة سميث",
  "mobile_num1": "+962791234567",
  "email": "sarah@example.com",
  "note": "New patient booking"
}
```

#### Controller Logic
```js
exports.createPatientAndBookAppoint = async (req, res, next) => {
  const newPatient = await unitServicePatientsModel.create(data);
  const appointment = await model.findById(id);

  if (appointment.patient || appointment.unit_service_patient) {
    req.error = { status: 500, message: 'this appointment already booked' };
    return next();
  }

  // Assign patient and save
  appointment.unit_service_patient = newPatient._id;
  appointment.bookWay = 'manually';
  appointment.note = data.note;
  await appointment.save({ validateBeforeSave: false });

  // Send confirmation emails
  SendEmailByForm({
    email: data?.email,
    subject: 'Appointment Booked',
    emailType: 'Informing Email',
    emailTitle: 'New Appointment has been booked',
    href: 'https://hakeemna.com/dashboard/user/appointments'
  });

  req.notification = {
    link: '/dashboard/us/appointments',
    msg: `an appointment <strong> Book </strong>`,
    ar_msg: 'موعد <strong> حجز </strong>'
  };

  next();
};
```

#### Response Example
```json
{
  "message": "Appointment booked successfully!"
}
```


## Database Documentation

### Database Overview

#### 1. Model Overview

| Model | Collection | Description |
|-------|------------|-------------|
| `Patient` | `patients` | General patient records with medical history |
| `UnitServicePatient` | `unit_service_patients` | Unit-specific patient records |
| `Appointment` | `appointments` | Core appointment booking system |
| `WorkGroup` | `work_groups` | Staff grouping within units |
| `UnitService` | `unit_services` | Medical facility (hospital/clinic) details |
| `Country` | `countries` | Country data with time zones |
| `WorkShift` | `work_shifts` | Time slots for staff shifts |
| `EmployeeEngagement` | `employee_engagements` | Employee-unit service relationships |
| `CalendarEvent` | `calender` | Calendar availability tracking |
| `User` | `users` | Authenticated users (roles: patient, employee, admin) |
| `InsuranceCompany` | `insurance_companies` | Insurance provider information |
| `Department` | `departments` | Medical departments within units |
| `AppointmentType` | `appointment_types` | Types of medical appointments |
| `Counter` | `counters` | Auto-increment sequence management |

---

### Full Model Documentation

#### 1. Model: `Patient`

##### File Path
`models/patients/patients.js`

##### Schema Definition
```js
const patientSchema = new mongoose.Schema({
  // Basic Info
  name_english: { type: String },
  name_arabic: { type: String },
  nationality: { type: ObjectId, ref: 'countries' },
  identification_num: { type: String },
  email: { type: String },
  mobile_num1: { type: String, required: true },
  mobile_num2: { type: String },

  // Medical Info
  blood_type: { type: String, enum: ['-O', '-A', '-B', '-AB', '+O', '+A', '+B', '+AB'] },
  birth_date: { type: Date },
  height: { type: Number },
  weight: { type: Number },
  pregnant: { type: Boolean },
  drug_allergies: [{ type: ObjectId, ref: 'medicines' }],

  // Status
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  // Audit
  modifications_nums: { type: Number, default: 0 }
});
```

##### Description
Central patient record containing personal and medical information. Used for general appointments.

##### Security Considerations
- Sensitive fields (`identification_num`, `email`) require encryption at rest
- HIPAA/GDPR-compliant storage required
- Access limited to: `admin`, `employee`, `patient`

##### Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `nationality` | `countries` | Patient's country of origin |
| `user` | `users` | Associated user account |

##### Indexes
| Field | Type | Purpose |
|------|------|---------|
| `email` | Unique | Prevent duplicate accounts |
| `identification_num` | Unique | National ID/passport number |
| `mobile_num1` | Unique | Primary contact verification |

---

#### 2. Model: `UnitServicePatient`

##### File Path
`models/unit_service_patients/unit_service_patients.js`

##### Schema Definition
```js
const unitServicePatientSchema = new mongoose.Schema({
  // Core Info
  name_english: { type: String, required: true },
  name_arabic: { type: String, required: true },
  file_code: { type: String, unique: true, required: true },
  identification_num: { type: String },
  birth_date: { type: Date },
  mobile_num1: { type: String, required: true },

  // Medical Info
  blood_type: { type: String, enum: ['-O', '-A', '-B', '-AB', '+O', '+A', '+B', '+AB'] },
  drug_allergies: [{ type: ObjectId, ref: 'medicines' }],

  // Relationships
  unit_service: { type: ObjectId, ref: 'unit_services', required: true },
  work_group: { type: ObjectId, ref: 'work_groups' },
  patient: { type: ObjectId, ref: 'patients' },

  // Status
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },

  // Audit
  modifications_nums: { type: Number, default: 0 }
});
```

##### Description
Specialized patient records tied to specific unit services with additional operational data.

##### Security Considerations
- Sensitive health data requires encryption
- Access limited to: `admin`, `employee`, `unit_service` members

##### Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `unit_service` | `unit_services` | Service unit affiliation |
| `work_group` | `work_groups` | Assigned staff group |

##### Indexes
| Field | Type | Purpose |
|------|------|---------|
| `file_code` | Unique | Unit-specific patient identifier |

---

#### 3. Model: `Appointment`

##### File Path
`models/shared/appointments.js`

##### Schema Definition
```js
const appointmentSchema = new mongoose.Schema({
  // Core Info
  unit_service: { type: ObjectId, ref: 'unit_services', required: true },
  department: { type: ObjectId, ref: 'departments' },
  work_group: { type: ObjectId, ref: 'work_groups' },
  appointment_type: { type: ObjectId, ref: 'appointment_types' },
  start_time: {
    type: Date,
    validate: { validator: async (value) => await checkOverlap(value) }
  },
  end_time: {
    type: Date,
    default: function () { return new Date(this.start_time.getTime() + 5 * 60000); }
  },

  // Status Flags
  canceled: { type: Boolean, default: false },
  emergency: { type: Boolean, default: false },
  started: { type: Boolean, default: false },
  finished_or_not: { type: Boolean, default: false },
  arrived: { type: Boolean },

  // References
  patient: { type: ObjectId, ref: 'patients' },
  unit_service_patient: { type: ObjectId, ref: 'unit_service_patient' },

  // Audit
  modifications_nums: { type: Number, default: 0 }
});
```

##### Description
Tracks all appointment bookings with dynamic status calculation and overlap prevention.

##### Virtual Fields
```js
virtual('status').get(function () {
  // Dynamic status based on flags and timestamps
  if (this.canceled) return 'canceled';
  if (this.started && !this.finished_or_not) return 'processing';
  if (this.finished_or_not) return 'finished';
  // ...additional status conditions
});
```

##### Security Considerations
- Access controlled by ACL
- IP address logging for audit trails

##### Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `unit_service` | `unit_services` | Facility location |
| `work_group` | `work_groups` | Staff assignment |
| `patient` | `patients` | Patient record |
| `unit_service_patient` | `unit_service_patient` | Unit-specific patient |

##### Indexes
```js
appointments_schema.index(
  { work_group: 1, start_time: 1, emergency: 1, unit_service: 1 },
  { unique: true }
);
```

Prevents double booking unless marked as emergency.

##### Auto-Increment Logic
Uses `Counter` model for:
- `code`: Global appointment counter
- `sequence_number`: Per unit service
- `appoint_number`: Daily count per unit

---

#### 4. Model: `WorkGroup`

##### File Path
`models/companies/unitServices/work_groups.js`

##### Schema Definition
```js
const workGroupSchema = new mongoose.Schema({
  // Core Info
  name_english: { type: String, required: true },
  name_arabic: { type: String, required: true },
  unit_service: {
    type: ObjectId,
    ref: 'unit_services',
    required: true
  },

  // Members
  employees: [{
    type: ObjectId,
    ref: 'employee_work_groups_eng'
  }],

  // Status
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
});
```

##### Description
Groups staff within a unit service for scheduling and permissions.

##### Security Considerations
- Only group members can manage appointments
- Tied to ACL under `subcategory="appointments"`

##### Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `unit_service` | `unit_services` | Parent unit service |
| `employees` | `employee_engagements` | Staff members |

##### Indexes
```js
work_groups_schema.index({ unit_service: 1, name_english: 1 }, { unique: true });
work_groups_schema.index({ unit_service: 1, name_arabic: 1 }, { unique: true });
```

Ensures unique group names within units.

---

#### 5. Model: `UnitService`

##### File Path
`models/companies/unitServices/unit_services.js`

##### Schema Definition
```js
const unitServiceSchema = new mongoose.Schema({
  // Core Info
  name_english: { type: String, unique: true },
  name_arabic: { type: String, unique: true },
  country: { type: ObjectId, ref: 'countries' },
  city: { type: ObjectId, ref: 'cities' },
  phone: { type: String },
  mobile_num: { type: String },
  email: { type: String },

  // Status & Permissions
  status: { type: String, enum: ['active', 'inactive'], default: 'inactive' },
  invoicing_system: { type: Boolean, default: false },

  // Audit
  modifications_nums: { type: Number, default: 0 }
});
```

##### Description
Represents medical facilities with operational details and permissions.

##### Security Considerations
- Access restricted to admins and employees
- Used in ACL via `category="unit_service"`

##### Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `country` | `countries` | Location data |
| `insurance` | `insurance_companies` | Insurance providers |

---

#### 6. Model: `Country`

##### File Path
`models/fixedData/location_info/countries.js`

##### Schema Definition
```js
const countriesSchema = new mongoose.Schema({
  // Core Info
  name_english: String,
  name_arabic: String,
  code: { type: Number },
  time_zone: String,

  // Audit
  modifications_nums: { type: Number, default: 0 }
});
```

##### Description
Country data with timezone information for international operations.

##### Security Considerations
- Public read access for location selection
- Admin-only modification

---

#### 7. Model: `WorkShift`

##### File Path
`models/companies/shifts/work_shifts.js`

##### Schema Definition
```js
const workShiftsSchema = new mongoose.Schema({
  // Core Info
  name_english: { type: String },
  name_arabic: { type: String },
  unit_service: {
    type: ObjectId,
    ref: 'unit_services',
    required: true
  },
  start_time: { type: Date },
  end_time: { type: Date },

  // Audit
  modifications_nums: { type: Number, default: 0 }
});
```

##### Description
Time slots for staff scheduling within units.

##### Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `unit_service` | `unit_services` | Associated facility |

---

#### 8. Model: `EmployeeEngagement`

##### File Path
`models/companies/unitServices/groupengagementmodel.js`

##### Schema Definition
```js
const employeeEngagementSchema = new mongoose.Schema({
  // Core Info
  employee: {
    type: ObjectId,
    ref: 'employees',
    required: true
  },
  unit_service: {
    type: ObjectId,
    ref: 'unit_services',
    required: true
  },
  work_shift: {
    type: ObjectId,
    ref: 'work_shifts'
  },

  // Permissions
  acl: {
    unit_service: {
      departments: [String],
      employees: [String],
      appointments: [String]
    }
  },

  // Audit
  modifications_nums: { type: Number, default: 0 }
});
```

##### Description
Manages employee-unit service relationships and permissions.

##### Security Considerations
- Sensitive ACL rules stored in nested schema
- Requires strict access control

---

#### 9. Model: `CalendarEvent`

##### File Path
`models/calendar/calenderModel.js`

##### Schema Definition
```js
const calenderSchema = new mongoose.Schema({
  // Core Info
  title: { type: String },
  description: { type: String },
  start: { type: Date },
  end: { type: Date },
  allDay: { type: Boolean, default: false },

  // References
  employee_engagement: { type: ObjectId, ref: 'employee_engagement' },
  patient: { type: ObjectId, ref: 'patients' },

  // Audit
  modifications_nums: { type: Number, default: 0 }
});
```

##### Description
Tracks calendar availability for appointments and staff.

##### Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `employee_engagement` | `employee_engagements` | Staff schedule |
| `patient` | `patients` | Patient appointments |

---

#### 10. Model: `User`

##### File Path
`models/users/user.js`

##### Schema Definition
```js
const userSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },

  // Roles
  role: {
    type: String,
    enum: ['patient', 'employee', 'admin', 'superadmin', 'stakeholder'],
    default: 'patient'
  },

  // References
  patient: { type: ObjectId, ref: 'patients' },
  employee: { type: ObjectId, ref: 'employees' },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'inactive'
  },

  // Audit
  last_online: { type: Date }
});
```

##### Description
Authentication system with role-based access control.

##### Security Considerations
- Password hashing with bcrypt
- JWT token management
- Role-based permission enforcement

---

#### 11. Model: `InsuranceCompany`

##### File Path
`models/insurances/insurance_companies.js`

##### Schema Definition
```js
const insuranceCompaniesSchema = new mongoose.Schema({
  // Core Info
  name_english: {
    type: String,
    unique: true
  },
  name_arabic: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    unique: true
  },
  country: {
    type: ObjectId,
    ref: 'countries'
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});
```

##### Description
Insurance provider information for billing purposes.

---

#### 12. Model: `Department`

##### File Path
`models/departments/departments.js`

##### Schema Definition
```js
const departmentsSchema = new mongoose.Schema({
  // Core Info
  name_english: { type: String },
  name_arabic: { type: String },
  unit_service: {
    type: ObjectId,
    ref: 'unit_services',
    required: true
  },

  // Status
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
});
```

##### Description
Medical departments within unit services.

---

#### 13. Model: `Counter`

##### File Path
`models/counter.js`

##### Schema Definition
```js
const counterSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  value: {
    type: Number,
    default: 0
  }
});
```

##### Description
Auto-increment sequence management for all models.

##### Usage
Used to generate:
- Unique codes
- Sequence numbers
- Daily appointment counters

---

### 🔗 Key Relationships

| Source | Target | Type |
|--------|--------|------|
| `Appointment` → `unit_service` | `UnitService` | Facility reference |
| `Appointment` → `work_group` | `WorkGroup` | Staff assignment |
| `Patient` ↔ `User` | `User` | Account linkage |
| `UnitServicePatient` → `Patient` | `Patient` | General patient link |
| `WorkGroup` → `UnitService` | `UnitService` | Unit association |
| `EmployeeEngagement` → `User` | `User` | Staff authentication |
| `CalendarEvent` → `User` | `User` | Schedule owner |

---

### Common Features

#### Auto-Increment System
All models use `Counter` for:
```js
pre('save', async function(next) {
  const counter = await Counter.findOneAndUpdate(
    { name: `${modelName}` },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  this.code = counter.value;
});
```

#### Modification Tracking
All models track changes:
```js
pre('updateOne', async function(next) {
  const current = await this.model.findOne(this.getQuery()._id);
  this.set({ modifications_nums: current.modifications_nums + 1 });
});
```

#### Audit Trail
Fields included in all models:
- `user_creation` - Creator user ID
- `ip_address_user_creation` - Creation IP
- `user_modification` - Last modifier ID
- `ip_address_user_modification` - Modification IP
- `modifications_nums` - Edit count

---
