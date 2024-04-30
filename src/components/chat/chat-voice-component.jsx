import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import { Stack } from '@mui/system';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

export default function VoiceChat({ onCancel, onSend, src, sx }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);

  const handlePlayPause = () => {
    const audioPlayer = document.getElementById('player');
    if (audioPlayer && audioPlayer.paused) {
      audioPlayer.play();
      setIsPlaying(true);
    } else if (audioPlayer) {
      audioPlayer.pause();
      setIsPlaying(false);
    }
  };
  // eslint-disable-next-line
  useEffect(() => {
    const audioPlayer = document.getElementById('player');
    console.log('audioPlayer', audioPlayer);
    console.log('audioPlayer', audioPlayer.duration);

    const handleAudioEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audioPlayer.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audioPlayer.duration);
      setLoading(false); // Set loading to false when metadata is loaded
    };

    if (audioPlayer) {
      audioPlayer.addEventListener('ended', handleAudioEnded);
      audioPlayer.addEventListener('timeupdate', handleTimeUpdate);
      audioPlayer.addEventListener('loadedmetadata', handleLoadedMetadata);
      return () => {
        audioPlayer.removeEventListener('ended', handleAudioEnded);
        audioPlayer.removeEventListener('timeupdate', handleTimeUpdate);
        audioPlayer.removeEventListener('loadedmetadata', handleLoadedMetadata);
      };
    }
  }, []);

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2 }}>
      {/* <IconButton sx={{ color: 'error.main' }} onClick={onCancel}> */}
      <Iconify
        sx={{ color: 'error.main', mr: 1, cursor: 'pointer' }}
        onClick={onCancel}
        icon="mdi:trash"
      />
      {/* </IconButton> */}
      <audio controls id="player" src={src}>
        <track kind="captions" />
      </audio>
      {/* <Stack direction='row' justifyContent='space-between' alignItems='center'>
                {isPlaying ? (
                    <Iconify icon='iconoir:pause-solid' onClick={handlePlayPause} />
                ) : (
                    <Iconify icon='solar:play-bold' onClick={handlePlayPause} />
                )}
                <LinearProgress color='info'
                    variant="buffer"
                    value={currentTime}
                    valueBuffer={duration}
                    sx={{ width: 200 }} />
                {currentTime}{'----'}
                {!loading && duration}
            </Stack> */}
      {/* <IconButton sx={{ color: 'success.main' }} onClick={onSend}> */}
      <Iconify
        sx={{ color: 'success.main', ml: 1, cursor: 'pointer' }}
        onClick={onSend}
        icon="streamline:mail-send-email-message-solid"
      />
      {/* </IconButton> */}
    </Stack>
  );
}

VoiceChat.propTypes = {
  onCancel: PropTypes.func,
  onSend: PropTypes.func,
  src: PropTypes.string,
  sx: PropTypes.object,
};
