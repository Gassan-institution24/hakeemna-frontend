import { useMemo } from 'react';
import keyBy from 'lodash/keyBy';
import useSWR, { mutate } from 'swr';

import axios, { fetcher, endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

const options = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
};

export function useGetContacts() {
  const URL = [endpoints.chat, { params: { endpoint: 'contacts' } }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      contacts: data?.contacts || [],
      contactsLoading: isLoading,
      contactsError: error,
      contactsValidating: isValidating,
      contactsEmpty: !isLoading && !data?.contacts.length,
    }),
    [data?.contacts, error, isLoading, isValidating]
  );

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversations() {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(() => {
    const byId = keyBy(data?.conversations, 'id') || {};
    const allIds = Object.keys(byId) || [];

    return {
      conversations: {
        byId,
        allIds,
      },
      conversationsLoading: isLoading,
      conversationsError: error,
      conversationsValidating: isValidating,
      conversationsEmpty: !isLoading && !allIds.length,
    };
  }, [data?.conversations, error, isLoading, isValidating]);

  return memoizedValue;
}

// ----------------------------------------------------------------------

export function useGetConversation(conversationId) {
  const URL = endpoints.chat.one(conversationId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      conversation: data,
      conversationLoading: isLoading,
      conversationError: error,
      conversationValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

// ----------------------------------------------------------------------

export function useGetUnreadMsgs(userId) {
  const URL = endpoints.chat.unreadMsg(userId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      messages: data || [],
      messagesLoading: isLoading,
      messagesError: error,
      messagesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

// ----------------------------------------------------------------------

export function useGetSAUnreadMsgs(userId) {
  const URL = endpoints.chat.unreadMsg(userId);

  const { data, isLoading, error, isValidating } = useSWR(URL, fetcher, options);

  const memoizedValue = useMemo(
    () => ({
      messages: data || [],
      messagesLoading: isLoading,
      messagesError: error,
      messagesValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  const refetch = async () => {
    // Use the mutate function to re-fetch the data for the specified key (URL)
    await mutate(URL);
  };

  return { ...memoizedValue, refetch };
}

// ----------------------------------------------------------------------

export async function sendMessage(conversationId, messageData) {
  // const CONVERSATIONS_URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  // const CONVERSATION_URL = [
  //   endpoints.chat,
  //   {
  //     params: { conversationId, endpoint: 'conversation' },
  //   },
  // ];

  /**
   * Work on server
   */
  const data = { conversationId, messageData };
  await axios.put(endpoints.chat, data);
}

// ----------------------------------------------------------------------

export async function createConversation(conversationData) {
  const URL = [endpoints.chat, { params: { endpoint: 'conversations' } }];

  /**
   * Work on server
   */
  const data = { conversationData };
  const res = await axios.post(endpoints.chat, data);

  /**
   * Work in local
   */
  mutate(
    URL,
    (currentData) => {
      const conversations = [...currentData.conversations, conversationData];
      return {
        ...currentData,
        conversations,
      };
    },
    false
  );

  return res.data;
}

// ----------------------------------------------------------------------

export async function clickConversation(conversationId) {
  const URL = endpoints.chat;

  /**
   * Work on server
   */
  // await axios.get(URL, { params: { conversationId, endpoint: 'mark-as-seen' } });

  /**
   * Work in local
   */
  mutate(
    [
      URL,
      {
        params: { endpoint: 'conversations' },
      },
    ],
    (currentData) => {
      const conversations = currentData.conversations.map((conversation, idx) =>
        conversation.id === conversationId ? { ...conversation, unreadCount: 0 } : conversation
      );

      return {
        ...currentData,
        conversations,
      };
    },
    false
  );
}
