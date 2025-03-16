import React, { useEffect } from 'react';

import { Box, Stack, Button, Dialog } from '@mui/material';

import { useSearchParams } from 'src/routes/hooks';

import socket from 'src/socket';

import Iconify from '../iconify';
import { useWebRTC } from './use-web-rtc';

const WebRTCComponent = () => {
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
    // startRecording,
    // stopRecording,
    endCall,
    toggleScreenSharing,
    isScreenSharing,
    setCaller,
    setReceivingCall,
    setStream,
    audioTrackRef,
    stream,
  } = useWebRTC();

  const searchParams = useSearchParams();

  const userId = searchParams.get('userId');
  const callerParam = searchParams.get('caller');


  useEffect(() => {
    if (stream) {
      if (userId) {
        setIdToCall(userId);
        callUser(userId);
      }

      if (callerParam) {
        setReceivingCall(true);
        setCaller(callerParam);
      }
    }
  }, [userId, callerParam, stream, setIdToCall, callUser, setCaller, setReceivingCall]);

  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);

        // Store a reference to the audio track
        const audioTracks = currentStream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioTrackRef.current = audioTracks[0];
        }

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
      });

    // Listen for call end event from socket
    socket.on("endCall", () => {
      endCall();
    });

    return () => {
      if (callAccepted) {
        endCall();
      }
      socket.off("endCall");
    };
    // eslint-disable-next-line
  }, [callAccepted]);

  return (
    <>
      {receivingCall && !callAccepted && (
        // eslint-disable-next-line
        <audio style={{ display: 'none' }} src="/callingTone.mp3" autoPlay loop />
      )}
      <Dialog open fullScreen sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* Local video */}
        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              zIndex: 60,
              position: 'fixed',
              bottom: 70,
              right: 5,
              width: 300,
              height: 200,
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
            sx={{ zIndex: 40, position: 'fixed', width: '100%', height: '100%', top: 0, left: 0 }}
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
            zIndex: 100,
            width: 1,
            height: 65,
            backgroundColor: '#212B36',
            color: '#fff',
            padding: 1,
            px: 4,
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
              <span>{isMuted ? 'Unmute' : 'Mute'}</span>
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
              <span>{isVideoOn ? 'Camera Off' : 'Camera On'}</span>
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
                    ? 'material-symbols:screen-share'
                    : 'material-symbols:screen-share-off'
                }
              />
              <span>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
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
              <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
            </Button> */}
          </Stack>
          <Button
            variant="contained"
            color="error"
            sx={{ display: 'flex', gap: 1, padding: 1 }}
            onClick={endCall}
          >
            <Iconify width={23} icon="material-symbols:call-end-sharp" />
            <span>End Call</span>
          </Button>
        </Stack>
      </Dialog>
      <Dialog open={receivingCall && !callAccepted}>
        <div>
          <h3>Incoming Call...</h3>
          <button type="button" onClick={answerCall}>
            Answer
          </button>
        </div>
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