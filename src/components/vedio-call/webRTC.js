import React, { useRef, useState, useEffect } from 'react';

import { Box, Stack, Button, Dialog } from '@mui/material';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from '../iconify';

const WebRTCComponent = () => {
  const { user } = useAuthContext();
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  useEffect(() => {
    // Get user media (video and audio)
    navigator?.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => console.error('Error accessing media devices:', err));

    // Listen for incoming calls
    socket.on('callUser', ({ userId, from, signal }) => {
      if (user?._id === userId) {
        setReceivingCall(true);
        setCaller(from);
        setCallerSignal(signal);
      }
    });

    // Listen for call acceptance
    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      const peer = connectionRef.current;
      if (peer) {
        peer
          .setRemoteDescription(new RTCSessionDescription(signal))
          .catch((err) => console.error('Failed to set remote description:', err));
      }
    });

    return () => {
      socket.off('callUser');
      socket.off('callAccepted');
    };
  }, [user?._id]);

  const callUser = (id) => {
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    if (stream) {
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('callUser', {
          userId: id,
          signalData: peer.localDescription,
        });
      }
    };

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    peer
      .createOffer()
      .then((offer) => peer.setLocalDescription(offer))
      .then(() => {
        socket.emit('callUser', {
          userId: id,
          signalData: peer.localDescription,
        });
      })
      .catch((err) => console.error('Error creating offer:', err));

    connectionRef.current = peer;
  };

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    if (stream) {
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('answerCall', { signal: peer.localDescription, to: caller });
      }
    };

    peer.ontrack = (event) => {
      if (userVideo.current) {
        userVideo.current.srcObject = event.streams[0];
      }
    };

    peer
      .setRemoteDescription(new RTCSessionDescription(callerSignal))
      .then(() => peer.createAnswer())
      .then((answer) => peer.setLocalDescription(answer))
      .then(() => {
        socket.emit('answerCall', { signal: peer.localDescription, to: caller });
      })
      .catch((err) => console.error('Error answering call:', err));

    connectionRef.current = peer;
  };

  const toggleMute = () => {
    if (stream) {
      const audioTracks = stream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOn(!isVideoOn);
    }
  };

  const startRecording = () => {
    if (stream) {
      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const downloadRecording = () => {
    const blob = new Blob(recordedChunks, { type: 'video/webm' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recording.webm';
    a.click();
    URL.revokeObjectURL(url);
  };

  const endCall = () => {
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setCallAccepted(false);
    setReceivingCall(false);
    setCaller('');
    setCallerSignal(null);
    setIdToCall('');
    setIsMuted(false);
    setIsVideoOn(true);
    setIsRecording(false);
    setMediaRecorder(null);
    setRecordedChunks([]);
  };

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
          <Button variant='outlined' sx={{ display: 'flex', gap: 1, padding: 1 }} onClick={isRecording ? stopRecording : startRecording}>
            <Iconify width={23} icon={isRecording ? "material-symbols:lens" : "material-symbols:lens-outline"} />
            <span>{isRecording ? 'Stop Recording' : 'Record'}</span>
          </Button>
          {recordedChunks.length > 0 && (
            <Button variant='outlined' sx={{ display: 'flex', gap: 1, padding: 1 }} onClick={downloadRecording}>
              <Iconify width={23} icon="material-symbols:download" />
              <span>Download Recording</span>
            </Button>
          )}
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