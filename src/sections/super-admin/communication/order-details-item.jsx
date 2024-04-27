import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { Container } from '@mui/material';
import { fCurrency } from 'src/utils/format-number';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import ChatHeaderDetail from 'src/components/chat/chat-header-detail';
import ChatMessageList from 'src/components/chat/chat-message-list';
import ChatMessageInput from 'src/components/chat/chat-message-input';
import { useGetConversation } from 'src/api/chat';
import { useAuthContext } from 'src/auth/hooks';
import { useEffect } from 'react';
import socket from 'src/socket';


// ----------------------------------------------------------------------

export default function OrderDetailsItems({
  ticket,
}) {
  const { user } = useAuthContext()
  const { conversation, refetch } = useGetConversation(ticket.chat)

  const participants = conversation
    ? conversation.participants?.filter((participant) => participant._id !== user._id)
    : [];

  useEffect(() => {
    socket.on('message', (id) => { if (id === ticket.chat) refetch() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card sx={{
      width: 1,
      height: 600,
      overflow: 'hidden',
    }}>
      <Stack
        sx={{
          width: 1,
          height: 1,
          overflow: 'hidden',
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          flexShrink={0}
          sx={{ pr: 1, pl: 2.5, py: 1, minHeight: 72 }}
        >
          {/* <ChatHeaderDetail
            participants={participants}
          /> */}
          Chat
        </Stack>

        <Stack
          direction="row"
          sx={{
            width: 1,
            height: 1,
            overflow: 'hidden',
            borderTop: (theme) => `solid 1px ${theme.palette.divider}`,
          }}
        >
          <Stack
            sx={{
              width: 1,
              height: 1,
              overflow: 'hidden',
            }}
          >
            <ChatMessageList
              messages={conversation?.messages} participants={participants}
            />

            <ChatMessageInput
              // recipients={recipients}
              // onAddRecipients={handleAddRecipients}
              // //
              selectedConversationId={ticket.chat}
              refetch={refetch}
            // disabled={!recipients.length && !selectedConversationId}
            />
          </Stack>
        </Stack>
      </Stack>
    </Card>
  )
}

OrderDetailsItems.propTypes = {
  ticket: PropTypes.object,
};
