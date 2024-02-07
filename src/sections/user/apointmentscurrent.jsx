import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import { _socials } from 'src/_mock';
import MenuItem from '@mui/material/MenuItem';
import { useCallback } from 'react';
import { useRouter } from 'src/routes/hooks';
import { paths } from 'src/routes/paths';

import { fTime, fDate } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useGetPatientAppointments } from 'src/api/tables';
import { useAuthContext } from 'src/auth/hooks';
// ----------------------------------------------------------------------

export default function Currentappoinment() {
  const { user } = useAuthContext();
  const { appointmentsData } = useGetPatientAppointments(user?.patient?._id);
  const popover = usePopover();
  const router = useRouter();

  const pendingAppointments = appointmentsData.filter((info) => info.status === 'pending');
  const onView = useCallback(() => {
    router.push(paths.comingSoon);
  }, [router]);
  return pendingAppointments.map((info, index) => (
    <>
      <Card>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
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
    </>
  ));
}

Currentappoinment.propTypes = {
  user: PropTypes.object,
};
