import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fTime, fDate } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useGetPatientAppointments } from 'src/api';

import Iconify from 'src/components/iconify';
// ----------------------------------------------------------------------

export default function FinishedAppoinment() {
  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientAppointments(user?.patient?._id);

  const finishedAppointments = appointmentsData.filter((info) => info.status === 'finished');

  return finishedAppointments.map((info, index) => (
    <Card key={index}>
      <Stack sx={{ p: 3, pb: 2 }}>
        <Avatar
          alt={info?.name_english}
          src={info?.unit_service?.company_logo}
          variant="rounded"
          sx={{ width: 48, height: 48, mb: 2 }}
        />
        {info?.work_group?.employees?.map((doctor, name) => (
          <ListItemText
            key={name}
            primary={<span style={{ color: 'inherit' }}> Dr. {doctor?.employee?.first_name}</span>}
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
          {fDate(info?.created_at)}
        </Stack>
        <Stack
          spacing={0.5}
          direction="row"
          alignItems="center"
          sx={{ color: 'primary.main', typography: 'caption' }}
        >
          <Iconify width={16} icon="ic:baseline-tag" />
          {info.code}
        </Stack>
      </Stack>

      <Divider sx={{ borderStyle: 'dashed' }} />

      <Box
        rowGap={1.5}
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
            label: info?.department?.name_english,
            icon: <Iconify width={16} icon="medical-icon:health-services" sx={{ flexShrink: 0 }} />,
          },
          {
            label: info?.status,
            icon: <Iconify width={16} icon="fa-solid:file-medical-alt" sx={{ flexShrink: 0 }} />,
          },
          {
            label: info?.price,
            icon: <Iconify width={16} icon="streamline:payment-10-solid" sx={{ flexShrink: 0 }} />,
          },
        ].map((item, key) => (
          <Stack
            key={key}
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
  ));
}

FinishedAppoinment.propTypes = {
  user: PropTypes.object,
};
