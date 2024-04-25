import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Stack, MenuItem, Divider, Typography } from '@mui/material';

import axios, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import CustomPopover from 'src/components/custom-popover';
// import CustomPopover from "src/components/custom-popover";
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import { useState } from 'react';
import { useGetTicketCategories } from 'src/api';
import { LoadingButton } from '@mui/lab';

export default function TicketPopover({ open, onClose }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  // const [page, setPage] = useState(0)

  const { enqueueSnackbar } = useSnackbar();

  const { ticketCategoriesData } = useGetTicketCategories();

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
      // refetch();

      onClose();
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
  });

  // const handleSelectCategory = (id) => {
  //     setPage(1)
  //     setValue('category', id)
  // }

  return (
    <CustomPopover
      open={open}
      hiddenArrow
      // arrow={curLangAr ? 'right-bot' : 'top-right'}
      // sx={{ backgroundColor: 'white' }}
      // sx={{ backgroundColor: 'primary.lighter' }}
      onClose={onClose}
    >
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
    </CustomPopover>
  );
}
TicketPopover.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
