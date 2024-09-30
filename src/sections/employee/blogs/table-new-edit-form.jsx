import * as Yup from 'yup';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Card, Stack, Button, Typography, MenuItem } from '@mui/material';


import axiosInstance from 'src/utils/axios';

import { useGetBlog_category } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUpload, RHFEditor, RHFTextField, RHFSelect } from 'src/components/hook-form';


export default function UploadBlogs() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { Data, refetch } = useGetBlog_category();



  const BlogsSchema = Yup.object().shape({
    title: Yup.string().required(),
    topic: Yup.string().required(),
    file: Yup.mixed().nullable(),
  });

  const defaultValues = {
    file: null,
    user: user?._id,
  };
  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(BlogsSchema),
    defaultValues,
  });
  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const handleDrop = React.useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('file', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );


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

      await axiosInstance.post('/api/blogs', formData);

      enqueueSnackbar('blog uploaded successfully');
      refetch();
      reset();
    } catch (error) {
      enqueueSnackbar(
        error.message,
        { variant: 'error' }
      );
    }
  }

  return (
    <Card sx={{ p: 5 }}>
      <Box sx={{ width: '100%' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFTextField name="title" label={t('title')} sx={{ mb: 2 }} />
          <RHFSelect name='category' label={t('category')} sx={{ mb: 2 }}>
            {Data?.map((one, index) => (
              <MenuItem key={index} value={one._id}>{one?.[t('name_english')]}</MenuItem>
            ))}
          </RHFSelect>
          <Typography variant='body2'>{t('images')}</Typography>
          <RHFUpload
            multiple
            autoFocus
            name="file"
            margin="dense"
            sx={{ mb: 2 }}
            variant="outlined"
            onDrop={handleDrop}
          />

          <RHFEditor
            lang="en"
            name="topic"
            label={t('content')}
            sx={{ mb: 2, mt: 2, textTransform: 'lowercase' }}
          />
          <Stack direction='row' justifyContent='flex-end'>
            <Button type="submit" loading={isSubmitting} variant="contained">
              {t('create')}
            </Button>
          </Stack>
        </FormProvider>
      </Box>
    </Card>
  );
}
