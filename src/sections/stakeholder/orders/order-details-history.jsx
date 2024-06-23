import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Timeline from '@mui/lab/Timeline';
import TimelineDot from '@mui/lab/TimelineDot';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';

import { fDateTime } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';

// ----------------------------------------------------------------------

export default function OrderDetailsHistory({ history }) {
  const { t } = useTranslate()
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const renderTimeline = (
    <Timeline
      sx={{
        p: 0,
        m: 0,
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}
    >
      {history?.map((item, index) => {
        const firstTimeline = index === 0;

        const lastTimeline = index === history.length - 1;

        return (
          <TimelineItem key={item.note}>
            <TimelineSeparator>
              <TimelineDot color={(firstTimeline && 'primary') || 'grey'} />
              {lastTimeline ? null : <TimelineConnector />}
            </TimelineSeparator>

            <TimelineContent>
              <Typography variant="subtitle2">{curLangAr ? item.arabic_note || item.note  : item.note}</Typography>
              <Stack direction="row" gap={5}>
                <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                  {fDateTime(item.date)}
                </Box>
                <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                  {item.user?.email}
                </Box>
              </Stack>
            </TimelineContent>
          </TimelineItem>
        );
      })}
    </Timeline>
  );

  return (
    <Card>
      <CardHeader title={t("history")} />
      <Scrollbar
        spacing={3}
        alignItems={{ md: 'flex-start' }}
        direction={{ xs: 'column-reverse', md: 'row' }}
        sx={{ p: 3, mt: 2, height: '400px' }}
      >
        {renderTimeline}
      </Scrollbar>
    </Card>
  );
}

OrderDetailsHistory.propTypes = {
  history: PropTypes.object,
};
