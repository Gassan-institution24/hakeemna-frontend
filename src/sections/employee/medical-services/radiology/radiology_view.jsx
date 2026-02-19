import { useParams, useNavigate } from 'react-router-dom';

import { Box, Card, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import { useGetOneFavoriteRadiology } from 'src/api/doctorFavorite';

import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function RadiologyViewPage() {
  const { id } = useParams();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { favorite, loading } = useGetOneFavoriteRadiology(id);

  if (!favorite) return null;
  if (loading) return <LoadingScreen />;
  return (
    <Box sx={{ mt: 5, px: 3 }}>
      <CustomBreadcrumbs
        heading={t('radiology details')}
        links={[
          {
            name: t('radiology'),
            href: paths.employee.medicalServices.radiology.root,
          },
          { name: curLangAr ? favorite.favorite_name_ar : favorite.favorite_name },
        ]}
        sx={{ mb: 3 }}
      />
      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Typography variant="h5" fontWeight={600}>
            {curLangAr ? favorite.favorite_name_ar : favorite.favorite_name}
          </Typography>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('radiology')}
            </Typography>

            <Typography>
              {favorite.radiology
                ?.map((a) => (a.diagnostic_test))
                .join(', ') || '-'}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {t('created at')}
            </Typography>

            <Typography>{fDate(favorite.created_at, 'dd MMM yyyy')}</Typography>
          </Box>

          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(-1)}
            sx={{ alignSelf: 'flex-start' }}
          >
            {t('back')}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
}
