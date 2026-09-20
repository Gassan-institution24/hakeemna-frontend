import React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { Stack, Tooltip, Typography, IconButton } from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

import RecordCard from 'src/sections/shared/patient-profile/record-card';


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
    // The document's own title leads, not the creation date: it is what a
    // doctor scans this list for. The date drops to the subtitle.
    <RecordCard
      icon="solar:clipboard-text-bold-duotone"
      color="warning"
      title={one?.adjustable_documents?.title || t('Patient Instructions')}
      subtitle={fDate(one.created_at)}
      actions={
        <Tooltip title={t('delete')}>
          <IconButton color="error" onClick={handleDelete}>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      }
      footer={
        one?.adjustable_documents?.applied ? (
          <Stack direction="row" alignItems="center" gap={0.75}>
            <Iconify
              icon="solar:clock-circle-bold-duotone"
              width={16}
              sx={{ color: 'text.disabled' }}
            />
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {`${t('applied')}: ${one.adjustable_documents.applied}`}
            </Typography>
          </Stack>
        ) : null
      }
    />
  );
}
InstructionItem.propTypes = {
  one: PropTypes.object,
  refetch: PropTypes.func,
};
