import { Peer } from 'peerjs';
import PropTypes from 'prop-types';
import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';

import { WebRTCContext } from './web-rtc-context';

export const WebRTCProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [stream, setStream] = useState(null);
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

  const router = useRouter();

  const myVideo = useRef(null);
  const userVideo = useRef(null);
  const callRef = useRef(null);
  const audioTrackRef = useRef(null);

  // Initialize PeerJS instance
  useEffect(() => {
    if (user?._id && !peerInstance) {
      const peer = new Peer(`${user._id}-hakeemna`);
      peer.on('open', (id) => {
        // eslint-disable-next-line
        // console.log('My peer ID from open is: ' + id);
      });

      peer.on('error', (err) => {
        // console.error('PeerJS error:', err);
      });

      peer.on('call', (incomingCall) => {
        callRef.current = incomingCall;
        setReceivingCall(true);
        setCaller(incomingCall.peer);
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

    // Notify the other user that call has ended
    socket.emit('endCall', { to: caller });

    // if (callAccepted) {
    //   router.replace(paths.dashboard.root);
    // }
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
          } catch (error) {
            console.log(error);
          }
        }
      }

      if (!peerInstance || !socket || !currStream) return;

      // Make the call with PeerJS
      const call = peerInstance.call(`${id}-hakeemna`, currStream);

      if (!call) return;

      call.on('stream', (remoteStream) => {
        if (userVideo.current) {
          userVideo.current.srcObject = remoteStream;
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
    [peerInstance, user?._id, user?.userName, userVideo, endCall]
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
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (!callRef.current || !currStream) return;

    setCallAccepted(true);
    callRef.current.answer(currStream);
    callRef.current.on('stream', (remoteStream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = remoteStream;
      }
    });
    socket.emit('answerCall', { to: caller });
  }, [callRef, userVideo, caller]);

  const toggleMute = useCallback(() => {
    if (!stream) return;

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    const track = audioTracks[0];
    const currIsMuted = !track.enabled; // Invert the current state

    // Toggle the enabled state of the track
    track.enabled = currIsMuted;

    setIsMuted(!currIsMuted); // Update the mute state in your app UI

    // If there's an active call, replace the track
    if (callRef.current?.peerConnection) {
      const senders = callRef.current.peerConnection.getSenders();
      const audioSender = senders.find((s) => s.track?.kind === 'audio');

      if (audioSender) {
        if (currIsMuted) {
          // If unmuting, replace the track with the original audio track
          audioSender.replaceTrack(track);
        } else {
          // If muting, replace the track with null to stop audio transmission
          audioSender.replaceTrack(null);
        }
      }
    }
  }, [stream]);

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTracks = stream.getVideoTracks();
      myVideo.current.srcObject = stream;
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
  }, [stream]);

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
        myVideo.current.srcObject = currScreenStream;
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
        myVideo.current.srcObject = stream;

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
    ]
  );
  return <WebRTCContext.Provider value={memoizedValue}>{children}</WebRTCContext.Provider>;
};

WebRTCProvider.propTypes = { children: PropTypes.node };
