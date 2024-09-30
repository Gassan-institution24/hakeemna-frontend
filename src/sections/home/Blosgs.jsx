import * as Yup from 'yup';
import * as React from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Card, Grid, Link, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import axiosInstance from 'src/utils/axios';
import { fDateAndTime } from 'src/utils/format-time';

import { useGetBlogs } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';
import FormProvider from 'src/components/hook-form/form-provider';
import { RHFUpload, RHFEditor, RHFTextField } from 'src/components/hook-form';

import BlogImage from './images/blog.png';

export default function UploadBlogs() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data, refetch } = useGetBlogs();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const BlogsSchema = Yup.object().shape({
    title: Yup.string().required(),
    topic: Yup.string().required(),
    file: Yup.array(),
  });

  const defaultValues = {
    file: [],
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
    watch,
    setValue,
    formState: { isSubmitting },
  } = methods;
  const values = watch();
  const fuser = (fuserSize) => {
    const allowedExtensions = ['.jpeg', '.png', '.jpg', '.gif'];

    const isValidFile = (fileName) => {
      const fileExtension = fileName.slice(fileName.lastIndexOf('.')).toLowerCase();
      const isExtensionAllowed = allowedExtensions.includes(fileExtension);
      return isExtensionAllowed;
    };

    const isValidSize = (fileSize) => fileSize <= 3145728;

    return {
      validateFile: isValidFile,
      validateSize: isValidSize,
    };
  };

  const handleDrop = (acceptedFiles) => {
    const fileValidator = fuser(acceptedFiles.reduce((acc, file) => acc + file.size, 0));

    const isValidFiles = acceptedFiles.every(
      (file) => fileValidator.validateFile(file.name) && fileValidator.validateSize(file.size)
    );

    if (isValidFiles) {
      const newFiles = acceptedFiles;

      setValue('file', [...values.file, ...newFiles]);
    } else {
      enqueueSnackbar(t('Invalid file type or size'), { variant: 'error' });
    }
  };

  const handleRemoveFile = React.useCallback(
    (inputFile) => {
      const filtered = values.file.filter((file) => file !== inputFile);
      setValue('file', filtered);
    },
    [setValue, values.file]
  );

  const handleRemoveAllFiles = React.useCallback(() => {
    setValue('file', []);
  }, [setValue]);

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

      enqueueSnackbar('blog uploaded successfully', { variant: 'success' });
      refetch();
      reset();
    } catch (error) {
      if (error?.response?.status !== 401) {
        enqueueSnackbar(
          curLangAr ? (
            <div>
              ليس لديك الإذن للقيام بهذا الإجراء. من فضلك{' '}
              <a href={paths.auth.login} style={{ color: '#5BE49B' }}>
                <strong>سجل الدخول</strong>
              </a>{' '}
              اولا
            </div>
          ) : (
            <div>
              you dont have permission to do this action. Please{' '}
              <a href={paths.auth.login} style={{ color: '#5BE49B' }}>
                <strong>login</strong>
              </a>{' '}
              first
            </div>
          ),
          { variant: 'error' }
        );
      }
    }
  };
  const formatTextWithLineBreaks = (text, id, limit = 20) => {
    if (!text) return '';

    const chunks = [];

    for (let i = 0; i < text.length; i += 100) {
      chunks.push(text.slice(i, i + 100));
    }

    let formattedText = chunks.join('<br />');

    if (text.length > limit) {
      formattedText = `${text.slice(0, limit)}...`;
    }

    return formattedText;
  };

  return (
    <Stack sx={{ p: 5 }}>
      <Card sx={{ display: { md: 'grid' }, gridTemplateColumns: { md: '1fr 1fr', xs: '1fr' } }}>
        <Box
          sx={{
            p: 5,
            borderLeft: '2px rgba(128, 128, 128, 0.1) dashed',
            order: { xs: 1, md: 2 },
          }}
        >
          <Typography variant="h3" sx={{ mb: 3 }}>
            {t('Have something to write about ?')}
          </Typography>
          <Box sx={{ width: '100%' }}>
            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <RHFTextField name="title" placeholder={t('title')} sx={{ mb: 2 }} />

              <RHFEditor
                lang="en"
                name="topic"
                label={t('topic')}
                sx={{ mb: 2, mt: 2, textTransform: 'lowercase' }}
              />

              <RHFUpload
                multiple
                autoFocus
                name="file"
                margin="dense"
                sx={{ mb: 2 }}
                variant="outlined"
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              />
              <Button type="submit" loading={isSubmitting} variant="contained">
                {t('blog')}
              </Button>
            </FormProvider>
          </Box>
        </Box>

        <Box sx={{ p: 5, order: { xs: 2, md: 1 } }}>
          <Typography variant="h2" component="h2" sx={{ mb: 3 }}>
            {t('Read about Medical information')}
          </Typography>

          <Box
            sx={{
              maxHeight: data?.length > 6 ? '400px' : 'auto',
              overflowY: data?.length > 6 ? 'auto' : 'visible',
            }}
          >
            <Grid
              sx={{
                display: 'grid',
                gridTemplateColumns: { md: '1fr 1fr 1fr', xs: '1fr' },
                gap: 2,
              }}
            >
              {data?.map((blog, index) => (
                <Card
                  key={index}
                  sx={{
                    mb: 3,
                    position: 'relative',
                    overflow: 'hidden',
                    transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                    transition: 'transform 0.4s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={handleMouseLeave}
                >
                  <Image src={blog?.user?.picture || BlogImage} alt={blog.title} />
                  <Box
                    sx={{
                      p: 2,
                      transition: 'all 0.5s ease-in-out',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography sx={{ color: 'gray' }}>{blog.title}</Typography>

                    <Typography
                      dangerouslySetInnerHTML={{
                        __html: formatTextWithLineBreaks(blog.topic),
                      }}
                      sx={{
                        mb: 3,
                        mt: 3,
                        fontWeight: 'bold',
                        transition: 'all 0.5s ease-in-out',
                        opacity: hoveredIndex === index ? 0 : 1,
                      }}
                    />

                    <Typography
                      sx={{ color: 'gray', opacity: hoveredIndex === index ? 0 : 1, mt: 2 }}
                    >
                      {fDateAndTime(blog.created_at)}
                    </Typography>
                  </Box>
                  {hoveredIndex === index && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                        color: 'white',
                        display: 'flex',

                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        transition: 'all 0.5s ease-in-out',
                        flexDirection: 'column',
                      }}
                    >
                      {/* here */}
                      <Link
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 1,
                          p: 1,
                          color: 'white',
                          bgcolor: 'success.main',
                          width: '90px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                        }}
                        title={blog.link}
                        href={blog.link}
                        target="_blank"
                      >
                        {t('View')} <Iconify icon="mingcute:link-line" sx={{ ml: '1px' }} />
                      </Link>
                      <Link
                        sx={{
                          cursor: 'pointer',
                          borderRadius: 1,
                          p: 1,
                          color: 'white',
                          bgcolor: 'success.main',
                          width: '90px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        title={blog.user?.employee?.name_english}
                        href={paths.pages.doctor(
                          `${blog.user?.employee?.employee_engagements?.[
                            user.employee.selected_engagement
                          ]?._id}_${blog.user?.employee?.name_english?.replace(/ /g, '_')}`
                        )}
                      >
                        {t('profile')} <Iconify icon="iconamoon:profile-fill" sx={{ ml: '1px' }} />
                      </Link>
                    </Box>
                  )}
                </Card>
              ))}
            </Grid>
          </Box>
        </Box>
      </Card>
    </Stack>
  );
}
