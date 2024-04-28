// ----------------------------------------------------------------------

export default function useGetMessage({ message, participants, currentUserId }) {
  const sender = participants.find((participant) => participant._id === message.senderId);
  console.log('sender', sender)
  const senderDetails =
    message.senderId === currentUserId
      ? {
        type: 'me',
      }
      : {
        avatarUrl: sender?.avatarUrl,
        firstName: sender?.userName.split(' ')[0],
      };

  const me = senderDetails.type === 'me';

  const hasImage = message.contentType === 'image';

  return {
    hasImage,
    me,
    senderDetails,
  };
}
