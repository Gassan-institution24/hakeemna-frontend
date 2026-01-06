import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import TableRow from '@mui/material/TableRow';
import { alpha, useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

// import Typography from '@mui/material/Typography';
import { useGetStatistics } from 'src/api';
import { useGetVideoCalls } from 'src/api/video_calls';

import { useSettingsContext } from 'src/components/settings';

// import AnalyticsNews from '../analytics-news';
// import AnalyticsTasks from '../analytics-tasks';
import FileDataActivity from '../file-data-activity';
import AnalyticsCurrentVisits from '../analytics-current-visits';
// import AnalyticsOrderTimeline from '../analytics-order-timeline';
// import AnalyticsWebsiteVisits from '../analytics-website-visits';
import AnalyticsWidgetSummary from '../analytics-widget-summary';
// import AnalyticsTrafficBySite from '../analytics-traffic-by-site';
// import AnalyticsCurrentSubject from '../analytics-current-subject';
// import AnalyticsConversionRates from '../analytics-conversion-rates';
// import BookingStatistics from '../booking-statistics';

// ----------------------------------------------------------------------

const TIME_LABELS = {
  week: ['Mon', 'Tue', 'Web', 'Thu', 'Fri', 'Sat', 'Sun'],
  month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  year: ['2018', '2019', '2020', '2021', '2022'],
};
export default function OverviewAnalyticsView() {
  const settings = useSettingsContext();
  const currentYear = new Date().getFullYear();
  const theme = useTheme();
  const {
    unitServicesNumber,
    employeesNumber,
    patientsNumber,
    usersNumber,
    specialitiesEmployees,
  } = useGetStatistics();
  const { data } = useGetVideoCalls();
  const videoCallsCount = data?.length || 0;
  const totalSeconds = data?.reduce((acc, call) => acc + (call.duration || 0), 0) || 0;

  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const isMobile = useMediaQuery('(max-width: 899px)');
  const videoCallsThisYear = (data || []).filter((call) => {
    if (!call.created_at) return false;

    const callYear = new Date(call.created_at).getFullYear();
    return callYear === currentYear;
  });
  const tableTotalSeconds = videoCallsThisYear.reduce((acc, call) => acc + (call.duration || 0), 0);

  const tableMinutes = Math.floor(tableTotalSeconds / 60);
  const tableSeconds = tableTotalSeconds % 60;

  const videoCallsByUnit = videoCallsThisYear.reduce((acc, call) => {
    const unit = call.unit_service;
    if (!unit?._id) return acc;

    const unitId = unit._id;
    const unitName = unit.name_english || unit.name_arabic || 'Unknown';

    if (!acc[unitId]) {
      acc[unitId] = {
        unitId,
        unitName,
        totalCalls: 0,
        totalSeconds: 0,
      };
    }

    acc[unitId].totalCalls += 1;
    acc[unitId].totalSeconds += call.duration || 0;

    return acc;
  }, {});

  const videoCallsTableData = Object.values(videoCallsByUnit);
  const formatMinutesSeconds = (seconds1 = 0) => {
    const minutes1 = Math.floor(seconds1 / 60);
    const remainingSeconds = seconds1 % 60;
    return `${minutes1}.${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {/* <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Hi, Welcome back 👋
      </Typography> */}

      <Grid container spacing={3}>
        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="total users"
            total={usersNumber}
            color="error"
            icon={
              <img
                decoding="async"
                loading="lazy"
                alt="icon"
                src="/assets/icons/glass/ic_glass_message.png"
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="units of service"
            total={unitServicesNumber}
            icon={
              <img
                decoding="async"
                loading="lazy"
                alt="icon"
                src="/assets/icons/glass/ic_glass_bag.png"
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="employees"
            total={employeesNumber}
            color="warning"
            icon={
              <img
                decoding="async"
                loading="lazy"
                alt="icon"
                src="/assets/icons/glass/ic_glass_buy.png"
              />
            }
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="patients"
            total={patientsNumber}
            color="info"
            icon={
              <img
                decoding="async"
                loading="lazy"
                alt="icon"
                src="/assets/icons/glass/ic_glass_users.png"
              />
            }
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <Stack
            alignItems="center"
            sx={{
              background: `linear-gradient(135deg,
        ${alpha(theme.palette.success.light, 0.2)},
        ${alpha(theme.palette.success.main, 0.2)}
      )`,
              py: 5,
              borderRadius: 2,
              textAlign: 'center',
              color: 'success.darker',
              backgroundColor: 'common.white',
            }}
          >
            <Box sx={{ width: 64, height: 64, mb: 1 }}>
              <img
                decoding="async"
                loading="lazy"
                alt="icon"
                src="/assets/icons/glass/ic_glass_video.png"
              />
            </Box>

            <Typography variant="h3">{videoCallsCount}</Typography>

            <Typography variant="subtitle2" sx={{ opacity: 0.64, mt: 0.5 }}>
              video calls
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              Total minutes : {minutes} min {seconds} sec
            </Typography>
          </Stack>
        </Grid>

        <Grid xs={12}>
          <FileDataActivity
            title="Data Activity"
            chart={{
              labels: TIME_LABELS,
              colors: [
                theme.palette.primary.main,
                theme.palette.error.main,
                theme.palette.warning.main,
                theme.palette.text.disabled,
              ],
              series: [
                {
                  type: 'Week',
                  data: [
                    { name: 'Images', data: [20, 34, 48, 65, 37, 48, 9] },
                    { name: 'Media', data: [10, 34, 13, 26, 27, 28, 18] },
                    { name: 'Documents', data: [10, 14, 13, 16, 17, 18, 28] },
                    { name: 'Other', data: [5, 12, 6, 7, 8, 9, 48] },
                  ],
                },
                {
                  type: 'Month',
                  data: [
                    {
                      name: 'Images',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                    },
                    {
                      name: 'Media',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                    },
                    {
                      name: 'Documents',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                    },
                    {
                      name: 'Other',
                      data: [10, 34, 13, 56, 77, 88, 99, 77, 45, 12, 43, 34],
                    },
                  ],
                },
                {
                  type: 'Year',
                  data: [
                    { name: 'Images', data: [10, 34, 13, 56, 77] },
                    { name: 'Media', data: [10, 34, 13, 56, 77] },
                    { name: 'Documents', data: [10, 34, 13, 56, 77] },
                    { name: 'Other', data: [10, 34, 13, 56, 77] },
                  ],
                },
              ],
            }}
          />
        </Grid>

        {/* <Grid xs={12}>
              <BookingStatistics
                title="Statistics"
                subheader="(+43% Sold | +12% Canceled) than last year"
                chart={{
                  colors: [theme.palette.primary.main, theme.palette.error.light],
                  categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep','Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
                  series: [
                    {
                      type: 'Week',
                      data: [
                        {
                          name: 'Sold',
                          data: [10, 41, 35, 151, 49, 62, 69, 91, 48],
                        },
                        {
                          name: 'Canceled',
                          data: [10, 34, 13, 56, 77, 88, 99, 77, 45],
                        },
                      ],
                    },
                    {
                      type: 'Month',
                      data: [
                        {
                          name: 'Sold',
                          data: [148, 91, 69, 62, 49, 51, 35, 41, 10],
                        },
                        {
                          name: 'Canceled',
                          data: [45, 77, 99, 88, 77, 56, 13, 34, 10],
                        },
                      ],
                    },
                    {
                      type: 'Year',
                      data: [
                        {
                          name: 'Sold',
                          data: [76, 42, 29, 41, 27, 138, 117, 86, 63],
                        },
                        {
                          name: 'Canceled',
                          data: [80, 55, 34, 114, 80, 130, 15, 28, 55],
                        },
                      ],
                    },
                  ],
                }}
              />
            </Grid> */}
        <Grid xs={12} md={7}>
          <AnalyticsCurrentVisits
            title="employees specialities"
            chart={{
              series: specialitiesEmployees,
            }}
          />
        </Grid>
        <Grid xs={12}>
          <Card sx={{ borderRadius: 2 }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">Video Calls by Unit Service for {currentYear}</Typography>
            </Box>

            <Divider />

            {isMobile ? (
              <Stack spacing={2} sx={{ p: 2 }}>
                {videoCallsTableData.map((row) => (
                  <Card key={row.unitId} variant="outlined" sx={{ p: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {row.unitName}
                    </Typography>

                    <Divider sx={{ my: 1 }} />

                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">Calls</Typography>
                      <Typography variant="body2" fontWeight={600}>
                        {row.totalCalls}
                      </Typography>
                    </Stack>

                    <Stack direction="row" justifyContent="space-between" mt={1}>
                      <Typography variant="body2">Duration</Typography>
                      <Typography variant="body2" fontWeight={600} color="success.main">
                        {formatMinutesSeconds(row.totalSeconds)}
                      </Typography>
                    </Stack>
                  </Card>
                ))}
                <Card
                  variant="outlined"
                  sx={{
                    p: 2,
                    bgcolor: 'grey.100',
                    borderStyle: 'dashed',
                  }}
                >
                  <Typography variant="subtitle1" fontWeight={700}>
                    Total
                  </Typography>

                  <Divider sx={{ my: 1 }} />

                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2">Total Calls</Typography>
                    <Typography variant="body2" fontWeight={700}>
                      {videoCallsTableData.reduce((acc, row) => acc + row.totalCalls, 0)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" justifyContent="space-between" mt={1}>
                    <Typography variant="body2">Total Duration</Typography>
                    <Typography variant="body2" fontWeight={700} color="success.main">
                      {tableMinutes} min {tableSeconds} sec
                    </Typography>
                  </Stack>
                </Card>
              </Stack>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell>Unit Service</TableCell>
                      <TableCell align="center">Calls</TableCell>
                      <TableCell align="center">Total Duration</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {videoCallsTableData.map((row) => (
                      <TableRow key={row.unitId} hover>
                        <TableCell>{row.unitName}</TableCell>
                        <TableCell align="center">{row.totalCalls}</TableCell>
                        <TableCell align="center" sx={{ color: 'success.main', fontWeight: 600 }}>
                          {formatMinutesSeconds(row.totalSeconds)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow sx={{ bgcolor: 'grey.100' }}>
                      <TableCell>
                        <Typography fontWeight={700}>Total</Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography fontWeight={700}>
                          {videoCallsTableData.reduce((acc, row) => acc + row.totalCalls, 0)}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Typography fontWeight={700} color="success.main">
                          {tableMinutes} min {tableSeconds} sec
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
