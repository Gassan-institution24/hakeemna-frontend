# Module Name: Appointment Configuration

## Purpose
- This module enables administrators and employees to create, manage, and configure appointment schedules within the system. It provides comprehensive functionality for setting up appointment time slots, work schedules, holidays, and service configurations — all while ensuring data validation, conflict resolution, and seamless integration with the appointment booking system.
---

## 1. Frontend Overview

### Component Structure
- **Main Component**: `EmployeeAppointconfigPage` (`src/pages/employee/appoint-config/appoint-config.jsx`)
  - The main page component that renders the appointment configuration dashboard protected by role-based access control (ACL)
- **New Configuration Component**: `NewEmployeeAppointconfigPage` (`src/pages/employee/appoint-config/new-appoint-config.jsx`)
  - Component for creating new appointment configurations
- **Detail Component**: `EmployeeAppointconfigPage` (`src/pages/employee/appoint-config/appoint-config-detail.jsx`)
  - Component for viewing and editing existing appointment configurations
- **Child Components**:
  - `EmployeeAppointconfigView` (Main table view for listing configurations)
  - `AppointconfigDetailView` (Detailed form for creating/editing configurations)
  - `CustomBreadcrumbs` (Breadcrumb navigation)
  - `FormProvider`, `RHFTextField`, `RHFSelect`, `RHFRadioGroup` (Form input fields using React Hook Form)
  - `PageSelector` (Tab navigation for different configuration sections)
  - `NewEditDetails` (Basic configuration details form)
  - `NewEditHolidays` (Holiday management form)
  - `NewEditLongHolidays` (Long holiday management form)
  - `NewEditDaysDetails` (Daily schedule configuration form)
  - `LoadingButton` (Submit button with loading spinner)
  - `Iconify` (Icon rendering utility)

### State Management
- **Context Providers**:
  - `useAuthContext()` (Get current logged-in user)
  - `useAclGuard()` (Checks permissions like 'read', 'create', 'update' for appointment_configs)
  - `useUSTypeGuard()` (Optional: Determines unit service type)

- **Hooks**:
  - `useTranslate()`, `useLocales()` (Handles language localization)
  - `useSnackbar()` (Displays success/error toast messages)
  - `useBoolean()` (Manages visibility of modals and loading states)
  - `useGetEmployeeEngagement()` (Fetches employee engagement data)
  - `useGetAppointmentConfig()` (Gets single appointment configuration details)
  - `useGetEmployeeAppointmentConfigs()` (Fetches employee's appointment configurations)
  - `useGetUSAppointmentConfigs()` (Fetches unit service appointment configurations)
  - `useGetDepartmentAppointmentConfigs()` (Fetches department appointment configurations)
  - `useForm({ resolver: yupResolver(NewConfigSchema) })` (Manages and validates form inputs)
  - `useState()` (Manages local state for):
    - `appointTime` (Appointment duration in minutes)
    - `value` (Current active tab: 'details', 'holidays', 'days')
    - `dataToUpdate` (Data pending for update)
    - `errorMsg` (Error messages for validation)
  - `useEffect()` (Handles side effects like form reset and data updates)

#### Key State
- `appointTime`: Stores appointment duration in minutes
- `value`: Current active tab for configuration sections
- `dataToUpdate`: Array of data pending for update
- `errorMsg`: Error messages for form validation
- `saving`: Boolean for save operation loading state
- `updating`: Boolean for update operation loading state
- `confirm`: Boolean for confirmation dialogs

### Workflow
### 1. **Navigate to Appointment Configuration Page**
- User accesses: `/dashboard/appointment/config`
- Component initializes state and fetches data based on user permissions

### 2. **Data Fetching**
- Fetches employee engagement ID from authenticated user
- Loads appointment configurations via `useGetEmployeeAppointmentConfigs(employee_engagement_id)`
- Applies filters and sorting based on user preferences

### 3. **User Interaction Options**

#### Viewing Configurations
- Table view shows all appointment configurations
- Filter by status: active, canceled
- Sort by date, work group, work shift
- Search functionality

#### Creating New Configuration
- Click "New Configuration" button
- Fill in basic details (start date, end date, work group, work shift)
- Configure holidays and long holidays
- Set up daily schedule details
- Save configuration

#### Editing Configuration
- Click on existing configuration to edit
- Modify any configuration parameters
- Update holidays and schedule details
- Save changes

### API Integration
| Endpoint | Method | Description |
|----------|--------|-------------|
| `GET /api/appointments/config` | Get | Get all appointment configurations |
| `GET /api/appointments/config/:id` | Get | Get single appointment configuration |
| `GET /api/appointments/config/employee/:id` | Get | Get employee's appointment configurations |
| `GET /api/appointments/config/unitservice/:id` | Get | Get unit service appointment configurations |
| `GET /api/appointments/config/department/:id` | Get | Get department appointment configurations |
| `POST /api/appointments/config` | Post | Create new appointment configuration |
| `PATCH /api/appointments/config/:id` | Patch | Update appointment configuration |
| `DELETE /api/appointments/config/:id` | Delete | Delete appointment configuration |
| `PATCH /api/appointments/config/cancel` | Patch | Cancel multiple configurations |
| `PATCH /api/appointments/config/uncancel` | Patch | Uncancel multiple configurations |
| `PATCH /api/appointments/config/:id/cancel` | Patch | Cancel single configuration |
| `PATCH /api/appointments/config/:id/uncancel` | Patch | Uncancel single configuration |
| `PATCH /api/appointments/config/updatestatus` | Patch | Update status of multiple configurations |

All API calls use `axiosInstance` with appropriate endpoints from `src/utils/axios`.

---

## 2. Backend Overview

### Model Structure
**File**: `hakeemna-backend/models/shared/appointment_config.js`

#### Schema Fields
```javascript
{
  code: Number,                    // Auto-incremented configuration code
  sequence_number: Number,         // Sequence number for ordering
  start_date: Date,               // Configuration start date
  end_date: Date,                 // Configuration end date
  unit_service: ObjectId,         // Reference to unit_services
  department: ObjectId,           // Reference to departments
  work_shift: ObjectId,          // Reference to work_shifts
  work_group: ObjectId,          // Reference to work_groups
  ImmediateEdit: Boolean,         // Flag for immediate editing
  weekend: [String],             // Array of weekend days
  appointment_time: Number,       // Appointment duration in minutes
  config_frequency: Number,       // Configuration frequency
  canceled: Boolean,             // Cancellation status
  holidays: [{                   // Regular holidays
    description: String,
    date: Date
  }],
  long_holidays: [{              // Extended holidays
    description: String,
    start_date: Date,
    end_date: Date
  }],
  days_details: [{               // Daily schedule configuration
    day: String,
    work_start_time: Date,
    work_end_time: Date,
    break_start_time: Date,
    break_end_time: Date,
    service_types: [ObjectId],   // Reference to service_types
    appointment_type: ObjectId,  // Reference to appointment_types
    appointments: [{             // Individual appointment slots
      appointment_type: ObjectId,
      start_time: Date,
      online_available: Boolean,
      end_time: Date,
      price: Number,
      service_types: [ObjectId]
    }]
  }],
  last_date_created: Date,       // Last date when appointments were created
  user_creation: ObjectId,       // Reference to User (creator)
  ip_address_user_creation: String,
  user_modification: ObjectId,   // Reference to User (modifier)
  modifications_nums: Number,    // Number of modifications
  ip_address_user_modification: String
}
```

#### Validation Rules
- Start date and end date must both be provided (cannot have just one)
- No overlapping date ranges for same work group and work shift
- Auto-incremented code starting from 1
- Conflict detection for existing configurations

### Controller Functions
**File**: `hakeemna-backend/controller/shared/appointment_config_controller.js`

#### Main Functions
1. **getAllConfigs()** - Retrieve all appointment configurations with populated references
2. **getOneConfig()** - Get single configuration by ID
3. **getUSConfigs()** - Get configurations for specific unit service
4. **getEmployeeConfigs()** - Get configurations for specific employee
5. **getDepartmentConfigs()** - Get configurations for specific department
6. **createConfig()** - Create new appointment configuration
7. **updateOneConfig()** - Update existing configuration
8. **deleteOneConfig()** - Delete configuration
9. **cancelOneConfig()** - Cancel single configuration
10. **uncancelOneConfig()** - Uncancel single configuration
11. **updateConfigStatus()** - Update configuration status
12. **schedualCreateAppointments()** - Automatically create appointments based on configuration

#### Key Business Logic
- **Conflict Detection**: Prevents overlapping date ranges for same work group/shift
- **Auto Appointment Creation**: Generates appointment slots based on configuration
- **Holiday Management**: Handles regular and extended holidays
- **Schedule Validation**: Ensures proper time slot configuration
- **Permission Control**: Role-based access control for all operations

### Routes
**File**: `hakeemna-backend/routes/shared/appointment_config.js`

#### Route Structure
```javascript
// GET routes
GET /api/appointments/config                    // Get all configurations
GET /api/appointments/config/:id               // Get single configuration
GET /api/appointments/config/unitservice/:id   // Get unit service configurations
GET /api/appointments/config/employee/:id      // Get employee configurations
GET /api/appointments/config/department/:id    // Get department configurations

// POST routes
POST /api/appointments/config                  // Create new configuration

// PATCH routes
PATCH /api/appointments/config/:id             // Update configuration
PATCH /api/appointments/config/cancel          // Cancel multiple configurations
PATCH /api/appointments/config/uncancel        // Uncancel multiple configurations
PATCH /api/appointments/config/:id/cancel      // Cancel single configuration
PATCH /api/appointments/config/:id/uncancel    // Uncancel single configuration
PATCH /api/appointments/config/updatestatus    // Update status of multiple configurations

// DELETE routes
DELETE /api/appointments/config/:id            // Delete configuration
DELETE /api/appointments/config                // Delete all configurations (admin only)
```

#### Middleware
- `protect` - Authentication middleware
- `ADDL` - Additional authentication layer
- `restrictTo` - Role-based access control
- `mustBeIn` - Permission validation
- `ErrorHandler` - Error handling middleware
- `Notifications` - Notification middleware

---

## 3. Key Features

### 3.1 Configuration Management
- **Date Range Configuration**: Set start and end dates for appointment availability
- **Work Schedule Setup**: Configure work shifts and work groups
- **Time Slot Management**: Define appointment duration and frequency
- **Weekend Configuration**: Specify which days are considered weekends
- **Immediate Edit Mode**: Enable/disable immediate editing capabilities

### 3.2 Holiday Management
- **Regular Holidays**: Add single-day holidays with descriptions
- **Extended Holidays**: Configure multi-day holidays with start and end dates
- **Holiday Validation**: Ensure holidays don't conflict with existing schedules

### 3.3 Daily Schedule Configuration
- **Work Hours**: Set daily work start and end times
- **Break Times**: Configure break periods during work hours
- **Service Types**: Associate specific service types with each day
- **Appointment Types**: Define appointment types for each day
- **Individual Slots**: Configure specific appointment slots with pricing

### 3.4 Conflict Resolution
- **Date Range Validation**: Prevent overlapping configuration periods
- **Time Slot Validation**: Ensure no conflicting appointment times
- **Work Group Conflicts**: Validate work group and shift combinations
- **Holiday Conflicts**: Check for holiday overlaps

### 3.5 Automatic Appointment Generation
- **Scheduled Creation**: Automatically generate appointment slots based on configuration
- **Frequency Control**: Set how often appointments should be created
- **Last Creation Tracking**: Monitor when appointments were last generated
- **Batch Processing**: Handle large numbers of appointment creation efficiently

---

## 4. User Roles and Permissions

### 4.1 Role-Based Access
- **Superadmin**: Full access to all configurations across all units
- **Admin**: Access to configurations within their assigned units
- **Employee**: Access to configurations within their work groups

### 4.2 Permission Levels
- **Read**: View appointment configurations
- **Create**: Create new appointment configurations
- **Update**: Modify existing configurations
- **Delete**: Remove configurations

### 4.3 Scope Control
- **Unit Service Level**: Configurations specific to unit services
- **Department Level**: Configurations specific to departments
- **Employee Level**: Configurations specific to employees
- **Work Group Level**: Configurations specific to work groups

---

## 5. Data Flow

### 5.1 Configuration Creation Flow
1. **User Input**: Employee fills configuration form
2. **Validation**: Frontend validates form data
3. **API Request**: POST request to `/api/appointments/config`
4. **Backend Validation**: Server validates business rules
5. **Database Storage**: Configuration saved to database
6. **Response**: Success/error response sent to frontend
7. **UI Update**: Frontend updates with new configuration

### 5.2 Appointment Generation Flow
1. **Scheduled Job**: Automated job runs periodically
2. **Configuration Check**: System checks for configurations needing appointment generation
3. **Slot Calculation**: Calculate available time slots based on configuration
4. **Appointment Creation**: Generate individual appointment records
5. **Conflict Check**: Ensure no overlapping appointments
6. **Database Update**: Save new appointments to database
7. **Notification**: Send notifications if configured

### 5.3 Update Flow
1. **User Selection**: User selects configuration to edit
2. **Data Loading**: Load existing configuration data
3. **Form Population**: Populate form with current values
4. **User Modifications**: User makes changes to configuration
5. **Validation**: Validate changes against business rules
6. **API Update**: PATCH request to update configuration
7. **Database Update**: Update configuration in database
8. **UI Refresh**: Refresh UI with updated data

---

## 6. Error Handling

### 6.1 Validation Errors
- **Date Range Conflicts**: Overlapping configuration periods
- **Time Slot Conflicts**: Conflicting appointment times
- **Required Fields**: Missing required configuration data
- **Invalid References**: Invalid work group, shift, or service references

### 6.2 Business Logic Errors
- **Permission Denied**: User lacks required permissions
- **Configuration Not Found**: Requested configuration doesn't exist
- **Update Conflicts**: Concurrent modification conflicts
- **Generation Errors**: Errors during appointment generation

### 6.3 Frontend Error Handling
- **Form Validation**: Real-time validation feedback
- **API Error Display**: User-friendly error messages
- **Loading States**: Visual feedback during operations
- **Retry Mechanisms**: Automatic retry for failed operations

---

## 7. Security Considerations

### 7.1 Authentication
- All endpoints require valid authentication tokens
- Session management for user authentication
- Token expiration and refresh mechanisms

### 7.2 Authorization
- Role-based access control (RBAC)
- Permission-based feature access
- Scope-based data access (unit service, department, employee level)

### 7.3 Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection through proper encoding
- CSRF protection for state-changing operations

### 7.4 Audit Trail
- User creation and modification tracking
- IP address logging for security monitoring
- Modification count tracking
- Timestamp tracking for all operations

---

## 8. Performance Considerations

### 8.1 Database Optimization
- Indexed queries for date ranges and work groups
- Efficient population of referenced data
- Pagination for large datasets
- Query optimization for complex filters

### 8.2 Caching Strategy
- Frontend caching of configuration data
- API response caching where appropriate
- Real-time data updates through WebSocket connections

### 8.3 Batch Operations
- Efficient handling of bulk operations
- Background processing for appointment generation
- Optimized conflict detection algorithms

---

## 9. Integration Points

### 9.1 Appointment Booking System
- Configuration data feeds into appointment booking
- Real-time availability updates
- Conflict prevention during booking

### 9.2 Calendar System
- Configuration data populates calendar views
- Holiday and break time integration
- Schedule visualization

### 9.3 Notification System
- Configuration change notifications
- Appointment generation notifications
- Error and conflict notifications

### 9.4 Reporting System
- Configuration analytics and reporting
- Usage statistics and trends
- Performance metrics

---

## 10. Future Enhancements

### 10.1 Planned Features
- Advanced scheduling algorithms
- Machine learning for optimal time slot allocation
- Integration with external calendar systems
- Mobile app support for configuration management

### 10.2 Scalability Improvements
- Microservice architecture for configuration management
- Distributed caching for better performance
- Real-time collaboration features
- Advanced conflict resolution algorithms

---

## 11. Troubleshooting

### 11.1 Common Issues
- **Configuration Conflicts**: Check for overlapping date ranges
- **Permission Errors**: Verify user roles and permissions
- **Data Validation Errors**: Ensure all required fields are provided
- **Performance Issues**: Check database indexes and query optimization

### 11.2 Debug Information
- Enable detailed logging for configuration operations
- Monitor database query performance
- Track API response times
- Monitor error rates and types

### 11.3 Support Resources
- System documentation and user guides
- Technical support for complex issues
- Community forums for user discussions
- Regular system maintenance and updates 