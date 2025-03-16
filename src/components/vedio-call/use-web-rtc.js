import { Peer } from "peerjs";
import { useState, useRef, useEffect, useCallback } from "react";
import { useAuthContext } from "src/auth/hooks";
import { useRouter } from "src/routes/hooks";
import { paths } from "src/routes/paths";
import socket from "src/socket";

export const useWebRTC = () => {
    const { user } = useAuthContext();
    const [stream, setStream] = useState(null);
    const [screenStream, setScreenStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState('');
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOn, setIsVideoOn] = useState(true);
    const [isRecording, setIsRecording] = useState(false);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [peerInstance, setPeerInstance] = useState(null);

    const router = useRouter();

    const myVideo = useRef(null);
    const userVideo = useRef(null);
    const callRef = useRef(null);

    // Initialize PeerJS instance
    useEffect(() => {
        if (user?._id && !peerInstance) {
            const peer = new Peer(user._id, {
                // host: '/', // Change to your PeerJS server host
                // port: '3001', // Change to your PeerJS server port
                // path: '/peerjs',
                // debug: 3
            });

            peer.on('open', (id) => {
                // eslint-disable-next-line
                console.log('My peer ID is: ' + id);
            });

            peer.on('error', (err) => {
                console.error('PeerJS error:', err);
            });

            // Handle incoming calls
            peer.on('call', (incomingCall) => {
                setReceivingCall(true);
                setCaller(incomingCall.peer);

                // Store the call reference to answer later
                callRef.current = incomingCall;
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
        navigator.mediaDevices
            ?.getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
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

    const callUser = (id) => {
        if (!peerInstance || !stream) return;

        // Notify the user about the call via socket
        socket.emit("callUser", {
            userId: id,
            from: user?._id
        });

        // Make the call with PeerJS
        const call = peerInstance.call(id, stream);

        call.on('stream', (remoteStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = remoteStream;
            }
        });

        call.on('close', () => {
            endCall();
        });

        callRef.current = call;
    };

    const answerCall = () => {
        if (!callRef.current || !stream) return;

        setCallAccepted(true);

        // Answer the call with our media stream
        callRef.current.answer(stream);

        // Listen for their stream
        callRef.current.on('stream', (remoteStream) => {
            if (userVideo.current) {
                userVideo.current.srcObject = remoteStream;
            }
        });

        // Notify the caller that we've accepted via socket
        socket.emit("answerCall", {
            to: caller,
        });
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
                    audio: true,
                });

                setScreenStream(currScreenStream);
                setIsScreenSharing(true);

                if (callRef.current) {
                    // Replace the video track with screen sharing track
                    const videoTrack = currScreenStream.getVideoTracks()[0];

                    // Get the current senders
                    const call = callRef.current;
                    if (call.peerConnection) {
                        const senders = call.peerConnection.getSenders();
                        const videoSender = senders.find((s) => s.track && s.track.kind === "video");

                        if (videoSender) {
                            videoSender.replaceTrack(videoTrack);
                        }
                    }
                }
            } catch (error) {
                console.error("Error sharing screen:", error);
            }
        } else {
            if (screenStream) {
                screenStream.getTracks().forEach((track) => track.stop());
            }
            setIsScreenSharing(false);
            setScreenStream(null);

            if (callRef.current && stream) {
                // Replace back with camera video track
                const videoTrack = stream.getVideoTracks()[0];

                const call = callRef.current;
                if (call.peerConnection) {
                    const senders = call.peerConnection.getSenders();
                    const videoSender = senders.find((s) => s.track && s.track.kind === "video");

                    if (videoSender) {
                        videoSender.replaceTrack(videoTrack);
                    }
                }
            }
        }
    };

    const startRecording = async () => {
        try {
            const currScreenStream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: "screen" },
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
        } catch (error) {
            console.error("Error starting screen recording:", error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    useEffect(() => {
        if (recordedChunks.length > 0) {
            const blob = new Blob(recordedChunks, { type: "video/webm" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "screen-recording.webm";
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setRecordedChunks([]);
        }
    }, [recordedChunks]);

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

        if (mediaRecorder && mediaRecorder.state !== "inactive") {
            mediaRecorder.stop();
        }

        // Notify the other user that call has ended
        socket.emit("endCall", { to: caller });

        // Reset all states
        setCallAccepted(false);
        setReceivingCall(false);
        setCaller("");
        setIdToCall("");
        setIsMuted(false);
        setIsVideoOn(true);
        setIsRecording(false);
        setIsScreenSharing(false);
        setMediaRecorder(null);
        setRecordedChunks([]);
        setScreenStream(null);

        // Redirect to dashboard
        router.push(paths.dashboard.root);
    }, [caller, stream, screenStream, mediaRecorder, router]);

    return {
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
        startRecording,
        stopRecording,
        endCall,
        setIdToCall,
        setReceivingCall,
        setCaller,
        connectionRef: callRef,
    };
};