import { useState } from 'react';
import PropTypes from 'prop-types';
import ReactPlayer from 'react-player';

import { Card, Stack } from '@mui/material';
import { Pause, PlayArrow } from '@mui/icons-material';

export default function VoiceChat({ src, duration, sx }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);

  const handlePlayPause = () => {
    setIsPlaying((prevIsPlaying) => !prevIsPlaying);
  };

  const handleProgress = (state) => {
    setPlayedSeconds(state.playedSeconds);
  };

  return (
    <Card sx={{ px: 2, py: 1, backgroundColor: 'info.lighter', width: 1 }}>
      <ReactPlayer
        url={src}
        playing={isPlaying}
        onProgress={handleProgress}
        onEnded={() => {
          setIsPlaying(false);
          setPlayedSeconds(0);
        }}
        width={0}
        height={0}
        style={{ display: 'none' }}
      />
      <Stack direction="row" justifyContent="space-between" gap={2} alignItems="center">
        {isPlaying ? <Pause onClick={handlePlayPause} /> : <PlayArrow onClick={handlePlayPause} />}

        {!isPlaying &&
          `${Math.floor(duration / 60)}:${(duration % 60).toFixed(0).padStart(2, '0')}`}
        {isPlaying &&
          `${Math.floor(playedSeconds / 60)}:${(playedSeconds % 60)
            .toFixed(0)
            .padStart(2, '0')} - ${Math.floor(duration / 60)}:${(duration % 60)
            .toFixed(0)
            .padStart(2, '0')}`}
        {/* {Math.floor(playedSeconds / 60)}:{(playedSeconds % 60).toFixed(0).padStart(2, '0')} - {Math.floor(duration / 60)}:{(duration % 60).toFixed(0).padStart(2, '0')} */}
      </Stack>
    </Card>
  );
}

VoiceChat.propTypes = {
  src: PropTypes.string,
  sx: PropTypes.object,
  duration: PropTypes.number,
};
