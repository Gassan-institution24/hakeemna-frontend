# Module Name: My Appointments

## Purpose
- This module enables users to view, filter, and manage their appointments. It provides a real-time table where users can see appointment statuses, apply custom filters, and book urgent/emergency slots when necessary.
---

## 1. Frontend Overview

### Component Structure
- **Security Component**: `AppointmentsHomePage` (`src/pages/unit-service/appointments/home.jsx`)
  - The `AppointmentsHomePage` component renders the appointments dashboard protected by role-based access control (ACL), with dynamic page titles based on the user's current service unit.
- **Parent Component**: `AppointmentsView` (`src/sections/unit-service/appointments/view/home.jsx`)
- **Child Components**:
  - `PatientHistoryToolbar` (Toolbar for filtering and search inputs)
  - `HistoryFiltersResult` (Shows applied filters and allows reset)
  - `AppointmentsRow` (Renders individual appointment rows)
  - `AddEmegencyAppointment` (Modal to add emergency/urgent appointments)
  - `ConfirmDialog` (Confirmation modals for canceling, un-canceling, and delaying appointments)
  - `CustomBreadcrumbs` (Breadcrumb navigation)
  - `TableSelectedAction` (Bulk action toolbar when rows are selected)
  - `TableHeadCustom`, `TablePaginationCustom`, `TableNoData`, `Scrollbar`, `LoadingScreen` (UI/table utilities from shared components)

### State Management
- **Context Provider**:
  - `useAuthContext()` (Get current logged-in user)
  - `useAclGuard()` (Checks user access permissions [e.g., create, read, update])
  - `useUSTypeGuard()` (Determines if current unit is a "MedLab" or not [affects view behavior])
- **Custom Hook**:
  - `useTable()` (Manages table state: pagination, sorting, selection)
  - `useSnackbar()` (Displays success/error messages)
  - `useBoolean()` (Controls modal/dialog visibility [addModal ,confirm, etc.])
  - `useGetUSAppointments()` (Fetches paginated appointment list)
  - `useGetAppointmentTypes()` (Fetches appointment type options for filters)

#### Key State
```javascript
const [filters, setFilters] = useState(defaultFilters);
const [minToDelay, setMinToDelay] = useState(0);
```
- `filters`: Holds active filters like name, status, date range, etc.
- `minToDelay`: Stores delay duration for bulk delay action

### Workflow
1. User navigates to `My Appointments` (`/appointments/list`).
2. Component fetches appointments using:
   - Current user’s unit ID
   - Table settings (page, limit, sort)
   - Applied filters
3. Users can:
   - Filter by status tab (booked, finished, canceled, etc.)
   - Search/filter via toolbar
   - Select multiple rows and apply bulk actions:
     - Cancel
     - Delay (with custom time input)
     - Un-cancel
4. On any action:
   - API call is made
   - Snackbar confirms result
   - Socket.io emits update event
   - Data is re-fetched to reflect changes
5. Emergency Appointment button opens modal to add urgent slots

### API Integration
| Endpoint | Method | Description |
|----------|--------|-------------|
| `Get /api/appointments` | Get | Fetches paginted appointments |
| `Patch /api/appointments/:id/cancel` | Patch | Cancels one appointemtns |
| `Patch /api/appointments/:id/uncancel` | Patch | Reverts cancellation |
| `Patch /api/appointments/:id/delay` | Patch | Delay appointement by X minutes |
| `Patch /api/appointments/cancel` | Patch | Multi cancel |
| `Patch /api/appointments/uncancel` | Patch | Multi uncancel |
| `Patch /api/appointments/delay` | Patch | Multi Delay |

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

- **Role-based Access Control (RBAC)**:
  - Uses `<ACLGuard>` internally via `checkAcl()` hook
  - Example usage: `checkAcl({ category: 'unit_service', subcategory: 'appointments', acl: 'create' })`
- **Authentication**:
  - JWT-based login
  - Protected routes and actions
- **Authorization**:
  - Only users with appropriate ACL can perform actions like create, cancel, delay
- **Socket Events**:
  - Emits updates for audit trail purposes (e.g., who canceled an appointment)


### Related Files
| File | Role |
|------|------|
| `/src/api/index.js` | Contains hooks like `useGetUSAppointments` |
| `/src/hooks/useAclGuard.js` | Handles permission checks |
| `/src/auth/guard/acl-guard.js` | Route guard implementation |
| `/src/sections/unit-service/appointments/view/home.js` | Main parent component |
| `/src/sections/unit-service/appointments/appointment-row.js` | Individual row rendering |
| `/src/sections/unit-service/appointments/appointment-toolbar.js` | Toolbar with filter controls |
| `/src/sections/unit-service/appointments/appointment-filters-result.js` | Displays active filters |
| `/src/sections/unit-service/appointments/add-emergency-appointment.js` | Modal for adding emergency appointments |
| `/src/routes/paths.js` | Defines route paths (used for navigation) |
| `/src/socket.js` | Socket connection for real-time notifications |


---

## 2. Backend Overview

### Authentication & Authorization

All routes are protected using middleware:
- `protect`: Ensures user is authenticated.
- `restrictTo('admin', 'employee')`: Restricts access to certain roles.
- `mustBeIn(...)`: Validates that the requested appointment/unit belongs to the user's permissions.

---

### Endpoints Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/appointments/unitservice/:id` | Get paginated list of appointments for a unit service |
| `PATCH` | `/api/appointments/:id/cancel` | Cancel a single appointment |
| `PATCH` | `/api/appointments/cancel` | Cancel multiple appointments |
| `PATCH` | `/api/appointments/:id/uncancel` | Revert cancellation of a single appointment |
| `PATCH` | `/api/appointments/uncancel` | Revert cancellation of multiple appointments |
| `PATCH` | `/api/appointments/:id/delay` | Delay a single appointment by X minutes |
| `PATCH` | `/api/appointments/delay` | Delay multiple appointments by X minutes |

---

### 1. `GET /api/appointments/unitservice/:id`

#### Purpose
Fetches paginated and filtered appointments for a specific unit service.

#### Access
- Authenticated
- Roles: `superadmin`, `admin`, `employee`

####  Query Parameters
| Param | Type | Description |
|------|------|-------------|
| `page` | number | Page index (default: 0) |
| `sortBy` | string | Field to sort by (e.g., `start_time`) |
| `rowsPerPage` | number | Number of items per page |
| `order` | string (`asc`, `desc`) | Sort order |
| `status` | string | Filter by status |
| `appointype` | string | Filter by appointment type |
| `startDate`, `endDate` | date (YYYY-MM-DD) | Date range filter |
| `startTime`, `endTime` | time (HH:mm) | Time range filter |
| `group` | string | Filter by work group |
| `shift` | string | Filter by shift |

#### Response
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
    "all": 100,
    "available": 20,
    "canceled": 5,
    "booked": 75
  }
}
```

---

### 2. `PATCH /api/appointments/:id/cancel`

#### Purpose
Cancel a single appointment.

#### Access
- Authenticated
- Roles: `admin`, `employee`, `patient`

#### Request
- URL: `/api/appointments/654321/cancel`
- Body: empty

#### Response
```json
{
  "message": "canceled successfully!"
}
```

#### Actions
- Marks appointment as canceled
- Emits socket event for real-time update
- Sends notification/email to patient

---

### 3. `PATCH /api/appointments/cancel`

#### Purpose
Bulk cancel multiple appointments.

#### Access
- Authenticated
- Roles: `admin`, `employee`

#### Request
- Body:
```json
{
  "ids": ["654321", "789012"]
}
```

#### Response
```json
{
  "message": "canceled successfully!"
}
```

---

### 4. `PATCH /api/appointments/:id/uncancel`

#### Purpose
Reverts cancellation of one appointment.

#### Access
- Authenticated
- Roles: `admin`, `employee`

#### Request
- URL: `/api/appointments/654321/uncancel`
- Body: empty

#### Response
```json
{
  "message": "uncanceled successfully!"
}
```

---

### 5. `PATCH /api/appointments/uncancel`

#### Purpose
Bulk un-cancel multiple appointments.

#### Access
- Authenticated
- Roles: `admin`, `employee`

#### Request
- Body:
```json
{
  "ids": ["654321", "789012"]
}
```

#### Response
```json
{
  "message": "uncanceled successfully!"
}
```

---

### 6. `PATCH /api/appointments/:id/delay`

#### Purpose
Delay a single appointment by a given number of minutes.

#### Access
- Authenticated
- Roles: `admin`, `employee`

#### Request
- URL: `/api/appointments/654321/delay`
- Body:
```json
{
  "minutes": 30
}
```

#### Response
```json
{
  "message": "delayed successfully!"
}
```

---

### 7. `PATCH /api/appointments/delay`

#### Purpose
Bulk delay multiple appointments by the same amount of time.

#### Access
- Authenticated
- Roles: `admin`, `employee`

#### Request
- Body:
```json
{
  "minutes": 30,
  "ids": ["654321", "789012"]
}
```

#### Response
```json
{
  "message": "delayed successfully!"
}
```


##  Database Overview

### 1.  Model Overview

| Model | Collection | Description |
|-------|------------|-------------|
| `UnitService` | `unit_services` | Represents a unitservice wether it is a hospital, clinic, etc |
| `WorkGroup` | `work_groups` | Grouping of staff and time slots within a unit |
| `Patient` | `patients` | Patient records |
| `Appointment` | `appointments` | Appointment bookings between patients and services |

---

### 2.  Model: `UnitService`

####  File Path
`../../models/companies/unitServices/unit_services.js`

####  Schema Definition
```js
const unitServiceSchema = new mongoose.Schema({
  name_english: { type: String, required: true },
  name_arabic: { type: String, required: true },
  description: { type: String },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'countries',
    required: true
  },
  company_logo: { type: String },
  rate: { type: Number },
  insurance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'insurances'
  }
});
```

####  Description
Represents a medical service unit like Cardiology, Radiology, etc.

####  Security Considerations
- Access restricted to admins and employees with proper permissions.
- Used in ACL via `category="unit_service"`.

####  Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `country` | `countries` | Country where the unit is located |
| `insurance` | `insurances` | Optional insurance associated with the unit |

####  Indexes
None explicitly defined.

---

### 3.  Model: `WorkGroup`

####  File Path
`../../models/companies/unitServices/work_groups.js`

####  Schema Definition
```js
const workGroupSchema = new mongoose.Schema({
  name_english: { type: String, required: true },
  name_arabic: { type: String, required: true },
  description: { type: String },
  unit_service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'unit_services',
    required: true
  },
  employees: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'employees'
    }
  ]
});
```

####  Description
A group of employees working together within a specific unit (e.g., morning shift, team A).

####  Security Considerations
- Only users assigned to this group can manage its appointments.
- Tied to ACL under `subcategory="appointments"`.

####  Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `unit_service` | `unit_services` | The unit to which this group belongs |
| `employees` | `employees` | List of employees in the group |

####  Indexes
None explicitly defined.

---

### 4.  Model: `Patient`

####  File Path
`../../models/patients/patients.js`

####  Schema Definition
```js
const patientSchema = new mongoose.Schema({
  name_english: { type: String, required: true },
  name_arabic: { type: String, required: true },
  email: { type: String, unique: true },
  mobile_num1: { type: String, required: true },
  identification_num: { type: String, unique: true },
  nationality: { type: String },
  expo_token: { type: String } // For push notifications
});
```

####  Description
Stores personal information about a patient.

####  Security Considerations
- Sensitive data like `identification_num` must be encrypted at rest.
- HIPAA/GDPR-compliant storage required.
- Access limited to authorized roles only (`admin`, `employee`, `patient`).

####  Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| (none) | N/A | Standalone model referenced by `appointments` |

####  Indexes
| Field | Type | Purpose |
|------|------|---------|
| `email` | Unique | Prevent duplicate accounts |
| `identification_num` | Unique | National ID or passport number |

---

### 5.  Model: `Appointment`

####  File Path
`../../models/shared/appointments.js`

####  Schema Definition (Simplified)
```js
const appointmentSchema = new mongoose.Schema({
  code: { type: Number }, // Auto-incremented
  sequence_number: { type: Number },
  appoint_number: { type: Number },
  unit_service: { type: mongoose.Schema.Types.ObjectId, ref: 'unit_services', required: true },
  department: { type: mongoose.Schema.Types.ObjectId, ref: 'departments' },
  work_group: { type: mongoose.Schema.Types.ObjectId, ref: 'work_groups' },
  work_shift: { type: mongoose.Schema.Types.ObjectId, ref: 'work_shifts' },
  appointment_type: { type: mongoose.Schema.Types.ObjectId, ref: 'appointment_types' },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'patients' },
  start_time: { type: Date, validate: { validator: checkOverlap } },
  end_time: { type: Date, default: function () { return new Date(this.start_time.getTime() + 5 * 60000); } },
  canceled: { type: Boolean, default: false },
  emergency: { type: Boolean, default: false },
  started: { type: Boolean, default: false },
  finished_or_not: { type: Boolean, default: false },
  hasFeedback: { type: Boolean, default: false },
  coming: { type: Boolean },
  arrived: { type: Boolean },
  bookWay: { type: String, enum: ['online', 'manually'] },
  user_creation: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  user_modification: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  modifications_nums: { type: Number, default: 0 },
  ip_address_user_creation: { type: String },
  ip_address_user_modification: { type: String }
});
```

####  Description
Tracks all patient appointments including status, time, participants, and history.

####  Virtual Fields
- `status`: Dynamically computed from flags like `canceled`, `arrived`, `started`, and current date.

####  Security Considerations
- Must be accessed with appropriate ACL permissions.
- Sensitive fields like `ip_address` should be logged securely.
- Audit trail via `modifications_nums`.

####  Relations
| Field | Refers To | Description |
|------|-----------|-------------|
| `unit_service` | `unit_services` | Required — the unit where the appointment takes place |
| `work_group` | `work_groups` | Assigned staff group |
| `patient` | `patients` | The patient attending the appointment |
| `user_creation` / `user_modification` | `User` | Who created/modified the record |

####  Indexes
```js
appointments_schema.index(
  { work_group: 1, start_time: 1, emergency: 1, unit_service: 1 },
  { unique: true }
);
```

Prevents double booking unless it’s an emergency.

####  Auto-Increment Logic
Uses a `Counter` model to auto-generate:
- `code`: Global appointment counter
- `sequence_number`: Per unit service
- `appoint_number`: Daily count per unit

####  Lifecycle Flags
| Flag | Meaning |
|------|---------|
| `canceled` | Cancellation status |
| `emergency` | Indicates urgent care |
| `started` | Appointment is ongoing |
| `finished_or_not` | Completion status |
| `hasFeedback` | Whether feedback was submitted |
| `coming` / `arrived` | Attendance tracking |
| `bookWay` | Online or manual booking |
| `modification_nums` | Tracks how many times the appointment was edited |

---

