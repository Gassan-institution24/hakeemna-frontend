import * as Yup from 'yup';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Card, Stack, Button, MenuItem } from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useGetBlog_category } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';

export default function UploadBlogs({ currentRow }) {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { Data, refetch } = useGetBlog_category();

  const BlogsSchema = Yup.object().shape({
    title: Yup.string().required(),
    category: Yup.string().required(),
    topic: Yup.string().required(),
    user: Yup.string().required(),
  });

  const defaultValues = {
    title: currentRow?.title || '',
    category: currentRow?.category || null,
    topic: currentRow?.topic || '',
    user: currentRow?.user || user?._id,
  };
  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(BlogsSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (submitdata) => {
    try {
      const formData = new FormData();

      Object.keys(submitdata).forEach((key) => {
        if (Array.isArray(submitdata[key])) {
          submitdata[key].forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          formData.append(key, submitdata[key]);
        }
      });
      if (currentRow) {
        await axiosInstance.patch(`/api/blogs/${currentRow._id}`, formData);
      } else {
        await axiosInstance.post('/api/blogs', formData);
      }

      enqueueSnackbar(currentRow ? t('updated successfully') : t('created successfully'));
      refetch();
      reset();
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <Card sx={{ p: 5 }}>
      <Box sx={{ width: '100%' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField name="title" label={t('title')} sx={{ mb: 2 }} />
          <RHFSelect name="category" label={t('category')} sx={{ mb: 2 }}>
            {Data?.map((one, index) => (
              <MenuItem key={index} value={one._id}>
                {one?.[t('name_english')]}
              </MenuItem>
            ))}
          </RHFSelect>
          <RHFEditor
            lang="en"
            name="topic"
            label={t('content')}
            sx={{ mb: 2, mt: 2, textTransform: 'lowercase' }}
          />
          <Stack direction="row" justifyContent="flex-end">
            <Button type="submit" loading={isSubmitting} variant="contained">
              {currentRow ? t('update') : t('create')}
            </Button>
          </Stack>
        </FormProvider>
      </Box>
    </Card>
  );
}

UploadBlogs.propTypes = {
  currentRow: PropTypes.object,
};
