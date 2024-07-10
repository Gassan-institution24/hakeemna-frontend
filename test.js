const { default: axios } = require("axios")
const { tr } = require("date-fns/locale")


const linkesEvery13sec = ['http://localhost:3000/api/wgroups/employee/engagement/undefined',
    'http://localhost:3000/api/chat/undefined',
    'http://localhost:3000/api/tickets/categories',
    'http://localhost:3000/api/msg/unread/user/65b4df08d7485916d0098e4f',
    'http://localhost:3000/api/notifications/my?id=65b4df08d7485916d0098e4f&page=1',
    'http://localhost:3000/api/tickets?user_creation=65b4df08d7485916d0098e4f&status=%7B+$in:+[%27pending%27,+%27processing%27,+%27waiting%27]+%7D',
    'http://localhost:3000/api/departments/unitservice/undefined',
    'http://localhost:3000/api/rooms/unitservice/undefined',
    'http://localhost:3000/api/wgroups/unitservice/undefined',
    'http://localhost:3000/api/wshifts/unitservice/undefined',
    'http://localhost:3000/api/activities/unitservice/undefined',
    'http://localhost:3000/uplaed-files/doctor.jpg',
    'http://localhost:3000/api/wgroups/employee/engagement/65b4df08d7485916d0098e58',
    'http://localhost:3000/api/notifications/my?id=65b4df08d7485916d0098e4f&emid=65b4df08d7485916d0098e58&page=1',
    'http://localhost:3000/api/rooms/unitservice/65b4df08d7485916d0098e55',
    'http://localhost:3000/api/departments/unitservice/65b4df08d7485916d0098e55',
    'http://localhost:3000/api/wshifts/unitservice/65b4df08d7485916d0098e55',
    'http://localhost:3000/api/wgroups/unitservice/65b4df08d7485916d0098e55',
    'http://localhost:3000/api/activities/unitservice/65b4df08d7485916d0098e55',
    'http://localhost:3000/api/calender/employee/65b4df08d7485916d0098e58',
    'http://localhost:3000/api/appointments/types',
    'http://localhost:3000/api/wgroups/employee/engagement/65b4df08d7485916d0098e58',
    'http://localhost:3000/api/appointments/employee/65b4df08d7485916d0098e58?page=0&&sortBy=start_time&&rowsPerPage=25&&order=asc&&status=pending&&appointype=&&startDate=null&&endDate=null&&group=&&shift=&&startTime=null&&endTime=null',
    'http://localhost:3000/api/servicetypes/unitservice/65b4df08d7485916d0098e55/active',
    'http://localhost:3000/api/wshifts/unitservice/65b4df08d7485916d0098e55/active',
    'http://localhost:3000/api/wgroups/employee/65b4df08d7485916d0098e58/active',
    'http://localhost:3000/api/appointments/employee/65b4df08d7485916d0098e58?page=0&&sortBy=start_time&&rowsPerPage=25&&order=asc&&status=available&&appointype=&&startDate=null&&endDate=null&&group=&&shift=&&startTime=null&&endTime=null',
    'http://localhost:3000/api/cities/country/null',
    'http://localhost:3000/api/countries',
    'http://localhost:3000/api/patient/find?name_english=&name_arabic=&email=&identification_num=&mobile_num1=&mobile_num2=',
    'http://localhost:3000/api/wgroups/employee/engagement/65b4df08d7485916d0098e58',
    'http://localhost:3000/api/wgroups/employee/65b4df08d7485916d0098e58/active',
    'http://localhost:3000/api/appointments/employee/65b4df08d7485916d0098e58?page=0&&sortBy=code&&rowsPerPage=100&&order=asc&&status=available&&appointype=undefined&&startDate=Wed%20Jul%2010%202024%2016:34:52%20GMT+0300%20(GMT+03:00)&&endDate=undefined&&group=undefined&&shift=undefined&&startTime=null&&endTime=null',
    'http://localhost:3000/api/appointments/types',
    'http://localhost:3000/api/appointments/config/employee/65b4df08d7485916d0098e58',
    'http://localhost:3000/api/patient/employee/65b4df08d7485916d0098e58',
    'http://localhost:3000/api/chat/undefined',
    'http://localhost:3000/api/checklist/employee/65b4df08d7485916d0098e58',
    'http://localhost:3000/api/wgroups/employee/65b4df08d7485916d0098e58']

setInterval(() => {
    linkesEvery13sec.map(async (one) => {
        try {
            await axios.get(one)
        } catch (e) {
            console.log(e)
        }
    })
}, 100000)