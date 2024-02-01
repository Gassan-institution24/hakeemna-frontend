import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Link from '@mui/material/Link';
import { Button } from '@mui/material';
import { fShortenNumber } from 'src/utils/format-number';

import { _socials } from 'src/_mock';
import { AvatarShape } from 'src/assets/illustrations';
import { fTime, fDate } from 'src/utils/format-time';
import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useGetPatientAppointments } from 'src/api/tables';
import { useSettingsContext } from 'src/components/settings';
// ----------------------------------------------------------------------

export default function Appoinment({ user }) {
  const theme = useTheme();
  const { appointmentsData } = useGetPatientAppointments(user);

  const pendingAppointments = appointmentsData.filter((info) => info.status === 'pending');

  return pendingAppointments.map((info, index) => (
    <>
      <Card>
        <Stack sx={{ p: 3, pb: 2 }}>
          <Avatar
            alt={info?.name_english}
            src={info?.company_log}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <ListItemText
            secondary={<Link color="inherit">{info?.name_english}</Link>}
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
              label: `${fTime(info.start_time)} ${fTime(info.end_time)}`,
              icon: <Iconify width={16} icon="icon-park-solid:time" sx={{ flexShrink: 0 }} />,
            },
            {
              label: info?.department?.name_english,
              icon: (
                <Iconify width={16} icon="medical-icon:health-services" sx={{ flexShrink: 0 }} />
              ),
            },
            {
              label: info?.status,
              icon: <Iconify width={16} icon="fa-solid:file-medical-alt" sx={{ flexShrink: 0 }} />,
            },
            {
              label: info?.name_english,
              icon: (
                <Iconify width={16} icon="streamline:payment-10-solid" sx={{ flexShrink: 0 }} />
              ),
            },
          ].map((item) => (
            <Stack
              key={item.label}
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
    </>
  ));
}

Appoinment.propTypes = {
  user: PropTypes.object,
};
