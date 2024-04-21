import { useTheme } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';

// import Typography from '@mui/material/Typography';
import { useGetStatistics } from 'src/api';

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
  const theme = useTheme();
  const {
    unitServicesNumber,
    employeesNumber,
    patientsNumber,
    usersNumber,
    specialitiesEmployees,
  } = useGetStatistics();
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
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_message.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="unit of services"
            total={unitServicesNumber}
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_bag.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="employees"
            total={employeesNumber}
            color="warning"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_buy.png" />}
          />
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <AnalyticsWidgetSummary
            title="patients"
            total={patientsNumber}
            color="info"
            icon={<img alt="icon" src="/assets/icons/glass/ic_glass_users.png" />}
          />
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
      </Grid>
    </Container>
  );
}
