import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { Box, Card, Grid, Stack, Button, Typography } from '@mui/material';

import { fDateAndTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';

export default function ViewBlog({ data }) {
  const { t } = useTranslate()
  const { enqueueSnackbar } = useSnackbar()

  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      enqueueSnackbar(t('Link copied to clipboard'));
    } catch (err) {
      enqueueSnackbar(t('Failed to copy'), { variant: 'error' });
    }
  };

  return (
    <Stack sx={{ p: 5, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ width: '70%' }}>
        <Box sx={{ p: 5, textAlign: 'start' }}>
          <Stack direction='row' justifyContent='flex-end'>
            <Button onClick={handleCopyLink}>
              <Iconify icon='icon-park-outline:copy-link' />
              {'  '}
              {t("Copy link")}
            </Button>
          </Stack>
          <Typography variant="h2" component="h2" sx={{ mb: 10, textAlign: 'center' }}>
            {data?.title}
          </Typography>

          <Grid
            container
            sx={{
              gap: 2,
              justifyContent: 'start',
              alignItems: 'start',
            }}
          >
            <Image
              src={data?.file}
              alt={data?.title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <Box sx={{ p: 2 }}>
              <Typography sx={{ color: 'gray', mt: 2 }}>
                {fDateAndTime(data?.created_at)}
              </Typography>

              <Typography
                dangerouslySetInnerHTML={{
                  __html: data?.topic,
                }}
                sx={{
                  mb: 3,
                  mt: 3,
                  fontWeight: 'bold',
                  transition: 'all 0.5s ease-in-out',
                }}
              />
            </Box>
          </Grid>
          <Stack direction='row' justifyContent='flex-end'>
            <Typography variant='caption'>{t('read times')}{' : '}{data?.show_number}</Typography>
          </Stack>
        </Box>
      </Card>
    </Stack>
  );
}
ViewBlog.propTypes = {
  data: PropTypes.object,
};