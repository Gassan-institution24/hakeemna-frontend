import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { SERVER_IP } from 'src/config-global';

const { useState, useRef, useEffect, useCallback } = require('react');
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
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);

    const router = useRouter();

    const myVideo = useRef(null);
    const userVideo = useRef(null);
    const connectionRef = useRef(null);

    const iceServers = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
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

    const callUser = (id) => {
        const peer = new RTCPeerConnection({ iceServers });

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
        const peer = new RTCPeerConnection({ iceServers });

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

        if (callerSignal) {
            peer
                .setRemoteDescription(new RTCSessionDescription(callerSignal))
                .then(() => peer.createAnswer())
                .then((answer) => peer.setLocalDescription(answer))
                .then(() => {
                    socket.emit('answerCall', { signal: peer.localDescription, to: caller });
                })
                .catch((err) => console.error('Error answering call:', err));

            connectionRef.current = peer;
        }
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

    const toggleScreenSharing = async () => {
        if (!isScreenSharing) {
            try {
                const currScreenStream = await navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true, // Ensure audio is also captured if needed
                });

                setScreenStream(currScreenStream);
                setIsScreenSharing(true);

                const screenTrack = currScreenStream.getVideoTracks()?.[0];
                const audioTrack = currScreenStream.getAudioTracks()?.[0];

                const peer = connectionRef.current;
                if (peer) {
                    const videoSender = peer.getSenders().find((s) => s.track?.kind === 'video');
                    const audioSender = peer.getSenders().find((s) => s.track?.kind === 'audio');

                    if (videoSender) {
                        await videoSender.replaceTrack(screenTrack);
                    } else {
                        peer.addTrack(screenTrack, currScreenStream);
                    }

                    if (audioTrack && audioSender) {
                        await audioSender.replaceTrack(audioTrack);
                    } else if (audioTrack) {
                        peer.addTrack(audioTrack, currScreenStream);
                    }

                    peer.onnegotiationneeded?.();
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
                const originalVideoTrack = stream.getVideoTracks()?.[0];
                const originalAudioTrack = stream.getAudioTracks()?.[0];

                const videoSender = peer.getSenders().find((s) => s.track?.kind === 'video');
                const audioSender = peer.getSenders().find((s) => s.track?.kind === 'audio');

                if (videoSender && originalVideoTrack) {
                    await videoSender.replaceTrack(originalVideoTrack);
                }

                if (audioSender && originalAudioTrack) {
                    await audioSender.replaceTrack(originalAudioTrack);
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

    const endCall = useCallback(() => {
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
        router.push(paths.dashboard.root);
    }, [caller, stream, screenStream, mediaRecorder, router]);

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) {
                    myVideo.current.srcObject = currentStream;
                }
            })
            .catch((err) => {
                console.error('Error accessing media devices:', err);
            });

        socket.on('callUser', ({ userId, from, signal }) => {
            if (user?._id === userId) {
                setReceivingCall(true);
                setCaller(from);
                setCallerSignal(signal);
            }
        });

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

        socket.on('endCall', () => {
            endCall();
        });

        return () => {
            if (callAccepted) {
                endCall();
            }
            socket.off('callUser');
            socket.off('callAccepted');
            socket.off('endCall');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id]);

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
        setReceivingCall,
        setCaller,
        setCallerSignal,
        connectionRef,
    };
};