import PropTypes from 'prop-types';
import { useState } from 'react';
import ReactPlayer from 'react-player';

import { Card, IconButton, LinearProgress, Stack } from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';

export default function VoiceChat({ onCancel, onSend, src, sx }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [loadedSeconds, setLoadedSeconds] = useState(0);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState(null);

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleProgress = (state) => {
    setPlayedSeconds(state.playedSeconds);
    // setLoadedSeconds(state.loadedSeconds);
    setDuration(state.loadedSeconds);
  };

  const handleError = (err) => {
    setError(err);
    // Send the error to the parent component or perform any necessary actions
  };

  return (
    <Card sx={{ px: 2, py: 1, backgroundColor: 'info.lighter', width: 1 }}>
      {/* <IconButton onClick={onCancel}>
        <Pause sx={{ color: 'error.main' }} />
      </IconButton> */}
      <ReactPlayer
        url={src}
        playing={isPlaying}
        onProgress={handleProgress}
        onDuration={(d) => setLoadedSeconds(d)}
        onEnded={() => {
          setIsPlaying(false)
          // setPlayedSeconds(0)
        }}
        onError={handleError}
        width={0}
        height={0}
        style={{ display: 'none' }}
      />
      <Stack direction="row" justifyContent="space-between" gap={2} alignItems="center">
        {isPlaying ? (
          <Pause onClick={handlePlayPause} />
        ) : (
          <PlayArrow onClick={handlePlayPause} />
        )}
        {/* <LinearProgress
          color="info"
          variant="determinate"
          value={(playedSeconds / duration) * 100}
          sx={{ width: 200 }}
        /> */}
        {/* {!isPlaying && `${Math.floor(loadedSeconds / 60)}:${(loadedSeconds % 60).toFixed(0).padStart(2, '0')}`} */}
        {/* {isPlaying && `${Math.floor(playedSeconds / 60)}:${(playedSeconds % 60).toFixed(0).padStart(2, '0')} - ${Math.floor(loadedSeconds / 60)}:${(loadedSeconds % 60).toFixed(0).padStart(2, '0')}`} */}
        {Math.floor(playedSeconds / 60)}:{(playedSeconds % 60).toFixed(0).padStart(2, '0')} - {Math.floor(loadedSeconds / 60)}:{(loadedSeconds % 60).toFixed(0).padStart(2, '0')}
      </Stack>
      {/* <IconButton onClick={onSend}>
        <PlayArrow sx={{ color: 'success.main' }} />
      </IconButton> */}
      {/* {error && <div>Error: {error.message}</div>} */}
    </Card>
  );
}

VoiceChat.propTypes = {
  onCancel: PropTypes.func,
  onSend: PropTypes.func,
  src: PropTypes.string,
  sx: PropTypes.object,
};
