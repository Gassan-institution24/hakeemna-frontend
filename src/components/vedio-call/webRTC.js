import PropTypes from 'prop-types';
import React, { useRef, useState, useEffect } from 'react';

import { Box, Stack, Button, Dialog } from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { useTranslate } from 'src/locales';

import Iconify from '../iconify';
import { useWebRTC } from './use-web-rtc';

const WebRTCComponent = ({ userId, callerId, userName, onShowBig }) => {
  const {
    receivingCall,
    callAccepted,
    isMuted,
    isVideoOn,
    myVideo,
    userVideo,
    myVideoRef,
    userVideoRef,
    answerCall,
    toggleMute,
    toggleVideo,
    endCall,
    toggleScreenSharing,
    isScreenSharing,
    onCancelCall,
    isCalling,
    refreshStream,
  } = useWebRTC();

  const mdUp = useResponsive('up', 'md');
  const { t } = useTranslate();
  const componentRef = useRef();

  const [isSmall, setIsSmall] = useState(false);

  useEffect(() => {
    refreshStream();
    if (componentRef.current) {
      const { width, height } = componentRef.current.getBoundingClientRect();

      const SMALL_WIDTH_THRESHOLD = 300;
      const SMALL_HEIGHT_THRESHOLD = 200;

      setIsSmall(width < SMALL_WIDTH_THRESHOLD || height < SMALL_HEIGHT_THRESHOLD);
    }
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
      <Box
        ref={componentRef}
        sx={{
          width: '100%',
          height: '100%',
          position: 'relative',
          ':hover': {
            '#actionBar': {
              display: 'flex',
            },
          },
        }}
      >
        <Box sx={{ width: '100%', height: '100%' }}>
          {!isSmall && (
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
                ref={isSmall ? myVideo : myVideoRef}
                autoPlay
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  backgroundColor: 'black',
                }}
              />
            </Box>
          )}

          <Box
            sx={{
              zIndex: 40,
              position: isSmall ? '' : 'absolute',
              width: '100%',
              height: '100%',
              ...(isSmall && { top: 0, left: 0 }),
            }}
          >
            {/* eslint-disable */}
            <video
              playsInline
              ref={isSmall ? userVideo : userVideoRef}
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
          id="actionBar"
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{
            display: isSmall ? 'none' : '',
            position: 'absolute',
            bottom: 0,
            right: 0,
            zIndex: 100,
            width: 1,
            height: isSmall ? 45 : 65,
            backgroundColor: '#212B36',
            color: '#fff',
            padding: 1,
            px: mdUp && !isSmall ? 4 : 1,
          }}
        >
          <Stack direction="row" spacing={isSmall ? 1 : 2}>
            <Button
              variant="outlined"
              sx={{ display: 'flex', gap: 1, padding: isSmall ? 0.5 : 1, minWidth: 0 }}
              onClick={toggleMute}
            >
              <Iconify
                width={isSmall ? 20 : 23}
                icon={isMuted ? 'material-symbols:mic-off' : 'material-symbols:mic'}
              />
              {mdUp && !isSmall && <span>{isMuted ? t('Unmute') : t('Mute')}</span>}
            </Button>
            <Button
              variant="outlined"
              sx={{ display: 'flex', gap: 1, padding: isSmall ? 0.5 : 1, minWidth: 0 }}
              onClick={toggleVideo}
            >
              <Iconify
                width={isSmall ? 20 : 23}
                icon={
                  isVideoOn
                    ? 'material-symbols:video-camera-front'
                    : 'material-symbols:video-camera-front-off'
                }
              />
              {mdUp && !isSmall && <span>{isVideoOn ? t('Camera Off') : t('Camera On')}</span>}
            </Button>
            {!isSmall && (
              <Button
                variant="outlined"
                sx={{ display: 'flex', gap: 1, padding: isSmall ? 0.5 : 1, minWidth: 0 }}
                onClick={toggleScreenSharing}
              >
                <Iconify
                  width={isSmall ? 20 : 23}
                  icon={
                    isScreenSharing
                      ? 'material-symbols:stop-screen-share-outline'
                      : 'material-symbols:screen-share-outline'
                  }
                />
                {mdUp && !isSmall && (
                  <span>{isScreenSharing ? t('Stop Sharing') : t('Share Screen')}</span>
                )}
              </Button>
            )}
            {/* <Button
              variant="outlined"
              sx={{ display: 'flex', gap: 1, padding: 1 }}
              onClick={isRecording ? stopRecording : startRecording}
              >
              <Iconify
                width={isSmall?20:23}
                icon={isRecording ? 'material-symbols:lens' : 'material-symbols:lens-outline'}
                />
                <span>{isRecording ? t('Stop Recording') : t('Record')}</span>
                </Button> */}
          </Stack>
          <Stack direction="row" spacing={isSmall ? 1 : 2}>
            <Button
              variant="contained"
              color="error"
              sx={{ display: 'flex', gap: 1, padding: isSmall ? 0.5 : 1, minWidth: 0 }}
              onClick={endCall}
            >
              <Iconify width={isSmall ? 20 : 23} icon="material-symbols:call-end-sharp" />
              {mdUp && !isSmall && <span>{t('End Call')}</span>}
            </Button>
            {isSmall && onShowBig && (
              <Button
                variant="outlined"
                sx={{ display: 'flex', gap: 1, padding: isSmall ? 0.5 : 1, minWidth: 0 }}
                onClick={onShowBig}
              >
                <Iconify width={isSmall ? 20 : 23} icon="material-symbols:fullscreen-rounded" />
              </Button>
            )}
          </Stack>
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
  onShowBig: PropTypes.func,
};
