import { useParams, useNavigate } from 'react-router-dom';

import { Box, Card, Stack, Button, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import { useGetOneFavoriteMedication } from 'src/api/doctorFavorite';

import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

export default function MedicationViewPage() {
  const { id } = useParams();
  const { t } = useTranslate();
  const navigate = useNavigate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { favorite, loading } = useGetOneFavoriteMedication(id);

  if (!favorite) return null;
  if (loading) return <LoadingScreen />;
  return (
    <Box sx={{ mt: 5, px: 3 }}>
      <CustomBreadcrumbs
        heading={t('medicines details')}
        links={[
          {
            name: t('medicines'),
            href: paths.employee.medicalServices.medication.root,
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
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                {t('medicines')}
              </Typography>

              {favorite.medicines?.length ? (
                <Stack spacing={2}>
                  {favorite.medicines
                    .filter((item) => item?.medicine)
                    .map((item) => (
                      <Card
                        key={item._id}
                        sx={{
                          p: 2,
                          border: '1px solid #eee',
                          borderRadius: 2,
                          backgroundColor: '#fafafa',
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.medicine.trade_name}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {t('frequency')}: {item.Frequency_per_day}
                        </Typography>

                        {item.Doctor_Comments && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {t('doctor comment')}: {item.Doctor_Comments}
                          </Typography>
                        )}
                      </Card>
                    ))}
                </Stack>
              ) : (
                <Typography>-</Typography>
              )}
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
