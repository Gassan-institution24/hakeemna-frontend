import React, { useRef, useState, useEffect } from 'react';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';

const WebRTCComponent = () => {
  const { user } = useAuthContext();
  const [stream, setStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');

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

  return (
    <div>
      {/* Local video */}
      {/* eslint-disable-next-line */}
      <video playsInline muted ref={myVideo} autoPlay style={{ width: '300px' }} />

      {/* Remote video */}
      {callAccepted && (
        // eslint-disable-next-line
        <video playsInline ref={userVideo} autoPlay style={{ width: '300px' }} />
      )}

      {/* Input to enter ID to call */}
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
    </div>
  );
};

export default WebRTCComponent;
