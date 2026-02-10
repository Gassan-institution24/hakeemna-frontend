import io from 'socket.io-client';
import React, { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';

import { Box,Button, Typography } from '@mui/material';

import { useLocales } from 'src/locales';
import { useGetOneUSPatient } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

export default function VideoCall() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { usPatientData } = useGetOneUSPatient(id, {
    populate: [
      {
        path: 'patient',
        populate: 'drug_allergies drugs_prescriptions diseases surgeries medicines eating_diet',
      },
      { path: 'drug_allergies drugs_prescriptions diseases surgeries medicines eating_diet' },
    ],
  });
  const patientData = usPatientData.patient
    ? { ...usPatientData.patient, ...usPatientData }
    : usPatientData;
  const roomUrl = searchParams.get('roomUrl');
  const uniqueRoom = searchParams.get('uniqueRoom');
  const [callStatus, setCallStatus] = useState('calling');
  const [dots, setDots] = useState('');

  const socketRef = useRef(null);
  useEffect(() => {
    if (!uniqueRoom || !patientData?.user?._id) return;

    const socket = io(process.env.REACT_APP_API_URL);
    socketRef.current = socket;

    // join room
    socket.emit('join-room', {
      roomId: uniqueRoom,
      role: 'host',
    });

    // call user
    socket.emit('callUser', {
      userId: patientData.user._id,
      userName: curLangAr ? user?.employee?.name_arabic : user?.employee?.name_english,
      roomUrl,
      uniqueRoom,
    });

    // listeners
    socket.on('call-accepted', ({ roomId }) => {
      if (roomId !== uniqueRoom) return;

      navigate(
        `/call?roomUrl=${encodeURIComponent(roomUrl)}&userName=${encodeURIComponent(
          user?.employee?.name_arabic || user?.employee?.name_english
        )}&uniqueRoom=${encodeURIComponent(uniqueRoom)}&role=host`,
        { replace: true }
      );
    });

    socket.on('call-rejected', ({ roomId }) => {
      if (roomId !== uniqueRoom) return;
      setCallStatus('rejected');
      setTimeout(() => window.close(), 3000);
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uniqueRoom, patientData?.user?._id]);

  const handleCancel = () => {
    socketRef.current.emit('cancel-call', {
      roomId: uniqueRoom,
    });

    socketRef.current.emit('end-call-room', {
      roomId: uniqueRoom,
    });
    window.close();
  };

  useEffect(() => {
    if (callStatus !== 'calling') return;

    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? '' : `${prev}.`));
    }, 500);

    // eslint-disable-next-line consistent-return
    return () => clearInterval(interval);
  }, [callStatus]);

  return (
  <Box
    sx={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      bgcolor: '#fff',
      overflow: 'hidden',
    }}
  >
    {/* Background Image */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/favicon/512.png')",
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '900px',
        opacity: 0.08,
        filter: 'blur(1px)',
      }}
    />

    {/* Overlay */}
    <Box
      sx={{
        position: 'absolute',
        inset: 0,
        bgcolor: 'rgba(0,0,0,0.25)',
      }}
    />

    {/* Dialog Container */}
    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          borderRadius: 3,
          px: 7,
          py: 6,
          minWidth: 380,
          maxWidth: 420,
          textAlign: 'center',
          bgcolor: 'rgba(255,255,255,0.95)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Title */}
        {callStatus === 'calling' && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: '#111827',
              mb: 3,
            }}
          >
            {curLangAr
              ? `قيد الاتصال بالمريض${dots}`
              : `Calling the patient${dots}`}
          </Typography>
        )}

        {callStatus === 'rejected' && (
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              color: 'error.main',
              mb: 3,
              animation: 'rejectPulse 1.4s infinite',
              '@keyframes rejectPulse': {
                '0%': { opacity: 1 },
                '50%': { opacity: 0.4 },
                '100%': { opacity: 1 },
              },
            }}
          >
            {curLangAr ? 'تم رفض الاتصال' : 'Call Rejected'}
          </Typography>
        )}

        {/* Cancel Button */}
        <Button
          variant="outlined"
          color="error"
          onClick={handleCancel}
          sx={{
            borderRadius: 2,
            px: 5,
            py: 1.2,
            fontWeight: 700,
          }}
        >
          {curLangAr ? 'إلغاء الاتصال' : 'Cancel Call'}
        </Button>
      </Box>
    </Box>
  </Box>
);
}
