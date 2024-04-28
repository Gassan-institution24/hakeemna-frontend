import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import { LoadingButton } from '@mui/lab';
import { Box, Stack, Divider, MenuItem, Typography } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useGetConversation } from 'src/api/chat';
import { useLocales, useTranslate } from 'src/locales';
import { useGetTickets, useGetTicketCategories } from 'src/api';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import CustomPopover from 'src/components/custom-popover';
import ChatMessageList from 'src/components/chat/chat-message-list';
import ChatMessageInput from 'src/components/chat/chat-message-input';
// import CustomPopover from "src/components/custom-popover";
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function TicketPopover({ open, onClose }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();

  const { ticketsData, loading } = useGetTickets({
    user_creation: user._id,
    status: "{ $in: ['pending', 'processing', 'waiting'] }",
  });

  const [page, setPage] = useState();
  const [chatId, setChatId] = useState();

  const { enqueueSnackbar } = useSnackbar();

  const { ticketCategoriesData } = useGetTicketCategories();
  const { conversation, refetch } = useGetConversation(chatId);

  const NewUserSchema = Yup.object().shape({
    category: Yup.string(),
    subject: Yup.string().required(t('required field')),
    details: Yup.string(),
  });

  const methods = useForm({
    mode: 'onTouched',
    resolver: yupResolver(NewUserSchema),
  });

  const {
    reset,
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await axios.post(endpoints.tickets.all, { ...data, URL: window.location.pathname });
      setPage(1);

      // onClose();
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  });

  useEffect(() => {
    if (!loading) {
      let currPage;
      if (ticketsData.length > 1) {
        currPage = 2;
      } else if (ticketsData === 1) {
        currPage = 2;
      } else {
        currPage = 0;
      }
      setPage(currPage);
    }
  }, [loading, ticketsData, open]);

  const participants = conversation
    ? conversation.participants?.filter((participant) => participant._id !== user._id)
    : [];
  useEffect(() => {
    socket.on('message', (id) => {
      if (id === chatId) refetch();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);
  return (
    <CustomPopover
      open={open}
      hiddenArrow
      // arrow={curLangAr ? 'right-bot' : 'top-right'}
      // sx={{ backgroundColor: 'white' }}
      // sx={{ backgroundColor: 'primary.lighter' }}
      onClose={onClose}
    >
      {page === 0 && (
        <FormProvider methods={methods} onSubmit={onSubmit}>
          <Stack sx={{ p: 1 }} spacing={2.5}>
            {/* {page === 0 && <Stack divider={<Divider />}>
                        {ticketCategoriesData?.map((one, idx) => (
                            <MenuItem onClick={() => handleSelectCategory(one._id)} key={idx} sx={{ px: 3, py: 1, fontSize: 14, fontWeight: 500, textTransform: 'capitalize' }}>{curLangAr ? one.name_arabic : one?.name_english}</MenuItem>
                        ))}
                    </Stack>} */}
            <Box
              rowGap={1}
              columnGap={2}
              display="grid"
              width="auto"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
              sx={{ p: 2 }}
            >
              <Typography sx={{ textTransform: 'capitalize', pb: 2 }} variant="h6">
                {t('ticket')}
              </Typography>
              <Box>
                <Typography variant="subtitle2">{t('category')}</Typography>
                <RHFSelect size="small" name="category">
                  {ticketCategoriesData.map((one, idx) => (
                    <MenuItem lang="ar" key={idx} value={one._id}>
                      {curLangAr ? one.name_arabic : one?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Box>
              <Box>
                <Typography variant="subtitle2">{t('subject')}</Typography>
                <RHFTextField sx={{ minWidth: 300 }} size="small" name="subject" />
              </Box>
              <Box>
                <Typography variant="subtitle2">{t('details')}</Typography>
                <RHFTextField size="small" multiline rows={4} name="details" />
              </Box>
              <Stack alignItems="flex-end" sx={{ mt: 2 }}>
                <LoadingButton type="submit" tabIndex={-1} variant="contained">
                  {t('send')}
                </LoadingButton>
              </Stack>
            </Box>
          </Stack>
        </FormProvider>
      )}
      {page === 1 && (
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
            Customer service
          </Stack>

          <Stack
            direction="row"
            sx={{
              width: 330,
              height: 400,
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
                refetch={refetch}
                // //
                selectedConversationId={chatId}
              />
            </Stack>
          </Stack>
        </Stack>
      )}
      {page === 2 && (
        <Stack>
          <Typography variant="subtitle1" textAlign="center" m={1}>
            Select One
          </Typography>
          <Divider sx={{ mb: 1 }} />
          {ticketsData.map((one, idx) => (
            <MenuItem
              onClick={() => {
                setChatId(one.chat);
                setPage(1);
              }}
              key={idx}
            >
              {one.subject}
            </MenuItem>
          ))}
          <Divider />
          <MenuItem
            lang="ar"
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
              fontWeight: 600,
              // color: 'error.main',
            }}
            onClick={() => setPage(0)}
          >
            <Typography variant="body2" sx={{ color: 'info.main' }}>
              {t('Add new')}
            </Typography>
            <Iconify icon="ph:plus-bold" />
          </MenuItem>
        </Stack>
      )}
    </CustomPopover>
  );
}
TicketPopover.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
