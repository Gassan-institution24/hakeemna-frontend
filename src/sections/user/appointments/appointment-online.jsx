import { useState } from 'react';
import PropTypes from 'prop-types';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetUSFeedbackes, useGetUSAvailableAppointments } from 'src/api';


const AppointmentOnline = ({ Units, onBook, onView }) => {
  const { t } = useTranslate();
  const { appointmentsData, refetch } = useGetUSAvailableAppointments(Units._id);
  const { feedbackData } = useGetUSFeedbackes(Units._id);
  const { user } = useAuthContext();
  const uniqueUserIds = new Set(feedbackData.map((feedback) => feedback?.patient._id));
  const numberOfUsers = uniqueUserIds.size;

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const kdk = (id) => {
    onBook(id);
    refetch();
  };

  const [showAllFeedback, setShowAllFeedback] = useState(false);

  const toggleFeedbackDisplay = () => {
    setShowAllFeedback(!showAllFeedback);
  };
  const displayedFeedback = showAllFeedback ? feedbackData : [feedbackData[0]];
  const groupedAppointments = appointmentsData.reduce(
    (acc, appointment) => {
      const appointmentDate = appointment.start_time.split('T')[0];

      if (appointmentDate === getTodayDate()) {
        acc.today.push(appointment);
      } else {
        if (!acc[appointmentDate]) {
          acc[appointmentDate] = [];
        }
        acc[appointmentDate].push(appointment);
      }

      return acc;
    },
    { today: [] }
  );
  // return (
  //   <Box sx={{ display: 'flex', border: '1px solid rgba(208, 208, 208, 0.344)', mb: 5 }}>
  //     <Box sx={{ width: '55%', margin: 2 }}>
  //       <Box sx={{ display: 'flex' }}>
  //         <Image
  //           src={Units.company_logo}
  //           sx={{ width: '110px', height: '110px', borderRadius: '100%' }}
  //         />
  //         <Box sx={{ mt: 1, ml: 2 }}>
  //           <Typography sx={{ fontSize: 13 }}>{Units?.name_english}</Typography>
  //           <Typography sx={{ fontSize: 13, color: 'grey' }}>
  //             {Units?.speciality?.name_english}
  //           </Typography>
  //           <Box sx={{ display: 'flex', mt: 0.7, ml: -0.3 }}>
  //             <Iconify icon="emojione:star" />
  //             &nbsp;
  //             <Typography sx={{ fontSize: 13, mt: 0.3 }}>{Units?.rate}</Typography>&nbsp;
  //             <Typography sx={{ fontSize: 13, mt: 0.3 }}>
  //               {t('From ')} {numberOfUsers <= 1 ? '' : numberOfUsers}{' '}
  //               {numberOfUsers > 1 ? t('Visitors') : t('One Visitor')}{' '}
  //             </Typography>
  //           </Box>
  //           <Box sx={{ position: 'relative', left: '-10.1%' }}>
  //             <ul style={{ listStyle: 'none' }}>
  //               <li>
  //                 <Iconify width={18} sx={{ color: 'info.main' }} icon="mdi:location" />{' '}
  //                 {Units?.country?.name_english} {Units?.city?.name_english}
  //               </li>
  //               <li>
  //                 <Iconify width={18} sx={{ color: 'warning.main' }} icon="mingcute:time-line" />{' '}
  //                 Open 24h
  //               </li>
  //               <li>
  //                 <Iconify width={18} sx={{ color: 'success.main' }} icon="mdi:cash-multiple" />{' '}
  //                 {t('Fees: ')} 30 JOD{' '}
  //               </li>
  //             </ul>
  //           </Box>
  //           {displayedFeedback.map((feedback, index) => (
  //             <React.Fragment key={index}>
  //               <Iconify
  //                 sx={{
  //                   transform: 'rotate(-20deg)',
  //                   color: 'success.main',
  //                   zIndex: 1,
  //                   position: 'relative',
  //                   top: 12,
  //                   left: -5,
  //                   width: 25,
  //                   height: 25,
  //                 }}
  //                 icon="material-symbols-light:rate-review-outline"
  //               />
  //               <Box sx={{ bgcolor: 'rgba(208, 208, 208, 0.250)', width: 350, mb:1 }}>
  //                 <Box sx={{ padding: 2 }}>
  //                   <Box sx={{ display: 'inline-flex' }}>
  //                     {feedback?.patient?.profile_picture ? (
  //                       <Image
  //                         sx={{
  //                           borderRadius: '100%',
  //                           width: '35px',
  //                           height: '35px',
  //                           position: 'relative',
  //                           top: '-5px',
  //                           left: '-5px',
  //                           border: '1px solid lightgreen',
  //                         }}
  //                         src={feedback?.patient?.profile_picture}
  //                       />
  //                     ) : (
  //                       <Avatar
  //                         src={user?.photoURL}
  //                         alt={user?.userName}
  //                         sx={{
  //                           width: 36,
  //                           height: 36,
  //                           border: (theme) => `solid 2px ${theme.palette.background.default}`,
  //                         }}
  //                       >
  //                         {user?.ratemakername?.charAt(0).toUpperCase()}
  //                       </Avatar>
  //                     )}
  //                     <Typography sx={{ ml: 1, mt: 0.5 }}>
  //                       {feedback?.patient?.first_name}
  //                     </Typography>
  //                     <Box sx={{ ml: 1, mt: 0.7 }}>
  //                       <Iconify width={19} icon="emojione:star" />{' '}
  //                       <Iconify width={19} icon="emojione:star" />{' '}
  //                       <Iconify width={19} icon="emojione:star" />{' '}
  //                       <Iconify width={19} icon="emojione:star" />{' '}
  //                       <Iconify width={19} icon="emojione:star" />{' '}
  //                     </Box>
  //                   </Box>
  //                   <Typography sx={{ ml: 5.3 }}>{feedback?.Body}</Typography>
  //                 </Box>
  //               </Box>
  //             </React.Fragment>
  //           ))}
  //           {feedbackData.length && (
  //             <Link onClick={toggleFeedbackDisplay} variant="outlined"> 
  //               {showAllFeedback ? 'Hide' : 'Show All'}
  //             </Link>
  //           )}
  //         </Box>
  //       </Box>
  //     </Box>
  //     <Box sx={{ width: '45%', margin: 2, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
  //       {groupedAppointments.today.length > 0 && (
  //         <ul style={{ listStyle: 'none' }}>
  //           <h4 style={{ fontWeight: 600 }}>Today</h4>
  //           {groupedAppointments.today.map((appointment, i) => (
  //             <li key={i}>
  //               <Button
  //                 onClick={(e) => kdk(e.target.value)}
  //                 sx={{
  //                   bgcolor: 'rgba(208, 208, 208, 0.566)',
  //                   mb: 1,
  //                   // width: '18%',
  //                   borderRadius: 0,
  //                   fontWeight: 100,
  //                 }}
  //               >
  //                 {fTime(appointment?.start_time)}
  //               </Button>
  //             </li>
  //           ))}
  //           <Button sx={{ mt: 1, bgcolor: 'success.main' }} variant="contained">
  //             Book
  //           </Button>
  //         </ul>
  //       )}

  //       {/* Render other dates */}
  //       {Object.keys(groupedAppointments).map((date, index) => {
  //         if (date !== 'today') {
  //           return (
  //             <ul key={index} style={{ listStyle: 'none' }}>
  //               <h4 style={{ fontWeight: 600 }}>{date}</h4>
  //               {groupedAppointments[date].map((appointment, i) => (
  //                 <li key={i}>
  //                   <Button
  //                     onClick={() => kdk(appointment?._id)}
  //                     sx={{
  //                       bgcolor: 'rgba(208, 208, 208, 0.566)',
  //                       mb: 1,
  //                       // width: '20%',
  //                       borderRadius: 0,
  //                       fontWeight: 100,
  //                     }}
  //                   >
  //                     {fTime(appointment?.start_time)}
  //                   </Button>
  //                 </li>
  //               ))}
  //               <Button sx={{ mt: 1, bgcolor: 'success.main' }} variant="contained">
  //                 Book
  //               </Button>
  //             </ul>
  //           );
  //         }
  //         return null;
  //       })}

  //       {/* Render placeholder if no appointments for today */}
  //       {groupedAppointments.today.length === 0 && (
  //         <ul style={{ listStyle: 'none' }}>
  //           <h4 style={{ fontWeight: 600 }}>Today</h4>
  //           <li>
  //             <Button
  //               sx={{
  //                 bgcolor: 'rgba(208, 208, 208, 0.566)',
  //                 mb: 1,
  //                 // width: '18%',
  //                 borderRadius: 0,
  //                 fontWeight: 100,
  //               }}
  //             >
  //               -- / --
  //             </Button>
  //           </li>
  //         </ul>
  //       )}
  //     </Box>
  //   </Box>
  // );
};

AppointmentOnline.propTypes = {
  Units: PropTypes.object,
  onView: PropTypes.func,
  onBook: PropTypes.func,
};

export default AppointmentOnline;
