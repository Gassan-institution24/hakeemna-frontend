/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import io from 'socket.io-client';

import WebRTCComponent from 'src/components/vedio-call/webRTC'; // تأكد من المسار حسب مشروعك

export default function ProfileCover({ name, avatarUrl, role, coverUrl }) {
  const [open, setOpen] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [callerId, setCallerId] = useState('');
  const [roomUrl, setRoomUrl] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_API_URL);
    socket.on('callUser', (data) => {
      console.log('📞 Incoming call data:', data); // <--- هذا مهم جدًا
      setCallerName(data.userName);
      setCallerId(data.from);
      setRoomUrl(data.roomUrl);
      setOpen(true);
    });

    // استقبل الاتصال الوارد
    socket.on('callUser', (data) => {
      setCallerName(data.userName);
      setCallerId(data.from);
      setRoomUrl(data.roomUrl);
      setOpen(true); // افتح نافذة الاتصال
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleAccept = () => {
    setCallAccepted(true);
    setOpen(false);
  };

  const handleReject = () => {
    setOpen(false);
    setCallerName('');
    setCallerId('');
    setRoomUrl('');
  };

  return (
    <>
      {/* نافذة الاتصال الوارد */}
      <Dialog open={open} onClose={handleReject}>
        <DialogTitle>📞 Incoming Call from {callerName}</DialogTitle>
        <DialogActions>
          <Button color="error" onClick={handleReject}>
            رفض
          </Button>
          <Button color="primary" onClick={handleAccept}>
            قبول
          </Button>
        </DialogActions>
      </Dialog>

      {/* مكون المكالمة الفيديو */}
      {callAccepted && roomUrl && (
        <WebRTCComponent
          roomUrl={roomUrl}
          open={open}
          onClose={() => {
            setCallAccepted(false);
            setRoomUrl('');
          }}
        />
      )}
    </>
  );
}
