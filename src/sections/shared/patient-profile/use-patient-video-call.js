import io from 'socket.io-client';
import { useRef, useState, useEffect, useCallback } from 'react';

import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

/**
 * The patient's live online status, and the action that starts a video call.
 *
 * Online status arrives twice: once on the patient record when the profile
 * loads, then as `userOnlineStatus` events for as long as the page is open.
 *
 * Only patients with a linked account can be called, so with no `patient._id`
 * this stays offline and never opens a socket.
 *
 * @param {object} args
 * @param {object} args.usPatientData raw response from useGetOneUSPatient
 * @param {object} args.patientData   the merged patient (for display names)
 */
export function usePatientVideoCall({ usPatientData, patientData }) {
  const { user } = useAuthContext();
  const socketRef = useRef(null);

  const patientUserId = patientData?.patient?._id;

  const [isPatientOnline, setIsPatientOnline] = useState(false);

  // Seed from the record, so the button is right before any socket event lands.
  useEffect(() => {
    if (patientData?.patient?.online !== undefined) {
      setIsPatientOnline(!!patientData.patient.online);
    }
  }, [patientData?.patient?.online]);

  useEffect(() => {
    if (!patientUserId) return undefined;

    socketRef.current = io(process.env.REACT_APP_API_URL);

    socketRef.current.on('userOnlineStatus', ({ userId, online }) => {
      if (userId === patientUserId) {
        setIsPatientOnline(online);
      }
    });

    return () => socketRef.current?.disconnect();
  }, [patientUserId]);

  const handleCall = useCallback(async () => {
    try {
      const uniqueRoom = `hakeemna-${Date.now()}`;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/daily/create-room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: uniqueRoom }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create room');
      }

      const data = await response.json();
      const roomUrl = data.url;

      await fetch(`${process.env.REACT_APP_API_URL}/api/video-call`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          unit_service: usPatientData?.unit_service,
          patient: patientData?._id,
          employee: user?.employee?._id,
          work_group: patientData?.work_groups?.[0],
          descriptionEn: `Video call initiated by Dr. ${user?.employee?.name_english} with patient ${patientData?.name_english} at ${new Date().toLocaleString()}`,
          descriptionAR: `تم بدء مكالمة فيديو من قبل الدكتور ${user?.employee?.name_arabic} مع المريض ${patientData?.name_arabic} بتاريخ ${new Date().toLocaleString('ar-EG')}`,
          room_name: uniqueRoom,
        }),
      });

      window.open(
        `/video-call/${patientData?._id}?roomUrl=${encodeURIComponent(
          roomUrl
        )}&uniqueRoom=${uniqueRoom}&role=host`,
        '_blank'
      );
    } catch (error) {
      console.error('❌ handleCall error:', error);
    }
  }, [usPatientData, patientData, user]);

  return { isPatientOnline, handleCall, canCall: !!patientUserId };
}
