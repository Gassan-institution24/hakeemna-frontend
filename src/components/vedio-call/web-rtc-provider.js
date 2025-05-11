import { Peer } from 'peerjs';
import PropTypes from 'prop-types';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { useRouter } from 'src/routes/hooks';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';

import { WebRTCContext } from './web-rtc-context';

export const WebRTCProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState('');
  const [callAccepted, setCallAccepted] = useState(false);
  const [idToCall, setIdToCall] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [peerInstance, setPeerInstance] = useState(null);

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const myVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const callRef = useRef(null);
  const audioTrackRef = useRef(null);

  // Initialize PeerJS instance
  useEffect(() => {
    if (user?._id && !peerInstance) {
      const peer = new Peer(`${user._id}-hakeemna`, {
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
          ],
        },
      });
      peer.on('open', (id) => {
        // eslint-disable-next-line
      });

      peer.on('error', (err) => {
        console.error('PeerJS error:', err);
      });

      peer.on('call', (incomingCall) => {
        callRef.current = incomingCall;
        setReceivingCall(true);
        // setCaller(incomingCall.peer);
      });

      setPeerInstance(peer);
    }

    return () => {
      if (peerInstance) {
        peerInstance.destroy();
      }
    };
    // eslint-disable-next-line
  }, [user?._id]);

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

    return () => {
      //   if (stream) {
      //     stream.getTracks().forEach((track) => track.stop());
      //   }

      socket.off('endCall');
      socket.off('cancelCall');
      socket.off('callAccepted');

      if (callAccepted) {
        endCall();
      }
    };
    // eslint-disable-next-line
  }, []);

  const endCall = useCallback(() => {
    if (callRef.current) {
      callRef.current.close();
      callRef.current = null;
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => track.stop());
    }

    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
    }

    socket.emit('endCall', { to: caller });
    // Notify the other user that call has ended

    // Reset all states
    setCallAccepted(false);
    setReceivingCall(false);
    setIsCalling(false);
    setCaller('');
    setIdToCall('');
    setIsMuted(false);
    setIsVideoOn(true);
    setIsRecording(false);
    setIsScreenSharing(false);
    setMediaRecorder(null);
    setRecordedChunks([]);
    setScreenStream(null);
    setStream(null);

    // Redirect to dashboard
  }, [caller, stream, screenStream, mediaRecorder]);

  const callUser = useCallback(
    async (id) => {
      let currStream;
      try {
        const currentStream = await navigator.mediaDevices?.getUserMedia({
          video: true,
          audio: true,
        });
        const videoTracks = currentStream.getVideoTracks();
        if (videoTracks.length > 0) {
          videoTracks[0].enabled = false;
        }
        setStream(currentStream);
        currStream = currentStream;
        const audioTracks = currentStream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioTrackRef.current = audioTracks[0];
        }

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = currentStream;
        }
      } catch (err) {
        try {
          const currentStream = await navigator.mediaDevices?.getUserMedia({
            video: false,
            audio: true,
          });
          setStream(currentStream);
          currStream = currentStream;

          // Store a reference to the audio track
          const audioTracks = currentStream.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTrackRef.current = audioTracks[0];
          }

          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = currentStream;
          }
        } catch (erro) {
          try {
            const currentStream = await navigator.mediaDevices?.getUserMedia({
              video: true,
              audio: false,
            });
            const videoTracks = currentStream.getVideoTracks();
            if (videoTracks.length > 0) {
              videoTracks[0].enabled = false;
            }
            setStream(currentStream);
            currStream = currentStream;

            // Store a reference to the audio track
            const audioTracks = currentStream.getAudioTracks();
            if (audioTracks.length > 0) {
              audioTrackRef.current = audioTracks[0];
            }

            if (myVideo.current) {
              myVideo.current.srcObject = currentStream;
            }
            if (myVideoRef.current) {
              myVideoRef.current.srcObject = currentStream;
            }
          } catch (error) {
            console.log(error);
          }
        }
      }

      if (!peerInstance || !socket || !currStream) return;

      // Make the call with PeerJS
      const call = peerInstance.call(`${id}-hakeemna`, currStream);

      if (!call) return;

      call.on('stream', (curremoteStream) => {
        setRemoteStream(curremoteStream);
        if (userVideo.current) {
          userVideo.current.srcObject = curremoteStream;
        }
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = curremoteStream;
        }
      });

      call.on('close', () => {
        endCall();
      });

      // Notify the user about the call via socket
      socket.emit('callUser', { userId: id, from: user?._id, userName: user?.userName });

      setIsCalling(true);

      callRef.current = call;
    },
    [peerInstance, user?._id, user?.userName, userVideo, userVideoRef, endCall]
  );

  const answerCall = useCallback(async () => {
    let currStream;
    try {
      const currentStream = await navigator.mediaDevices?.getUserMedia({
        video: true,
        audio: true,
      });
      const videoTracks = currentStream.getVideoTracks();
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = false;
      }
      setStream(currentStream);
      currStream = currentStream;
      const audioTracks = currentStream.getAudioTracks();
      if (audioTracks.length > 0) {
        audioTrackRef.current = audioTracks[0];
      }

      if (myVideo.current) {
        myVideo.current.srcObject = currentStream;
      }
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = currentStream;
      }
    } catch (err) {
      try {
        const currentStream = await navigator.mediaDevices?.getUserMedia({
          video: false,
          audio: true,
        });
        setStream(currentStream);
        currStream = currentStream;

        // Store a reference to the audio track
        const audioTracks = currentStream.getAudioTracks();
        if (audioTracks.length > 0) {
          audioTrackRef.current = audioTracks[0];
        }

        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = currentStream;
        }
      } catch (erro) {
        try {
          const currentStream = await navigator.mediaDevices?.getUserMedia({
            video: true,
            audio: false,
          });
          const videoTracks = currentStream.getVideoTracks();
          if (videoTracks.length > 0) {
            videoTracks[0].enabled = false;
          }
          setStream(currentStream);
          currStream = currentStream;

          // Store a reference to the audio track
          const audioTracks = currentStream.getAudioTracks();
          if (audioTracks.length > 0) {
            audioTrackRef.current = audioTracks[0];
          }

          if (myVideo.current) {
            myVideo.current.srcObject = currentStream;
          }
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = currentStream;
          }
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (!callRef.current || !currStream) return;

    setCallAccepted(true);
    callRef.current.answer(currStream);
    callRef.current.on('stream', (curRemoteStream) => {
      setRemoteStream(curRemoteStream);
      if (userVideo.current) {
        userVideo.current.srcObject = curRemoteStream;
      }
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = curRemoteStream;
      }
    });
    socket.emit('answerCall', { to: caller });
  }, [callRef, userVideo, userVideoRef, caller]);

  const toggleMute = useCallback(() => {
    try {
      if (!stream) throw new Error('No stream available');

      const track = audioTrackRef.current;
      if (!track) throw new Error('No audio track available');

      const newMuteState = !track.enabled;
      track.enabled = newMuteState;
      setIsMuted(!newMuteState);

      // Update peer connection
      if (callRef.current?.peerConnection) {
        const senders = callRef.current.peerConnection.getSenders();
        const audioSender = senders.find((s) => s.track?.kind === 'audio');
        if (audioSender?.track) {
          audioSender.track.enabled = newMuteState;
        }
      }
    } catch (error) {
      console.error('Error in toggleMute:', error);
    }
  }, [stream]);

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      if (myVideo.current) {
        myVideo.current.srcObject = stream;
      }
      if (myVideoRef.current) {
        myVideoRef.current.srcObject = stream;
      }
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = remoteStream;
      }
      if (videoTracks.length > 0) {
        videoTracks[0].enabled = !videoTracks[0].enabled;
        setIsVideoOn(videoTracks[0].enabled);

        if (callRef.current && callRef.current.peerConnection) {
          const senders = callRef.current.peerConnection.getSenders();
          const videoSender = senders.find((s) => s.track && s.track.kind === 'video');
          if (videoSender && videoSender.track) {
            videoSender.track.enabled = videoTracks[0].enabled;
          }
        }
      }
    }
  }, [stream, remoteStream]);

  const toggleScreenSharing = useCallback(async () => {
    if (!isScreenSharing) {
      try {
        // Start screen sharing
        const currScreenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });

        // Listen for the "ended" event on the video track
        const videoTrack = currScreenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
          // Handle stopping screen sharing
          setIsScreenSharing(false);
          setScreenStream(null);

          // Switch back to the camera stream
          if (stream) {
            myVideo.current.srcObject = stream;
            myVideoRef.current.srcObject = stream;

            // Replace the track in the peer connection
            if (callRef.current && callRef.current.peerConnection) {
              const senders = callRef.current.peerConnection.getSenders();
              const videoSender = senders.find((s) => s.track?.kind === 'video');

              if (videoSender) {
                videoSender.replaceTrack(stream.getVideoTracks()[0]);
              }
            }
          }
        };

        // Update state and UI
        if (myVideo.current) {
          myVideo.current.srcObject = currScreenStream;
        }
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = currScreenStream;
        }
        setScreenStream(currScreenStream);
        setIsScreenSharing(true);

        // Replace the video track in the peer connection
        if (callRef.current) {
          const call = callRef.current;
          if (call.peerConnection) {
            const senders = call.peerConnection.getSenders();
            const videoSender = senders.find((s) => s.track?.kind === 'video');

            if (videoSender) {
              videoSender.replaceTrack(videoTrack);
            }
          }
        }
      } catch (error) {
        console.error('Error sharing screen:', error);
      }
    } else {
      // Stop screen sharing manually
      if (screenStream) {
        screenStream.getTracks().forEach((track) => track.stop());
      }

      // Switch back to the camera stream
      if (stream) {
        if (myVideo.current) {
          myVideo.current.srcObject = stream;
        }
        if (myVideoRef) {
          myVideoRef.current.srcObject = stream;
        }

        // Replace the track in the peer connection
        if (callRef.current && callRef.current.peerConnection) {
          const senders = callRef.current.peerConnection.getSenders();
          const videoSender = senders.find((s) => s.track?.kind === 'video');

          if (videoSender) {
            videoSender.replaceTrack(stream.getVideoTracks()[0]);
          }
        }
      }

      setIsScreenSharing(false);
      setScreenStream(null);
    }
  }, [isScreenSharing, screenStream, stream, callRef, myVideo]);

  const refreshStream = useCallback(() => {
    if (myVideo.current) {
      if (screenStream) {
        myVideo.current.srcObject = screenStream;
      } else {
        myVideo.current.srcObject = stream;
      }
    }
    if (myVideoRef.current) {
      if (screenStream) {
        myVideoRef.current.srcObject = screenStream;
      } else {
        myVideoRef.current.srcObject = stream;
      }
    }
    if (userVideo.current) {
      userVideo.current.srcObject = remoteStream;
    }
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = remoteStream;
    }
  }, [stream, remoteStream, screenStream]);

  // const stopRecording = useCallback(() => {
  //     if (mediaRecorder) {
  //         mediaRecorder.stop();
  //         setIsRecording(false);
  //     }
  // }, [mediaRecorder]);

  // const startRecording = useCallback(async () => {
  //     try {
  //         const currScreenStream = await navigator.mediaDevices.getDisplayMedia({
  //             video: { mediaSource: "screen" },
  //             audio: true,
  //         });

  //         const recorder = new MediaRecorder(currScreenStream);

  //         recorder.ondataavailable = (event) => {
  //             if (event.data.size > 0) {
  //                 setRecordedChunks((prev) => [...prev, event.data]);
  //             }
  //         };

  //         recorder.start();
  //         setMediaRecorder(recorder);
  //         setIsRecording(true);

  //         currScreenStream.getVideoTracks()[0].onended = () => {
  //             stopRecording();
  //         };
  //     } catch (error) {
  //         console.error("Error starting screen recording:", error);
  //     }
  // }, [setMediaRecorder, setIsRecording, setRecordedChunks, stopRecording]);

  // useEffect(() => {
  //     if (recordedChunks.length > 0) {
  //         const blob = new Blob(recordedChunks, { type: "video/webm" });
  //         const url = URL.createObjectURL(blob);
  //         const a = document.createElement("a");
  //         a.href = url;
  //         a.download = `${Date.now().toString().slice(0, 10)}-recording.webm`;
  //         document.body.appendChild(a);
  //         a.click();
  //         document.body.removeChild(a);
  //         URL.revokeObjectURL(url);
  //         setRecordedChunks([]);
  //     }
  // }, [recordedChunks]);

  // const registerRefs = useCallback(
  //   ({ myVideoRef, userVideoRef }) => {
  //     if (myVideoRef.current && userVideoRef.current && stream && remoteStream) {
  //       myVideoRef.current.srcObject = stream;
  //       userVideoRef.current.srcObject = remoteStream;
  //     }
  //   },
  //   [stream, remoteStream]
  // );

  const onCancelCall = useCallback(() => {
    socket.emit('cancelCall', { to: caller });
    setReceivingCall(false);
    setIsCalling(false);
    // router.replace(paths.dashboard.root);
  }, [caller]);

  const memoizedValue = useMemo(
    () => ({
      stream,
      receivingCall,
      caller,
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
      // startRecording,
      // stopRecording,
      endCall,
      setIdToCall,
      setCallAccepted,
      setReceivingCall,
      setCaller,
      audioTrackRef,
      setStream,
      connectionRef: callRef,
      onCancelCall,
      isCalling,
      setIsCalling,
      myVideoRef,
      userVideoRef,
      refreshStream,
    }),
    [
      stream,
      receivingCall,
      caller,
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
      setCallAccepted,
      // startRecording,
      // stopRecording,
      endCall,
      setIdToCall,
      setReceivingCall,
      setCaller,
      audioTrackRef,
      setStream,
      callRef,
      onCancelCall,
      isCalling,
      setIsCalling,
      myVideoRef,
      userVideoRef,
      refreshStream,
    ]
  );
  return <WebRTCContext.Provider value={memoizedValue}>{children}</WebRTCContext.Provider>;
};

WebRTCProvider.propTypes = {
  children: PropTypes.node,
};
