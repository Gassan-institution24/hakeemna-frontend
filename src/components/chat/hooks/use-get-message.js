// ----------------------------------------------------------------------

import { useGetUserByQuery } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

export default function useGetMessage({ message, participants }) {
  const { user } = useAuthContext();
  const { data } = useGetUserByQuery({ role: 'superadmin' });

  const superAdminSender = data?.find((one) => one._id === message.senderId);
  const sender = participants.find((participant) => participant._id === message.senderId);
  const senderDetails =
    message.senderId === user._id || (user.role === 'superadmin' && superAdminSender)
      ? {
          type: 'me',
          firstName: superAdminSender?.userName?.split(' ')[0],
        }
      : {
          avatarUrl: sender?.avatarUrl,
          firstName: sender?.userName.split(' ')[0],
        };

  const me = senderDetails.type === 'me';

  const hasImage = message.contentType === 'image';

  const hasFile = message.contentType === 'file';

  const hasVoice = message.contentType === 'voice';

  return {
    hasImage,
    hasFile,
    hasVoice,
    me,
    senderDetails,
  };
}
