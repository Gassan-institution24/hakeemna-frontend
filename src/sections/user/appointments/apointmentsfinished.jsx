import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fTime, fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function FinishedAppoinment({ finishedAppointments }) {
  return finishedAppointments.map((info, index) => (
    <Box>
      <Card key={index}>
        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            alt={info?.name_english}
            src={info?.unit_service?.company_logo}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          {info?.work_group?.employees?.map((doctor, name, idx) => (
            <ListItemText
              key={idx}
              primary={
                doctor?.employee?.visibility_online_appointment === true ? (
                  <span style={{ color: 'inherit' }}>
                    {' '}
                    Dr. {doctor?.employee?.employee?.first_name}
                  </span>
                ) : null
              }
              secondary={
                <span style={{ color: 'inherit' }}> {info?.unit_service?.name_english}</span>
              }
              primaryTypographyProps={{
                typography: 'subtitle1',
              }}
              secondaryTypographyProps={{
                mt: 1,
                component: 'span',
                typography: 'caption',
                color: 'text.disabled',
              }}
            />
          ))}

          <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
            {fDate(info?.start_time)}
          </Stack>
          <Stack
            spacing={0.5}
            direction="row"
            alignItems="center"
            sx={{ color: 'primary.main', typography: 'caption', mt: 1 }}
          >
            <Iconify width={16} icon="emojione-v1:note-page" />
            {info.note}
          </Stack>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box
          rowGap={2}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{ p: 3, justifyContent: 'space-between' }}
        >
          {[
            {
              label: `${fTime(info.start_time)}`,
              icon: <Iconify width={16} icon="icon-park-solid:time" sx={{ flexShrink: 0 }} />,
            },
            {
              label: info?.status,
              icon: <Iconify width={16} icon="fa-solid:file-medical-alt" sx={{ flexShrink: 0 }} />,
            },
            {
              label: (
                <Typography sx={{ color: 'success.main', fontSize: 13, ml: 0.1 }}>
                  {info?.price}
                </Typography>
              ),
              icon: (
                <Iconify width={16} icon="streamline:payment-10-solid" sx={{ flexShrink: 0 }} />
              ),
            },
          ].map((item, idx) => (
            <Stack
              key={idx}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'text.disabled', minWidth: 0 }}
            >
              {item?.icon}
              <Typography variant="caption" noWrap>
                {item?.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Card>
    </Box>
  ));
}

FinishedAppoinment.propTypes = {
  finishedAppointments: PropTypes.array,
};
