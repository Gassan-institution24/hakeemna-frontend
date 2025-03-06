import React from 'react';

import { Box, Stack, Button, Dialog } from '@mui/material';

import Iconify from '../iconify';
import { useWebRTC } from './use-web-rtc';

const WebRTCComponent = () => {
  const {
    receivingCall,
    callAccepted,
    idToCall,
    setIdToCall,
    isMuted,
    isVideoOn,
    isRecording,
    myVideo,
    userVideo,
    callUser,
    answerCall,
    toggleMute,
    toggleVideo,
    startRecording,
    stopRecording,
    endCall,
    toggleScreenSharing,
    isScreenSharing
  } = useWebRTC()

  return (
    <Dialog open fullScreen sx={{ display: 'flex', flexDirection: 'column' }}>
      {/* Local video */}
      <input
        type="text"
        placeholder="Enter ID to call"
        value={idToCall}
        onChange={(e) => setIdToCall(e.target.value)}
      />

      {/* Button to initiate a call */}
      <button type="button" onClick={() => callUser(idToCall)}>
        Call
      </button>

      {/* Incoming call UI */}
      {receivingCall && !callAccepted && (
        <div>
          <h3>Incoming Call...</h3>
          <button type="button" onClick={answerCall}>
            Answer
          </button>
        </div>
      )}
      <Box sx={{ flex: 1 }}>
        <Box sx={{ zIndex: 60, position: 'fixed', bottom: 70, right: 5, width: 300, height: 200, borderRadius: '10px', overflow: 'hidden', border: '3px solid #ccc' }}>
          {/* eslint-disable-next-line */}
          <video playsInline muted ref={myVideo} autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'black' }} />
        </Box>

        {/* Remote video */}
        {callAccepted && (
          <Box sx={{ zIndex: 40, position: 'fixed', width: '100%', height: '100%', top: 0, left: 0 }}>
            {/* eslint-disable-next-line */}
            <video playsInline ref={userVideo} autoPlay style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'black' }} />
          </Box>
        )}
      </Box>
      <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ zIndex: 100, width: 1, height: 65, backgroundColor: '#212B36', color: '#fff', padding: 1, px: 4 }}>
        <Stack direction='row' spacing={2}>
          <Button variant='outlined' sx={{ display: 'flex', gap: 1, padding: 1 }} onClick={toggleMute}>
            <Iconify width={23} icon={isMuted ? "material-symbols:mic-off" : "material-symbols:mic"} />
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </Button>
          <Button variant='outlined' sx={{ display: 'flex', gap: 1, padding: 1 }} onClick={toggleVideo}>
            <Iconify width={23} icon={isVideoOn ? "material-symbols:video-camera-front" : "material-symbols:video-camera-front-off"} />
            <span>{isVideoOn ? 'Camera Off' : 'Camera On'}</span>
          </Button>
          <Button
            variant="outlined"
            sx={{ display: 'flex', gap: 1, padding: 1 }}
            onClick={toggleScreenSharing}
          >
            <Iconify
              width={23}
              icon={isScreenSharing ? 'material-symbols:screen-share' : 'material-symbols:screen-share-off'}
            />
            <span>{isScreenSharing ? 'Stop Sharing' : 'Share Screen'}</span>
          </Button>
          <Button variant='outlined' sx={{ display: 'flex', gap: 1, padding: 1 }} onClick={isRecording ? stopRecording : startRecording}>
            <Iconify width={23} icon={isRecording ? "material-symbols:lens" : "material-symbols:lens-outline"} />
            <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
          </Button>
        </Stack>
        <Button variant='contained' color='error' sx={{ display: 'flex', gap: 1, padding: 1 }} onClick={endCall}>
          <Iconify width={23} icon="material-symbols:call-end-sharp" />
          <span>End Call</span>
        </Button>
      </Stack>
    </Dialog>
  );
};

export default WebRTCComponent;