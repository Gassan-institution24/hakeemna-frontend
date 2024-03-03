import PropTypes from 'prop-types';
import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fTime, fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
// ----------------------------------------------------------------------

export default function Currentappoinment({ pendingAppointments }) {
  const popover = usePopover();
  const router = useRouter();
console.log(pendingAppointments);
  const onView = useCallback(() => {
    router.push(paths.comingSoon);
  }, [router]);
  return pendingAppointments.map((info, index) => (
    <Card key={index}>
      <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
        <Iconify icon="eva:more-vertical-fill" />
      </IconButton>
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
          {fDate(info?.start_time)}
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
            icon: <Iconify width={16} icon="medical-icon:health-services" sx={{ flexShrink: 0 }} />,
          },
          {
            label: info?.status,
            icon: <Iconify width={16} icon="fa-solid:file-medical-alt" sx={{ flexShrink: 0 }} />,
          },
          {
            label: <Typography sx={{ color: 'success.main', fontSize:13, ml:0.1  }}>{info?.price}</Typography>,
            icon: <Iconify width={16} icon="streamline:payment-10-solid" sx={{ flexShrink: 0 }} />,
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
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        {}
        <MenuItem
          onClick={() => {
            popover.onClose();
            onView();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          View
        </MenuItem>
      </CustomPopover>
    </Card>
  ));
}

Currentappoinment.propTypes = {
  user: PropTypes.object,
};
