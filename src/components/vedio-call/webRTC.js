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

  const navigate = useNavigate();

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

    callFrame.on('left-meeting', async () => {
      // ❌ إذا المريض طلع → تجاهل الحدث
      if (role !== 'host') {
        console.log('👤 patient left → ignore');
        window.close();           // 🔥 المطلوب

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


      // 🚪 طلع الدكتور
      window.close();

    });


    callFrame.join({ url: roomUrl }).catch(console.error);

    // cleanup
    return () => {
      socket.off('doctor-left-call');
      callFrame.destroy();
    };
  }, [roomUrl, userName, uniqueRoom, searchParams, navigate]);
  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: 400,
        flex: 1,
      }}
    />
  );
}
