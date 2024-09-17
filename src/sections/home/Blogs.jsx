import * as Yup from 'yup';
import * as React from 'react';

import { Box, Card, Grid, Link, Stack, Button, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Image from 'src/components/image/image';

import axiosInstance from 'src/utils/axios';

import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import { useForm } from 'react-hook-form';

import { RHFUpload, RHFTextField } from 'src/components/hook-form';

import FormProvider from 'src/components/hook-form/form-provider';

import { useGetBlogs } from 'src/api';
import { paths } from 'src/routes/paths';
import { useAuthContext } from 'src/auth/hooks';

export default function Blogs() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { data } = useGetBlogs();
  console.log(data);

  const blogs = [
    {
      title: 'Blog 1',
      topic:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis quod vero odio ab debitis optio at sequi suscipit vitae obcaecati nobis, corrupti eaque beatae, odit possimus ex quaerat similique? Ad.',
      link: 'www.dfdf;dfdfdfgergeg.com',
      date: '20/11/2024',
    },
  ];

  const [hoveredIndex, setHoveredIndex] = React.useState(null);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = () => {
    setHoveredIndex(null);
  };

  const BlogsSchema = Yup.object().shape({
    title: Yup.string(),
    topic: Yup.string(),
    link: Yup.string(),
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
      // refetch();
      reset();
    } catch (error) {
      if (error?.response?.status !== 401) {
        enqueueSnackbar(
          <div>
            you dont have permssion to do this action. Please{' '}
            <a href={paths.auth.login} style={{ color: '#5BE49B' }}>
              <strong>login</strong>
            </a>{' '}
            first
          </div>,
          { variant: 'error' }
        );
      }
    }
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
              <RHFTextField
                name="topic"
                placeholder={t('topic')}
                sx={{ mb: 2, display: 'block' }}
                multiline
              />
              <RHFTextField
                name="link"
                placeholder={t('Add link')}
                sx={{ mb: 2, display: 'block' }}
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
              {/* <Button
                variant="contained"
                sx={{ bgcolor: 'success.main', color: 'white', display: 'block' }}
              > */}
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
                  <Image
                    src="https://pbwebdev.co.uk/wp-content/uploads/2018/12/blogs.jpg"
                    alt={blog.title}
                  />
                  <Box
                    sx={{
                      p: 2,
                      transition: 'all 0.5s ease-in-out',
                      overflow: 'hidden',
                    }}
                  >
                    <Typography sx={{ color: 'gray' }}>{blog.title}</Typography>
                    <Typography
                      sx={{
                        mb: 3,
                        mt: 3,
                        fontWeight: 'bold',
                        transition: 'all 0.5s ease-in-out',
                        opacity: hoveredIndex === index ? 0 : 1,
                      }}
                    >
                      {blog.topic?.length > 50 ? `${blog.topic.substring(0, 50)}... ` : blog.topic}
                    </Typography>

                    <Link
                      href={blog.link}
                      sx={{
                        transition: 'all 0.5s ease-in-out',
                        opacity: hoveredIndex === index ? 0 : 1,
                        fontSize: 13,
                      }}
                      // onClick={() => alert('Coming soon')}
                    >
                      {blog.link}
                    </Link>

                    <Typography
                      sx={{ color: 'gray', opacity: hoveredIndex === index ? 0 : 1, mt: 2 }}
                    >
                      {blog.date}
                    </Typography>
                  </Box>
                  {/* This box appears when hovered */}
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
                      }}
                    >
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
                        title={blog.link}
                        href={blog.link}
                        target="_blank"
                      >
                        {t('View')} <Iconify icon="mingcute:link-line" sx={{ ml: '1px' }} />
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
