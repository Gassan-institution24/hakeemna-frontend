import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-extraneous-dependencies
import DailyIframe from '@daily-co/daily-js';
import React, { useRef, useEffect, useState } from 'react';
import { Button, Stack } from '@mui/material';

export default function WebRTCComponent({ roomUrl }) {
  const containerRef = useRef(null);
  const callFrameRef = useRef(null);
  const [callActive, setCallActive] = useState(false);

  useEffect(() => {
    if (!roomUrl || !containerRef.current) return;

    containerRef.current.innerHTML = '';

    const callFrame = DailyIframe.createFrame({
      iframeStyle: {
        width: '100%',
        height: '100%',
        border: '0',
        borderRadius: '12px',
      },
    });

    // احتفظ بالإطار في ref
    callFrameRef.current = callFrame;

    // أضف iframe
    if (callFrame.iframe instanceof Node) {
      containerRef.current.appendChild(callFrame.iframe);
    }

    callFrame.join({ url: roomUrl })
      .then(() => setCallActive(true))
      .catch(console.error);

    // eslint-disable-next-line consistent-return
    return () => {
      callFrame.leave();
      callFrame.destroy();
      setCallActive(false);
    };
  }, [roomUrl]);

  const handleLeave = () => {
    if (callFrameRef.current) {
      callFrameRef.current.leave();
      callFrameRef.current.destroy();
      callFrameRef.current = null;
      setCallActive(false);
    }
  };

  return (
    <Stack spacing={2}>
      <div ref={containerRef} style={{ width: '100%', height: '300px' }} />
      {callActive && (
        <Button variant="contained" color="error" onClick={handleLeave}>
          إنهاء المكالمة
        </Button>
      )}
    </Stack>
  );
}

WebRTCComponent.propTypes = {
  roomUrl: PropTypes.string.isRequired,
};
