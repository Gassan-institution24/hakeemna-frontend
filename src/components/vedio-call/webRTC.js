/* eslint-disable consistent-return */
import io from 'socket.io-client';
// eslint-disable-next-line import/no-extraneous-dependencies
import DailyIframe from '@daily-co/daily-js';
import React, { useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function WebRTCComponent() {
  const [searchParams] = useSearchParams();
  const roomUrl = searchParams.get('roomUrl');
  const userName = searchParams.get('userName');
  const uniqueRoom = searchParams.get('uniqueRoom');
  const containerRef = useRef(null);
  const callFrameRef = useRef(null);
  const socketRef = useRef(null);
  const [callSeconds, setCallSeconds] = React.useState(0);
  const timerRef = useRef(null);
  const navigate = useNavigate();
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };
  const callStartedRef = useRef(false);
  const [callStarted, setCallStarted] = React.useState(false);

  useEffect(() => {
    if (!roomUrl || !userName || !containerRef.current || !uniqueRoom) return;

    // 1️⃣ socket مرة وحدة
    if (!socketRef.current) {
      socketRef.current = io(process.env.REACT_APP_API_URL);
    }

    const socket = socketRef.current;
    const role = searchParams.get('role');

    //  if patient listen to doctor-left-call    
    if (role === 'patient') {
      socket.on('doctor-left-call', ({ roomId }) => {

        if (roomId !== uniqueRoom) return;

        callFrameRef.current?.destroy();
        window.close();
      });
    }

    // 3️⃣ DailyIframe
    containerRef.current.innerHTML = '';


    const callFrame = DailyIframe.createFrame({
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: '0',
        position: 'absolute',
        top: 0,
      },
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
      // ❌ إذا المريض طلع → تجاهل الحدث
      if (role !== 'host') {
        console.log('👤 patient left → ignore');
        window.close();           

        return;
      }
      // ✅ فقط الدكتور هون
      console.log('👨‍⚕️ doctor left → end call');

      // ⏱️ احسب وقت المكالمة
      await fetch(`${process.env.REACT_APP_API_URL}/api/video-call`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: uniqueRoom }),
      });

      // 🔔 بلّغ المريض
      socket.emit('doctor-left-call', { roomId: uniqueRoom });

      clearInterval(timerRef.current);

      // 🚪 طلع الدكتور
      window.close();

    });


    callFrame.join({ url: roomUrl }).catch(console.error);

    // cleanup
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
            top: 145,
            right: 10,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(0, 128, 0, 0.15)', // أخضر خفيف
            color: '#00e676',                   // أخضر واضح
            padding: '6px 12px',
            borderRadius: 999,                  // pill shape
            fontSize: 14,
            fontWeight: 600,
            zIndex: 999,
            boxShadow: '0 0 8px rgba(0, 255, 0, 0.35)',
          }}
        >
          {/* 🟢 Green dot */}
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#00e676',
              boxShadow: '0 0 6px rgba(0, 255, 0, 0.8)',
            }}
          />

          {/* ⏱️ Timer */}
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
