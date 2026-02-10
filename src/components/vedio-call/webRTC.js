/* eslint-disable consistent-return */
import io from 'socket.io-client';
import DailyIframe from '@daily-co/daily-js';
import React, { useRef, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function WebRTCComponent() {
  const [searchParams] = useSearchParams();
  const roomUrl = searchParams.get('roomUrl');
  const userName = searchParams.get('userName');
  const uniqueRoom = searchParams.get('uniqueRoom');
  const containerRef = useRef(null);
  const callFrameRef = useRef(null);
  const socketRef = useRef(null);
  const [callSeconds, setCallSeconds] = useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const callStartedRef = useRef(false);
  const [callStarted, setCallStarted] = useState(false);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const getTimerBackground = (seconds) => {
    if (seconds < 600) return '#00e676';
    if (seconds < 1800) return 'rgba(255, 193, 7, 0.15)';
    return '#00e676';
  };

  useEffect(() => {
    if (!roomUrl || !userName || !containerRef.current || !uniqueRoom) return;

    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_API_URL);
    }
    const socket = socketRef.current;
    const role = searchParams.get('role');

    if (role === 'patient') {
      socket.on('doctor-left-call', ({ roomId }) => {
        if (roomId !== uniqueRoom) return;
        callFrameRef.current?.destroy();
        window.close();
      });
    }

    containerRef.current.innerHTML = '';

    const callFrame = DailyIframe.createFrame({
      iframeStyle: { width: '100%', height: '100%', border: '0', position: 'absolute', top: 0 },
      showFullscreenButton: true,
      showLeaveButton: true,
      userName,
    });

    callFrameRef.current = callFrame;
    if (callFrame.iframe instanceof Node) {
      containerRef.current.appendChild(callFrame.iframe);
    }

    socket.emit('get-call-start-time', { roomId: uniqueRoom });

    callFrame.on('joined-meeting', () => {
      if (role === 'host' && !callStartedRef.current) {
        callStartedRef.current = true;
        socket.emit('call-started', {
          roomId: uniqueRoom,
          startTime: Date.now(),
        });
      }
    });

    socket.on('call-started', ({ roomId, startTime }) => {
      if (roomId !== uniqueRoom) return;
      setCallStarted(true);
      clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        const seconds = Math.floor((Date.now() - startTime) / 1000);
        setCallSeconds(seconds);
      }, 1000);
    });

    callFrame.on('left-meeting', async () => {
      clearInterval(timerRef.current);

      if (role !== 'host') {
        window.close();
        return;
      }

      await fetch(`${process.env.REACT_APP_API_URL}/api/video-call`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: uniqueRoom }),
      });

      socket.emit('doctor-left-call', { roomId: uniqueRoom });
      window.close();
    });

    callFrame.join({ url: roomUrl }).catch(console.error);

    return () => {
      socket.off('doctor-left-call');
      socket.off('call-started');
      clearInterval(timerRef.current);
      callFrame.destroy();
    };
  }, [roomUrl, userName, uniqueRoom, searchParams, navigate]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* ⏱️ Call Timer */}
      {callStarted && (
        <div
          style={{
            position: 'absolute',
            top: 50,
            right: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: getTimerBackground(callSeconds),
            color: '#000',
            padding: '6px 12px',
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 600,
            zIndex: 999,
            boxShadow: '0 0 8px rgba(0,0,0,0.15)',
          }}
        >
          <span>{formatTime(callSeconds)}</span>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          minHeight: 400,
        }}
      />
    </div>
  );
}
