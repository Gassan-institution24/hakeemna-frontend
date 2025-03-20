import React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { Card, Stack, Typography, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

export default function InstructionItem({ one, refetch }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { enqueueSnackbar } = useSnackbar();

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(endpoints.Instructions.one(one?._id));
      refetch();
      enqueueSnackbar(t('deleted successfully!'));
    } catch (error) {
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
    }
  };

  return (
    <Card sx={{ py: 3, px: 5, mb: 2 }}>
      <Stack direction="row" justifyContent="flex-end" alignItems="center" gap={2}>
        <Typography variant="subtitle2">{fDate(one.created_at)}</Typography>
        <IconButton color="error" onClick={handleDelete}>
          <Iconify icon="mi:delete" />
        </IconButton>
      </Stack>
      <Stack direction="row" gap={10} ml={1}>
        <Typography variant="body2">{one?.adjustable_documents?.title}</Typography>
        <Typography variant="body2">{one?.adjustable_documents?.applied}</Typography>
      </Stack>
    </Card>
  );
}
InstructionItem.propTypes = {
  one: PropTypes.object,
  refetch: PropTypes.func,
};
