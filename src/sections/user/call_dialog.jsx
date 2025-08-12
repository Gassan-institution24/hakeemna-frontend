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
  const { t } = useTranslation();
  const socketRef = useRef(null);
  const { user } = useAuthContext();
  useEffect(() => {
    if (socketRef.current) return;

    const socket = io(process.env.REACT_APP_API_URL);
    socketRef.current = socket;

    socket.on('callUser', (data) => {

      if (!data.roomUrl) return;

      setCallerName(data.userName);
      setRoomUrl(data.roomUrl);
      setOpen(true);

      window._roomUrlTemp = data.roomUrl;
    });

    // eslint-disable-next-line consistent-return
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);
  const handleAccept = () => {
    setOpen(false);

    const url = window._roomUrlTemp || roomUrl;
    if (url) {
      window.open(
        `/call?roomUrl=${encodeURIComponent(url)}&userName=${encodeURIComponent(user?.patient?.name_arabic || user?.patient?.name_english)}`,
        '_blank'
      );
    } else {
      console.error('❌ No room URL available to join');
    }
  };

  const handleReject = () => {
    setOpen(false);
    setCallerName('');
    setRoomUrl('');
  };

  return (
    <Dialog open={open} onClose={handleReject}>
      <DialogTitle>
        📞 {t('Incoming Call from')} {callerName}
      </DialogTitle>
      <DialogActions>
        <Button color="error" onClick={handleReject}>
          رفض
        </Button>
        <Button color="primary" onClick={handleAccept}>
          قبول
        </Button>
      </DialogActions>
    </Dialog>
  );
}
