/* eslint-disable react/prop-types */
import io from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { useRef, useState, useEffect } from 'react';

import Dialog from '@mui/material/Dialog';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';

import { useAuthContext } from 'src/auth/hooks';

export default function CallDialog() {
  const [open, setOpen] = useState(false);
  const [callerName, setCallerName] = useState('');
  const [roomUrl, setRoomUrl] = useState('');
  const callerSocketRef = useRef(null);

  // To track if the call was canceled before acceptance
  const callCanceledRef = useRef(false);
  const roomRef = useRef('');
  const { t } = useTranslation();
  const socketRef = useRef(null);
  const { user } = useAuthContext();

  useEffect(() => {
    if (socketRef.current) return;

    const socket = io(process.env.REACT_APP_API_URL);
    socketRef.current = socket;
    if (user?._id) {
      socket.emit('register-user', {
        userId: user._id,
      });
    }

    socket.on('callUser', (data) => {
      if (!data.roomUrl) return;
      callCanceledRef.current = false;

      setCallerName(data.userName);
      setRoomUrl(data.roomUrl);
      setOpen(true);
      roomRef.current = data.uniqueRoom;
      callerSocketRef.current = data.from;

      window._roomUrlTemp = data.roomUrl;
      window._roomNameTemp = data.uniqueRoom;
    });
    // Listen for call canceled event
    socket.on('call-canceled', ({ roomId }) => {
      if (roomId !== window._roomNameTemp) return;

      callCanceledRef.current = true;

      setOpen(false);
      setCallerName('');
      setRoomUrl('');
    });
    // Listen for call ended event
    socket.on('call-ended', ({ roomId }) => {
      if (roomId === roomRef.current) {
        setOpen(false);
        roomRef.current = '';
      }
    });
    // eslint-disable-next-line consistent-return
    return () => {
      socket.off('callUser');
      socket.off('call-canceled');
      socket.off('call-ended');
      socket.disconnect();
      socketRef.current = null;
    };
  }, [  user?._id]);
  const handleAccept = () => {
    setOpen(false);
    // If call was canceled before acceptance, do nothing
    if (callCanceledRef.current) return;
    // Emit event to notify caller that call is accepted
    socketRef.current.emit('call-accepted', {
      to: callerSocketRef.current,
      roomId: window._roomNameTemp,
    });
    // add more data to url like role
    window.open(
      `/call?roomUrl=${encodeURIComponent(window._roomUrlTemp)}&userName=${encodeURIComponent(
        user?.patient?.name_arabic || user?.patient?.name_english
      )}&uniqueRoom=${encodeURIComponent(window._roomNameTemp)}&role=patient`,
      '_blank'
    );
  };

  const handleReject = () => {
    setOpen(false);
    setCallerName('');
    setRoomUrl('');
    roomRef.current = '';
    socketRef.current.emit('call-rejected', {
      to: callerSocketRef.current, // socket.id تبع الدكتور
      roomId: window._roomNameTemp,
    });
  };

  return (
    <Dialog open={open} onClose={handleReject}>
      <DialogTitle>
        📞 {t('Incoming Call from')} {callerName}
      </DialogTitle>
      <DialogActions>
        <Button color="error" onClick={handleReject}>
          {t('decline')}
        </Button>
        <Button color="primary" onClick={handleAccept}>
          {t('accept')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
