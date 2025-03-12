import { SERVER_IP } from 'src/config-global';

const { useState, useRef, useEffect } = require('react');
const { useAuthContext } = require('src/auth/hooks');
const { default: socket } = require('src/socket');

export const useWebRTC = () => {
    
  const { user } = useAuthContext();
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callerSignal, setCallerSignal] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const connectionRef = useRef(null);

  const iceServers = [
    { urls: `stun:${SERVER_IP}:3478` },
    {
      urls: `turn:${SERVER_IP}:3478?transport=udp`,
      username: 'hakeemna',
      credential: 'Hakeemna360',
    },
    {
      urls: `turn:${SERVER_IP}:3478?transport=tcp`,
      username: 'hakeemna',
      credential: 'Hakeemna360',
    },
    {
      urls: `turns:${SERVER_IP}:5349?transport=tcp`,
      username: 'hakeemna',
      credential: 'Hakeemna360',
    },
  ];

  useEffect(() => {
    navigator.mediaDevices
      ?.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      })
      .catch((err) => {
        console.error('Error accessing media devices:', err);

        // If both video and audio are denied, try to get only video or only audio
        if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
          // Try to get video only
          navigator.mediaDevices
            ?.getUserMedia({ video: true, audio: false })
            .then((videoStream) => {
              setStream(videoStream);
              if (myVideo.current) {
                myVideo.current.srcObject = videoStream;
              }
            })
            .catch((videoErr) => {
              console.error('Error accessing video:', videoErr);

              // If video is denied, try to get audio only
              navigator.mediaDevices
                ?.getUserMedia({ video: false, audio: true })
                .then((audioStream) => {
                  setStream(audioStream);
                  if (myVideo.current) {
                    myVideo.current.srcObject = null; // No video, so clear the video element
                  }
                })
                .catch((audioErr) => {
                  console.error('Error accessing audio:', audioErr);
                });
            });
        }
      });

    // Listen for incoming calls
    socket.on('callUser', ({ userId, from, signal }) => {
      if (user?._id === userId) {
        setReceivingCall(true);
        setCaller(from);
        setCallerSignal(signal);
      }
    });

    // Listen for call acceptance
    socket.on('callAccepted', ({ signal, from }) => {
      setCallAccepted(true);
      setCaller(from);
      const peer = connectionRef.current;
      if (peer) {
        peer
          .setRemoteDescription(new RTCSessionDescription(signal))
          .catch((err) => console.error('Failed to set remote description:', err));
      }
    });

    // Listen for call end
    socket.on('endCall', () => {
      endCall();
    });

    return () => {
      endCall();
      socket.off('callUser');
      socket.off('callAccepted');
      socket.off('endCall');
    };
    // eslint-disable-next-line
  }, [user?._id]);

  const callUser = (id) => {
    const peer = new RTCPeerConnection(iceServers);

    if (stream) {
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE Candidate:', event.candidate);
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
    const peer = new RTCPeerConnection(iceServers);

    if (stream) {
      stream.getTracks().forEach((track) => peer.addTrack(track, stream));
    }

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('ICE Candidate:', event.candidate);
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
    console.log('stream', stream);
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

  const toggleScreenSharing = async () => {
    if (!isScreenSharing) {
      try {
        const currScreenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        setScreenStream(currScreenStream);
        setIsScreenSharing(true);

        const screenTrack = currScreenStream.getVideoTracks()[0];

        const peer = connectionRef.current;
        if (peer) {
          const sender = peer.getSenders().find((s) => s.track?.kind === 'video');
          if (sender) {
            await sender.replaceTrack(screenTrack);
          } else {
            peer.addTrack(screenTrack, currScreenStream);
            peer.onnegotiationneeded?.();
          }
        }

        screenTrack.onended = () => {
          toggleScreenSharing();
        };
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }
      setIsScreenSharing(false);
      setScreenStream(null);

      const peer = connectionRef.current;
      if (peer && stream) {
        const originalVideoTrack = stream.getVideoTracks()[0];
        const sender = peer.getSenders().find((s) => s.track?.kind === 'video');
        if (sender && originalVideoTrack) {
          await sender.replaceTrack(originalVideoTrack);
        }
      }
    }
  };

  const startRecording = async () => {
    try {
      const currScreenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { mediaSource: 'screen' },
        audio: true,
      });

      const recorder = new MediaRecorder(currScreenStream);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setRecordedChunks((prev) => [...prev, event.data]);
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      currScreenStream.getVideoTracks()[0].onended = () => {
        stopRecording();
      };

      setStream(currScreenStream);
    } catch (error) {
      console.error('Error starting screen recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'screen-recording.webm';
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [recordedChunks]);

  const endCall = () => {
    if (connectionRef.current) {
      connectionRef.current.close();
      connectionRef.current = null;
    }
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
    socket.emit('endCall', { to: caller });
    setCallAccepted(false);
    setReceivingCall(false);
    setCaller('');
    setCallerSignal(null);
    setIdToCall('');
    setIsMuted(false);
    setIsVideoOn(true);
    setIsRecording(false);
    setIsScreenSharing(false);
    setMediaRecorder(null);
    setRecordedChunks([]);
    setScreenStream(null);
  };

  return {
    stream,
    receivingCall,
    caller,
    callerSignal,
    callAccepted,
    idToCall,
    isMuted,
    isVideoOn,
    isRecording,
    isScreenSharing,
    myVideo,
    userVideo,
    callUser,
    answerCall,
    toggleMute,
    toggleVideo,
    toggleScreenSharing,
    startRecording,
    stopRecording,
    endCall,
    setIdToCall,
  };
};
