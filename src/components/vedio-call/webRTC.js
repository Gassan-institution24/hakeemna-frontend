// eslint-disable-next-line import/no-extraneous-dependencies
import DailyIframe from '@daily-co/daily-js';
import React, { useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function WebRTCComponent() {
  const [searchParams] = useSearchParams();
  const roomUrl = searchParams.get('roomUrl');
  const userName = searchParams.get('userName');
  const containerRef = useRef(null);
  const callFrameRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (!roomUrl || !userName || !containerRef.current) return;

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

    callFrame.on('left-meeting', () => {
      console.log('👋 User left the call');
      navigate(-1);
    });

    callFrame.join({ url: roomUrl }).catch(console.error);

    // eslint-disable-next-line consistent-return
    return () => {
      callFrame.leave();
      callFrame.destroy();
    };
  }, [roomUrl, navigate, userName]);

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
// Duplicate DailyIframe instances are not allowed
