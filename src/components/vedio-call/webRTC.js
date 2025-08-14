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

  const navigate = useNavigate();

  useEffect(() => {
    if (!roomUrl || !userName || !containerRef.current || !uniqueRoom) return;

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
      try {
        const roomName = uniqueRoom;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/video-call`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: roomName,
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.message || 'Failed to update video call');
        }

        const updatedCall = await response.json();
        console.log('✅ Call end time updated in DB:', updatedCall);
      } catch (err) {
        console.error('❌ Error updating call end time:', err);
      }
      navigate(-1);
    });

    callFrame.join({ url: roomUrl }).catch(console.error);

    // eslint-disable-next-line consistent-return
    return () => {
      callFrame.leave();
      callFrame.destroy();
    };
  }, [roomUrl, navigate, userName, uniqueRoom]);

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
