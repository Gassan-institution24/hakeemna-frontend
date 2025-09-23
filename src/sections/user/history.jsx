import React, { useState, useEffect } from 'react';

import { Timeline } from '@mui/icons-material';
import {
  Box,
  Card,
  Grid,
  Chip,
  Stack,
  Button,
  Divider,
  Typography,
} from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetPatientHistoryData } from 'src/api/history';
import HistoryInfo from 'src/pages/dashboard/user/historyinfo';

export default function HistoryHead() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [displayedData, setDisplayedData] = useState([]);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { historyDataForPatient } = useGetPatientHistoryData(user?.patient?._id);
  const [selectedData, setSelectedData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  useEffect(() => {
    if (historyDataForPatient?.length > 0) {
      const initialData = historyDataForPatient.slice(0, 10);
      setDisplayedData(initialData);
      setSkip(10);
      if (historyDataForPatient.length <= 10) setHasMore(false);
    }
  }, [historyDataForPatient]);

  const loadMoreData = () => {
    const nextData = historyDataForPatient.slice(skip, skip + 5);
    setDisplayedData((prev) => [...prev, ...nextData]);
    setSkip((prev) => prev + nextData.length);
    if (skip + 5 >= historyDataForPatient.length) setHasMore(false);
  };

  const handleScroll = (e) => {
    const { scrollHeight, scrollTop, clientHeight } = e.target;
    if (scrollHeight - scrollTop === clientHeight && hasMore) {
      loadMoreData();
    }
  };

  const handleView = (item) => {
    setSelectedData(item);
    setOpenDialog(true);
  };
  return (
    <Box onScroll={handleScroll} sx={{ maxHeight: 600, overflowY: 'auto', p: 2 }}>
      <Grid container spacing={2}>
        {displayedData?.map((item) => (
          <Grid item xs={12} key={item?._id}>
            <Card
              sx={{
                borderRadius: 4,
                backdropFilter: 'blur(8px)',
                background: 'linear-gradient(135deg, #fdfdfd 0%, #f4f6f8 100%)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                p: 2,
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {t('visit number')} #{item?.visit_number}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => handleView(item)}
                  sx={{
                    borderRadius: 2,
                    px: 3,
                    py: 1,
                    fontWeight: 600,
                    textTransform: 'none',
                  }}
                  endIcon={<Timeline />}
                >
                  {t('View Details')}
                </Button>
              </Stack>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {new Date(item?.actual_date).toLocaleString()}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Typography fontWeight={600}>{t('General')}</Typography>
                  <Typography>
                    {t('code')}: {item?.code}
                  </Typography>
                  <Typography>
                    {t('Duration')}: {item?.duration} {t('min')}
                  </Typography>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography fontWeight={600}>{t('activities')}</Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" mt={1}>
                    {item?.appointment && (
                      <Chip label={t('Appointment')} color="primary" size="small" />
                    )}
                    {item?.prescription && (
                      <Chip label={t('Prescription')} color="success" size="small" />
                    )}
                    {item?.medical_report && (
                      <Chip label={t('medical report')} color="warning" size="small" />
                    )}
                    {item?.sick_leave && (
                      <Chip label={t('Sick Leave')} color="error" size="small" />
                    )}
                  </Stack>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Typography fontWeight={600}>{t('more')}</Typography>
                  <Typography>
                    {t('Service Unit')}:{' '}
                    {curLangAr ? item?.service_unit?.name_arabic : item?.service_unit?.name_english}
                  </Typography>
                  <Typography>
                    {t('work group')}:{' '}
                    {curLangAr ? item?.work_group?.name_arabic : item?.work_group?.name_english}
                  </Typography>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>
      <HistoryInfo open={openDialog} onClose={() => setOpenDialog(false)} data={selectedData} />
    </Box>
  );
}
