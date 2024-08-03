import { useParams } from 'react-router';
import { useTheme } from '@emotion/react';

import { Box, Card, alpha, Paper, Button, Divider, Typography, useMediaQuery } from '@mui/material';
import {
  Timeline,
  TimelineDot,
  TimelineItem,
  TimelineContent,
  TimelineConnector,
  TimelineSeparator,
} from '@mui/lab';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { useGetPatient, useGetMedRecord, useGetOneEntranceManagement } from 'src/api';

import Iconify from 'src/components/iconify';

import Rooms from './rooms';
// import History from './history';
import TabsView from './tabs-view';
import CheckList from './checkList';
import ServicesProvided from './servicesProvided';
import Adjustabledocument from './adjustabledocument';

export default function Processing() {
  const params = useParams();
  const { id } = params;
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { medRecord } = useGetMedRecord(Entrance?.service_unit?._id, Entrance?.patient?._id);
  const { data } = useGetPatient(Entrance?.patient?._id);
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();

  const handleBackClick = (idd) => {
    router.push(paths.employee.recored(idd));
  };
  const firstSequenceNumber =
    medRecord && medRecord.length > 0 ? medRecord[0].sequence_number : null;
  const TIMELINES = [
    {
      key: 0,
      title: (
        <>
          {firstSequenceNumber && (
            <span
              style={{
                backgroundColor: '#22C55E',
                color: 'white',
                padding: 6,
                borderRadius: 10,
              }}
            >
              {t('Visits history')} {firstSequenceNumber}
            </span>
          )}

          <Card sx={{ mt: 2 }}>
            <Box sx={{ maxHeight: 400, overflowY: 'auto', overflowX: 'hidden' }}>
              {medRecord && (
                <Box>
                  <Button onClick={() => handleBackClick(id)} sx={{ width: '100%', m: 1 }}>
                    {curLangAr
                      ? `عرض السجل المرضي ل ${Entrance?.patient?.name_arabic}`
                      : ` View all ${Entrance?.patient?.name_english} Visits history`}
                  </Button>
                  <Divider />
                </Box>
              )}
            </Box>
          </Card>
        </>
      ),
      color: 'info',
      icon: <Iconify icon="healthicons:medical-records-outline" width={25} />,
    },

    // {
    //   key: 1,
    //   title: <History />,
    //   color: 'primary',
    //   icon: <Iconify icon="eva:folder-add-fill" width={24} />,
    // },

    {
      key: 3,
      title: (
        <>
          <span
            style={{ backgroundColor: '#22C55E', color: 'white', padding: 6, borderRadius: 10 }}
          >
            {t('Choose a Check List')}
          </span>
          <CheckList />
        </>
      ),
      color: 'primary',
      icon: <Iconify icon="octicon:checklist-16" width={23} />,
    },
    {
      key: 7,
      title: (
        <>
          {t('Upload files')}
          <br />
          <TabsView patient={data} service_unit={Entrance?.service_unit?._id} />
        </>
      ),
      color: 'info',
      icon: <Iconify icon="mingcute:folders-fill" width={25} />,
    },

    {
      key: 5,
      title: (
        <>
          {t('Adjustable document')} ({t('optional')}) <br />
          <Adjustabledocument patient={data} />
        </>
      ),
      color: 'primary',
      icon: <Iconify icon="mingcute:document-fill" width={24} />,
    },
    {
      key: 6,
      title: (
        <>
          {t('Services provided')}
          <br />
          <ServicesProvided patient={data} />
        </>
      ),
      color: 'info',
      icon: <Iconify icon="hugeicons:give-pill" width={25} />,
    },
  ];

  const renderTimelineItems = (item) => (
    <Paper
      sx={{
        p: 3,
        bgcolor: (themee) => alpha(themee.palette.grey[500], 0.12),
        width: '100%',
      }}
    >
      <Typography variant="subtitle2">{item.title}</Typography>
    </Paper>
  );
  return isMobile ? (
    <div>
      {TIMELINES.map((item) => (
        <div key={item.key} style={{ marginBottom: '16px' }}>
          {renderTimelineItems(item)}
        </div>
      ))}{' '}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <Rooms />
      </Box>
    </div>
  ) : (
    <>
      <Timeline position="alternate-reverse">
        {TIMELINES.map((item) => (
          <TimelineItem key={item.key}>
            <TimelineSeparator>
              <TimelineDot color={item.color}>{item.icon}</TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>{renderTimelineItems(item)}</TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <Rooms />
      </Box>
    </>
  );
}
