import { useAuthContext } from 'src/auth/hooks';
import { useGetUSEmployees, useGetPatientOneAppointments } from 'src/api';

import WatingRoomDialog from './watingRoomDialog';
// ----------------------------------------------------------------------

export default function WatingRoom() {


  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientOneAppointments(user?.patient?._id);
  const { employeesData } = useGetUSEmployees(appointmentsData?.unit_service?._id);

 
  return  (
    employeesData?.map((info,index)=>(
         <WatingRoomDialog employeesData={info} key={index}/>
    ))
 
  );
 
}
