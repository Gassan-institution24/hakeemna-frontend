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

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetEmployeeAdjustabledocument } from 'src/api/adjustabledocument';
import {
  useGetPatient,
  useGetMedRecord,
  useGetMyCheckLists,
  useGetUSServiceTypes,
  useGetOneEntranceManagement,
} from 'src/api';

import Iconify from 'src/components/iconify';

import Rooms from './insideRooms';
// import History from './history';
import TabsView from './tabs-view';
import CheckList from './checkList';
import ServicesProvided from './servicesProvided';
import Adjustabledocument from './adjustabledocument';

export default function Processing() {
  const params = useParams();
  const { user } = useAuthContext();

  const { id } = params;
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { medRecord } = useGetMedRecord(
    Entrance?.service_unit?._id,
    Entrance?.patient?._id,
    Entrance?.unit_service_patient
  );
  const { data } = useGetPatient(Entrance?.patient?._id);
  const { CheckListData } = useGetMyCheckLists(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]?._id
  );
  const { adjustabledocument } = useGetEmployeeAdjustabledocument(user?.employee?._id);
  const { serviceTypesData } = useGetUSServiceTypes(
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id
  );
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
    medRecord && medRecord?.length > 0 ? medRecord[0].sequence_number : null;
  const TIMELINES = [
    medRecord?.length > 0 && {
      key: 0,
      title: (
        <>
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

          <Card sx={{ mt: 2 }}>
            <Box sx={{ maxHeight: 400, overflowY: 'auto', overflowX: 'hidden' }}>
              {medRecord && (
                <Box>
                  <Button onClick={() => handleBackClick(id)} sx={{ width: '100%', m: 1 }}>
                    {curLangAr ? (
                      `اضغط لعرض تاريخ الزيارة ل ${Entrance?.patient?.name_arabic}`
                    ) : (
                      <>
                        <span style={{ color: '#22C55E' }}>Click&nbsp;</span> to view all{' '}
                        {Entrance?.patient?.name_english} Visits history
                      </>
                    )}
                  </Button>
                  <Divider />
                </Box>
              )}
            </Box>
          </Card>
        </>
      ),
      icon: <Iconify icon="healthicons:medical-records-outline" width={25} />,
    },

    CheckListData?.length > 0 && {
      key: 1,
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
      icon: <Iconify icon="octicon:checklist-16" width={23} />,
    },
    {
      key: 7,
      title: (
        <>
          {t('Upload files')}
          <br />
          <TabsView
            patient={data}
            unit_service_patient={Entrance?.unit_service_patient}
            service_unit={Entrance?.service_unit?._id}
          />
        </>
      ),
      icon: <Iconify icon="mingcute:folders-fill" width={25} />,
    },
    adjustabledocument?.length > 0 && {
      key: 5,
      title: (
        <>
          {t('Adjustable document')} ({t('optional')}) <br />
          <Adjustabledocument
            patient={data}
            unit_service_patient={Entrance?.unit_service_patient}
          />
        </>
      ),
      icon: <Iconify icon="mingcute:document-fill" width={24} />,
    },
    serviceTypesData && {
      key: 6,
      title: (
        <>
          {t('Services provided')}
          <br />
          <ServicesProvided patient={data} />
        </>
      ),
      icon: <Iconify icon="hugeicons:give-pill" width={25} />,
    },
  ]
    .filter(Boolean)
    .map((item, index) => ({
      ...item,
      color: index % 2 === 0 ? 'primary' : 'info',
    }));

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
  const lineBreaks = Array(14).fill(<br />);
  return isMobile ? (
    <div>
      {TIMELINES.map((item) => (
        <div key={item.key} style={{ marginBottom: '16px' }}>
          {renderTimelineItems(item)}
        </div>
      ))}{' '}
      {lineBreaks.map((br) => (
        <>{br}</>
      ))}
      <Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <Rooms />
      </Box>
    </div>
  ) : (
    <>
      <Timeline position="alternate">
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

      {lineBreaks.map((br) => (
        <>{br}</>
      ))}
      <Box sx={{ position: 'fixed', bottom: 0, width: '100%' }}>
        <Rooms />
      </Box>
    </>
  );
}
