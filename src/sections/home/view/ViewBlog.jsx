import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router';

import { Box, Card, Grid, Stack, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDateAndTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

export default function ViewBlog({ data }) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate(); // Initialize the navigation function
  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard
      .writeText(currentUrl)
      .then(() => {
        enqueueSnackbar(t('Link copied to clipboard'));
      })
      .catch((err) => {
        enqueueSnackbar(t('Failed to copy'), { variant: 'error' });
      });
  };
  console.log(data);

  // Function to detect if the title is in Arabic
  const isArabic = (text) => {
    const arabicRegex = /[\u0600-\u06FF]/;
    return arabicRegex.test(text);
  };
  const handleNavigateToDoctor = () => {
    // Construct the path dynamically
    const doctorPath = paths.pages.doctor(
      `${
        data?.user?.employee?.employee_engagements[0]
      }_${data?.user?.employee?.name_english?.replace(/ /g, '_')}`
    );

    // Navigate to the constructed path
    navigate(doctorPath);
  };

  return (
    <Stack
      sx={{ p: { xs: 3, md: 5 }, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Card sx={{ width: { xs: '100%', md: '80%', lg: '70%' }, p: { xs: 2, md: 5 } }}>
        <Box dir="ltr" sx={{ textAlign: 'start', direction: 'ltr' }}>
          <Typography
            variant="h2"
            component="h2"
            dir={isArabic(data?.title) ? 'rtl' : 'ltr'}
            sx={{
              mb: { xs: 5, md: 10 },
              fontSize: { xs: '1.8rem', md: '2.5rem' },
            }}
          >
            {data?.title}
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              justifyContent: 'start',
              alignItems: 'start',
            }}
          >
            <Grid item xs={12}>
              <Image
                src={data?.file}
                alt={data?.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  maxHeight: { xs: '300px', md: '500px' },
                }}
                dir={isArabic(data?.title) ? 'rtl' : 'ltr'}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ p: 2 }}>
                <Typography
                  dir={isArabic(data?.title) ? 'rtl' : 'ltr'}
                  sx={{ color: 'gray', mt: 2 }}
                >
                  {fDateAndTime(data?.created_at)}
                </Typography>

                <Typography
                  dir={isArabic(data?.title) ? 'rtl' : 'ltr'}
                  dangerouslySetInnerHTML={{
                    __html: data?.topic,
                  }}
                  sx={{
                    mb: 3,
                    mt: 3,
                    fontWeight: 'bold',
                    transition: 'all 0.5s ease-in-out',
                    fontSize: { xs: '1rem', md: '1.2rem' },
                  }}
                />
              </Box>
            </Grid>
          </Grid>
          <Stack
            direction="row"
            justifyContent="flex-end"
            alignItems="center" // Ensures text and icons are aligned on the same line
            sx={{ mt: 2, gap: 4 }}
          >
            <Typography
              dir={isArabic(data?.title) ? 'rtl' : 'ltr'}
              sx={{
                display: 'flex', // Aligns icon with the text
                alignItems: 'center',
              }} // Aligns icon with the text
            >
              {t('views')}
              {' : '}
              {data?.show_number}
              &nbsp;
              <Iconify width={20} icon="lucide:eye" />
            </Typography>

            <Typography
              dir={isArabic(data?.title) ? 'rtl' : 'ltr'}
              sx={{
                cursor: 'pointer',
                display: 'flex', // Aligns icon with the text
                alignItems: 'center',
                '&:hover': {
                  color: 'green', // Change text color to green on hover
                },
              }}
              onClick={handleNavigateToDoctor} // Navigate when clicked
            >
              {data?.user?.employee?.name_english}
              &nbsp;
              <Iconify width={20} icon="mdi:user" />
            </Typography>

            <Typography
              dir={isArabic(data?.title) ? 'rtl' : 'ltr'}
              sx={{
                cursor: 'pointer',
                display: 'flex', // Aligns icon with the text
                alignItems: 'center',
                '&:hover': {
                  color: 'green', // Change text color to green on hover
                },
              }}
              onClick={handleCopyLink}
            >
              {t('Copy link')}
              &nbsp;
              <Iconify width={20} icon="si:copy-fill" />
            </Typography>
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}

ViewBlog.propTypes = {
  data: PropTypes.object,
};
