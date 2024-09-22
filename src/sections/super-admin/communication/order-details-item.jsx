import { useEffect } from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useGetConversation } from 'src/api/chat';

import ChatMessageList from 'src/components/chat/chat-message-list';
import ChatMessageInput from 'src/components/chat/chat-message-input';

// ----------------------------------------------------------------------

export default function OrderDetailsItems({ ticket }) {
  const { user } = useAuthContext();
  const { conversation, refetch } = useGetConversation(ticket.chat);

  const participants = conversation
    ? conversation.participants?.filter((participant) => participant._id !== user._id)
    : [];

  useEffect(() => {
    socket.on('message', (message) => {
      if (message.chat === ticket.chat) refetch();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      sx={{
        width: 1,
        height: 600,
        overflow: 'hidden',
      }}
    >
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
            <ChatMessageList messages={conversation?.messages} participants={participants} />

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
  );
}

OrderDetailsItems.propTypes = {
  ticket: PropTypes.object,
};
