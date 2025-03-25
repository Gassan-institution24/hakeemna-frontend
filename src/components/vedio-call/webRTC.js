import PropTypes from 'prop-types';

import React, { useEffect } from 'react';

import { Box, Stack, Button, Dialog } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useResponsive } from 'src/hooks/use-responsive';

import socket from 'src/socket';
import { useTranslate } from 'src/locales';

import Iconify from '../iconify';
import { useWebRTC } from './use-web-rtc';

const WebRTCComponent = ({ userId, callerId, userName }) => {
  const {
    receivingCall,
    callAccepted,
    setIdToCall,
    isMuted,
    isVideoOn,
    // isRecording,
    myVideo,
    userVideo,
    callUser,
    answerCall,
    toggleMute,
    toggleVideo,
    setCallAccepted,
    // startRecording,
    // stopRecording,
    endCall,
    toggleScreenSharing,
    isScreenSharing,
    setCaller,
    caller,
    setReceivingCall,
    setStream,
    audioTrackRef,
    stream,
    onCancelCall,
    isCalling,
    idToCall,
  } = useWebRTC();

  const router = useRouter();

  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslate();

  useEffect(() => {
    // if (stream) {
    if (userId && !idToCall) {
      setIdToCall(userId);
      callUser(userId);
    }

    if (callerId && !caller) {
      // setReceivingCall(true);
      setCaller(callerId);
    }
    // }
    // eslint-disable-next-line
  }, [userId, callerId]);

  useEffect(() => {
    socket.on('endCall', () => {
      endCall();
    });
    socket.on('cancelCall', () => {
      endCall();
      // router.replace(paths.dashboard.root);
    });

    socket.on('callAccepted', ({ from }) => {
      setCallAccepted(true);
      setCaller(from);
    });

    // return () => {
    //   if (stream) {
    //     stream.getTracks().forEach((track) => track.stop());
    //   }

    //   socket.off('endCall');
    //   socket.off('cancelCall');
    //   socket.off('callAccepted');

    //   if (callAccepted) {
    //     endCall();
    //   }
    // };
    // eslint-disable-next-line
  }, []);

  if (!receivingCall && !isCalling) {
    return null;
  }

  return (
    <>
      {receivingCall && !callAccepted && (
        // eslint-disable-next-line
        <audio style={{ display: 'none' }} src="/callingTone.mp3" autoPlay loop />
      )}
      {/* Local video */}
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Box sx={{ width: '100%', height: '100%' }}>
          <Box
            sx={{
              zIndex: 60,
              position: 'absolute',
              top: 5,
              right: 5,
              width: mdUp ? 300 : 170,
              height: mdUp ? 200 : 120,
              borderRadius: '10px',
              overflow: 'hidden',
              border: '3px solid #ccc',
            }}
          >
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: 'black',
              }}
            />
          </Box>

          <Box
            sx={{
              zIndex: 40,
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
          >
            {/* eslint-disable */}
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: 'black',
              }}
            />
            {/* eslint-enable */}
          </Box>
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            width: 1,
            height: 65,
            backgroundColor: '#212B36',
            color: '#fff',
            padding: 1,
            px: mdUp ? 4 : 2,
          }}
        >
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              sx={{ display: 'flex', gap: 1, padding: 1 }}
              onClick={toggleMute}
            >
              <Iconify
                width={23}
                icon={isMuted ? 'material-symbols:mic-off' : 'material-symbols:mic'}
              />
              {mdUp && <span>{isMuted ? t('Unmute') : t('Mute')}</span>}
            </Button>
            <Button
              variant="outlined"
              sx={{ display: 'flex', gap: 1, padding: 1 }}
              onClick={toggleVideo}
            >
              <Iconify
                width={23}
                icon={
                  isVideoOn
                    ? 'material-symbols:video-camera-front'
                    : 'material-symbols:video-camera-front-off'
                }
              />
              {mdUp && <span>{isVideoOn ? t('Camera Off') : t('Camera On')}</span>}
            </Button>
            <Button
              variant="outlined"
              sx={{ display: 'flex', gap: 1, padding: 1 }}
              onClick={toggleScreenSharing}
            >
              <Iconify
                width={23}
                icon={
                  isScreenSharing
                    ? 'material-symbols:stop-screen-share-outline'
                    : 'material-symbols:screen-share-outline'
                }
              />
              {mdUp && <span>{isScreenSharing ? t('Stop Sharing') : t('Share Screen')}</span>}
            </Button>
            {/* <Button
              variant="outlined"
              sx={{ display: 'flex', gap: 1, padding: 1 }}
              onClick={isRecording ? stopRecording : startRecording}
            >
              <Iconify
                width={23}
                icon={isRecording ? 'material-symbols:lens' : 'material-symbols:lens-outline'}
              />
              <span>{isRecording ? t('Stop Recording') : t('Record')}</span>
              </Button> */}
          </Stack>
          <Button
            variant="contained"
            color="error"
            sx={{ display: 'flex', gap: 1, padding: 1 }}
            onClick={endCall}
          >
            <Iconify width={23} icon="material-symbols:call-end-sharp" />
            {mdUp && <span>{t('End Call')}</span>}
          </Button>
        </Stack>
      </Box>
      <Dialog open={receivingCall && !callAccepted}>
        <Stack p={3} gap={2}>
          <h3>
            {userName} {t('Calling...')}
          </h3>
          <Stack gap={1}>
            <Button
              variant="contained"
              color="primary"
              type="button"
              onClick={answerCall}
              sx={{ minWidth: 200 }}
            >
              {t('Answer')}
            </Button>
            <Button variant="text" type="button" onClick={onCancelCall}>
              {t('Cancel')}
            </Button>
          </Stack>
        </Stack>
      </Dialog>
      {/* <Dialog open={connectionRef.current && !receivingCall && !callAccepted}>
        <div>
          <h3>Calling...</h3>
        </div>
      </Dialog> */}
    </>
  );
};

export default WebRTCComponent;

WebRTCComponent.propTypes = {
  userId: PropTypes.string,
  callerId: PropTypes.string,
  userName: PropTypes.string,
};
