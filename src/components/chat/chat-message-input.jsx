import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useRef, useMemo, useState, useCallback } from 'react';

import Stack from '@mui/material/Stack';
import { LoadingButton } from '@mui/lab';
import InputBase from '@mui/material/InputBase';
import IconButton from '@mui/material/IconButton';
import { Box, Card, Dialog, Divider, Typography, DialogTitle } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { createConversation } from 'src/api/chat';

import Iconify from 'src/components/iconify';

import VoiceChat from './chat-voice-component';

// ----------------------------------------------------------------------

export default function ChatMessageInput({
  recipients = [],
  onAddRecipients,
  refetch,
  //
  disabled,
  selectedConversationId,
}) {
  const router = useRouter();

  const { user } = useAuthContext();

  const fileRef = useRef(null);

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslate();

  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState();
  const [confirmAttach, setConfirmAttach] = useState();
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [recorder, setRecorder] = useState(null);
  const [previewAudio, setPreviewAudio] = useState();
  const [duration, setDuration] = useState();

  const myContact = useMemo(
    () => ({
      id: `${user?.id}`,
      role: `${user?.role}`,
      email: `${user?.email}`,
      address: `${user?.address}`,
      name: `${user?.displayName}`,
      lastActivity: new Date(),
      avatarUrl: `${user?.photoURL}`,
      phoneNumber: `${user?.phoneNumber}`,
      status: 'online',
    }),
    [user]
  );

  const messageData = useMemo(
    () => ({
      attachments: [],
      body: message,
      contentType: 'text',
    }),
    [message]
  );

  const attachMessageData = useMemo(
    () => ({
      attachment,
      contentType: /^image\//.test(attachment?.type) ? 'image' : 'file',
    }),
    [attachment]
  );

  const conversationData = useMemo(
    () => ({
      id: selectedConversationId,
      message: messageData,
      participants: [...recipients, myContact],
      type: recipients.length > 1 ? 'GROUP' : 'ONE_TO_ONE',
      unreadCount: 0,
    }),
    [myContact, recipients, selectedConversationId, messageData]
  );

  const handleAttach = useCallback(() => {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }, []);

  const handleChangeAttach = useCallback((event) => {
    const file = event.target.files[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });
    if (file) {
      setAttachment(newFile);
      setConfirmAttach(true);
    }
  }, []);

  const handleCloseConfirm = useCallback(() => {
    setConfirmAttach(false);
    setAttachment();
  }, []);

  const handleChangeMessage = useCallback((event) => {
    setMessage(event.target.value);
  }, []);

  const toggleRecording = async () => {
    try {
      if (!recording) {
        if (navigator.mediaDevices) {
          setRecording(true);
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new MediaRecorder(stream);
          setRecorder(mediaRecorder);
          const chunks = [];
          let startTime;

          mediaRecorder.ondataavailable = (e) => {
            chunks.push(e.data);
          };

          mediaRecorder.onstart = () => {
            startTime = Date.now();
          };

          mediaRecorder.onstop = async () => {
            const endTime = Date.now();
            setDuration((endTime - startTime) / 1000);
            const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
            setAudioBlob(blob);
            setPreviewAudio(URL.createObjectURL(blob));
            setRecording(false);
          };

          mediaRecorder.start();
        } else {
          enqueueSnackbar('no voice device found', { variant: 'error' });
        }
      } else {
        // setRecording(false);
        recorder.stream.getTracks().forEach((track) => track.stop());
        recorder.stop();
      }
    } catch (e) {
      enqueueSnackbar(e.message, { variant: 'error' });
    }
  };
  const handleSendMessage = useCallback(
    async (event) => {
      try {
        if (event?.key === 'Enter') {
          if (message) {
            if (selectedConversationId) {
              try {
                await axiosInstance.post(endpoints.chat.one(selectedConversationId), messageData);
                refetch();
              } catch (e) {
                console.log('e', e);
                enqueueSnackbar(e.message, { variant: 'error' });
              }
            } else {
              const res = await createConversation(conversationData);
              router.push(`${paths.dashboard.chat}?id=${res.conversation.id}`);
              onAddRecipients([]);
            }
          }
          setMessage('');
        } else if (attachment) {
          if (selectedConversationId) {
            try {
              const formData = new FormData();
              Object.keys(attachMessageData).forEach((key) => {
                formData.append(key, attachMessageData[key]);
              });
              await axiosInstance.post(endpoints.chat.one(selectedConversationId), formData);
              refetch();
              setAttachment();
            } catch (e) {
              console.log('e', e);
              enqueueSnackbar(e.message, { variant: 'error' });
            }
          }
        } else if (audioBlob) {
          if (selectedConversationId) {
            try {
              const formData = new FormData();
              formData.append('body', audioBlob);
              formData.append('duration', duration);
              formData.append('contentType', 'voice');
              await axiosInstance.post(endpoints.chat.one(selectedConversationId), formData);
              refetch();
              setAudioBlob();
              setPreviewAudio();
            } catch (e) {
              console.log('e', e);
              enqueueSnackbar(e.message, { variant: 'error' });
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
    [
      conversationData,
      message,
      onAddRecipients,
      router,
      selectedConversationId,
      refetch,
      attachment,
      attachMessageData,
      messageData,
      audioBlob,
      enqueueSnackbar,
      duration,
    ]
  );

  const HandleSendAttachment = useCallback(() => {
    handleSendMessage('attachement');
    setConfirmAttach(false);
  }, [handleSendMessage]);

  return (
    <>
      {!previewAudio && (
        <InputBase
          value={message}
          onKeyUp={handleSendMessage}
          onChange={handleChangeMessage}
          placeholder={t('Type a message')}
          disabled={disabled}
          // startAdornment={
          //   <IconButton onClick={() => setShowIcons(true)}>
          //     <Iconify icon="eva:smiling-face-fill" />
          //   </IconButton>
          // }
          endAdornment={
            <Stack direction="row" sx={{ flexShrink: 0 }}>
              <IconButton onClick={handleAttach}>
                <Iconify icon="solar:gallery-add-bold" />
              </IconButton>
              <IconButton onClick={handleAttach}>
                <Iconify icon="eva:attach-2-fill" />
              </IconButton>
              <IconButton sx={{ color: recording ? 'primary.main' : '' }} onClick={toggleRecording}>
                <Iconify icon="solar:microphone-bold" />
              </IconButton>
            </Stack>
          }
          sx={{
            px: 1,
            height: 56,
            flexShrink: 0,
            borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        />
      )}
      {previewAudio && (
        <>
          <Divider />
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            gap={1}
            sx={{ p: 1 }}
          >
            {/* <IconButton sx={{ color: 'error.main' }} onClick={onCancel}> */}
            <Iconify
              sx={{ color: 'error.main', mr: 1, cursor: 'pointer', width: 40 }}
              onClick={() => setPreviewAudio()}
              icon="mdi:trash"
            />
            {/* </IconButton> */}
            <VoiceChat duration={duration} src={previewAudio} />
            {/* <IconButton sx={{ color: 'success.main' }} onClick={onSend}> */}
            <Iconify
              sx={{ color: 'success.main', ml: 1, cursor: 'pointer', width: 40 }}
              onClick={() => handleSendMessage('voice')}
              icon="streamline:mail-send-email-message-solid"
            />
            {/* </IconButton> */}
          </Stack>
        </>
      )}
      <input type="file" ref={fileRef} onChange={handleChangeAttach} style={{ display: 'none' }} />
      <Dialog open={confirmAttach} onClose={handleCloseConfirm}>
        <Stack sx={{ px: 2, pb: 3 }}>
          <DialogTitle> {t('Send file')}</DialogTitle>
          {/^image\//.test(attachment?.type) ? (
            <Box
              width={{ md: 400, xs: 200 }}
              height={{ md: 400, xs: 200 }}
              component="img"
              src={attachment?.preview}
            />
          ) : (
            <Card sx={{ px: 3, py: 1, m: 1, minWidth: 400 }}>
              <Stack direction="row" justifyContent="space-around" alignItems="center">
                <Typography>{attachment?.name}</Typography>
                <Typography color="text.disabled" sx={{ ml: 1 }}>
                  {attachment?.size} KB
                </Typography>
              </Stack>
            </Card>
          )}
          <Stack spacing={3} alignItems="flex-end" sx={{ mt: 2 }}>
            <LoadingButton onClick={HandleSendAttachment} tabIndex={-1} variant="contained">
              {t('send')}
            </LoadingButton>
          </Stack>
        </Stack>
      </Dialog>
    </>
  );
}

ChatMessageInput.propTypes = {
  disabled: PropTypes.bool,
  onAddRecipients: PropTypes.func,
  refetch: PropTypes.func,
  recipients: PropTypes.array,
  selectedConversationId: PropTypes.string,
};
