import React, { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import socket from "src/socket";

const WebRTCComponent = () => {
    const [stream, setStream] = useState(null);
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState("");
    const [callerSignal, setCallerSignal] = useState(null);
    const [callAccepted, setCallAccepted] = useState(false);
    const [peerId, setPeerId] = useState("");

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    useEffect(() => {
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then((currentStream) => {
                setStream(currentStream);
                myVideo.current.srcObject = currentStream;
            });

        socket.on("callUser", ({ from, signal }) => {
            setReceivingCall(true);
            setCaller(from);
            setCallerSignal(signal);
        });

        socket.on("getId", (id) => {
            setPeerId(id);
        });

        return () => {
            socket.off("callUser");
            socket.off("getId");
        };
    }, []);

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream });
        peer.on("signal", (data) => {
            socket.emit("callUser", { userToCall: id, signalData: data, from: peerId });
        });

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        socket.on("callAccepted", (signal) => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({ initiator: false, trickle: false, stream });

        peer.on("signal", (data) => {
            socket.emit("answerCall", { signal: data, to: caller });
        });

        peer.on("stream", (currentStream) => {
            userVideo.current.srcObject = currentStream;
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    };

    return (
        <div>
            <h3>Your ID: {peerId}</h3>

            {/* Fix: Disable a11y warning for missing captions */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video playsInline muted ref={myVideo} autoPlay style={{ width: "300px" }} />

            {/* Fix: Disable a11y warning for missing captions */}
            {callAccepted && (
                /* eslint-disable-next-line jsx-a11y/media-has-caption */
                <video playsInline ref={userVideo} autoPlay style={{ width: "300px" }} />
            )}

            <input
                type="text"
                placeholder="Enter ID to call"
                onChange={(e) => setPeerId(e.target.value)}
            />

            {/* Fix: Add type="button" to prevent default form behavior */}
            <button type="button" onClick={() => callUser(peerId)}>Call</button>

            {receivingCall && !callAccepted && (
                <div>
                    <h3>Incoming Call...</h3>
                    {/* Fix: Add type="button" to prevent default form behavior */}
                    <button type="button" onClick={answerCall}>Answer</button>
                </div>
            )}
        </div>
    );
};

export default WebRTCComponent;
