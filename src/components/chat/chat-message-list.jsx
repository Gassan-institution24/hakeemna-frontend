import PropTypes from 'prop-types';
import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import Scrollbar from 'src/components/scrollbar';
import Lightbox, { useLightBox } from 'src/components/lightbox';

import { useMessagesScroll } from './hooks';
import ChatMessageItem from './chat-message-item';

// ----------------------------------------------------------------------

export default function ChatMessageList({ messages = [], refetchLenght, participants }) {
  const { messagesEndRef } = useMessagesScroll(messages);
  const { user } = useAuthContext();

  const observer = useRef(null);
  const slides = messages
    .filter((message) => message.contentType === 'image')
    .map((message) => ({ src: message.body }));

  const lightbox = useLightBox(slides);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(async (entry) => {
          if (entry.isIntersecting) {
            await axiosInstance.patch(endpoints.chat.message(entry.target.id), { isUnRead: false });
            if (refetchLenght) {
              refetchLenght();
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    return () => {
      if (observer?.current) {
        observer?.current?.disconnect();
      }
    };
  }, [refetchLenght]);

  return (
    <>
      <Scrollbar ref={messagesEndRef} sx={{ px: 1, py: 3, height: 1 }}>
        <Box>
          {messages.map((message) => (
            <div
              key={message?._id}
              id={message?._id}
              ref={(el) => {
                if (el && message.isUnRead && message?.user !== user?._id) {
                  observer?.current?.observe(el);
                }
              }}
            >
              <ChatMessageItem
                message={message}
                participants={participants}
                onOpenLightbox={() => lightbox.onOpen(message.body)}
              />
            </div>
          ))}
        </Box>
      </Scrollbar>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
      />
    </>
  );
}

ChatMessageList.propTypes = {
  messages: PropTypes.array,
  participants: PropTypes.array,
  refetchLenght: PropTypes.func,
};
