import PropTypes from 'prop-types';
import { formatDistanceToNowStrict } from 'date-fns';
import { ar, enGB } from 'date-fns/locale'

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { Card, Link } from '@mui/material';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import { useLocales } from 'src/locales';

import { useGetMessage } from './hooks';
import VoiceChat from './chat-voice-component';

// ----------------------------------------------------------------------

export default function ChatMessageItem({ message, participants, onOpenLightbox }) {

  const { me, senderDetails, hasImage, hasFile, hasVoice } = useGetMessage({
    message,
    participants,
  });

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { firstName, avatarUrl } = senderDetails;

  const { body, file_name, duration, createdAt } = message;

  const renderInfo = (
    <Typography
      noWrap
      variant="caption"
      sx={{
        mb: 1,
        color: 'text.disabled',
        ...(!me && {
          mr: 'auto',
        }),
      }}
    >
      {firstName && `${firstName},`} &nbsp;
      {formatDistanceToNowStrict(new Date(createdAt), {
        addSuffix: true,
        locale: (curLangAr ? ar : enGB),
      })}
    </Typography>
  );

  const renderBody = (
    <Stack
      sx={{
        p: 1.5,
        minWidth: 48,
        maxWidth: 320,
        borderRadius: 1,
        typography: 'body2',
        bgcolor: 'background.neutral',
        mr: 3,
        ml: 0,
        ...(me && {
          color: 'grey.800',
          mr: 0,
          ml: 3,
          bgcolor: 'primary.lighter',
        }),
        ...((hasImage || hasFile || hasVoice) && {
          p: 0,
          bgcolor: 'transparent',
        }),
      }}
    >
      {hasImage && (
        <Box
          component="img"
          alt="attachment"
          src={body}
          onClick={() => onOpenLightbox(body)}
          sx={{
            minHeight: 220,
            borderRadius: 1.5,
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.9,
            },
          }}
        />
      )}
      {hasFile && (
        <Link href={body} target="_blank" component={RouterLink}>
          <Card sx={{ px: 3, py: 1, m: 1, backgroundColor: 'background.neutral' }}>
            <Stack direction="row" justifyContent="space-around" alignItems="center">
              <Iconify icon="mdi:file" />
              <Typography color="text.disabled" sx={{ ml: 1 }}>
                {file_name || 'file'}
              </Typography>
            </Stack>
          </Card>
        </Link>
      )}
      {hasVoice && (
        <VoiceChat src={body} duration={duration} />
        // <audio controls src={body}>
        //   <track kind="captions" />
        // </audio>
      )}
      {!hasImage && !hasFile && !hasVoice && (
        <Typography variant="body2" sx={{ overflowWrap: 'break-word' }}>
          {body}
        </Typography>
      )}
    </Stack>
  );

  // const renderActions = (
  //   <Stack
  //     direction="row"
  //     className="message-actions"
  //     sx={{
  //       pt: 0.5,
  //       opacity: 0,
  //       top: '100%',
  //       left: 0,
  //       position: 'absolute',
  //       transition: (theme) =>
  //         theme.transitions.create(['opacity'], {
  //           duration: theme.transitions.duration.shorter,
  //         }),
  //       ...(me && {
  //         left: 'unset',
  //         right: 0,
  //       }),
  //     }}
  //   >
  //     <IconButton size="small">
  //       <Iconify icon="solar:reply-bold" width={16} />
  //     </IconButton>
  //     <IconButton size="small">
  //       <Iconify icon="eva:smiling-face-fill" width={16} />
  //     </IconButton>
  //     <IconButton size="small">
  //       <Iconify icon="solar:trash-bin-trash-bold" width={16} />
  //     </IconButton>
  //   </Stack>
  // );

  return (
    <Stack direction="row" justifyContent={me ? 'flex-end' : 'unset'} sx={{ mb: 1 }}>
      {!me && <Avatar alt={firstName} src={avatarUrl} sx={{ width: 32, height: 32, mr: 2 }} />}

      <Stack alignItems={me ? 'flex-end' : 'flex-start'}>
        <Stack
          direction="row"
          alignItems="center"
          sx={{
            position: 'relative',
            '&:hover': {
              '& .message-actions': {
                opacity: 1,
              },
            },
          }}
        >
          {renderBody}
          {/* {renderActions} */}
        </Stack>
        {renderInfo}
      </Stack>
    </Stack>
  );
}

ChatMessageItem.propTypes = {
  message: PropTypes.object,
  onOpenLightbox: PropTypes.func,
  participants: PropTypes.array,
};
