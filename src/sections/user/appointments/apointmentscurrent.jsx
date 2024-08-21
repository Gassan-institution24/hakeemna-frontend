import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Button, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogActions from '@mui/material/DialogActions';

import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { fTime, fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export default function Currentappoinment({ pendingAppointments, refetch }) {
  const { t } = useTranslate();

  const { enqueueSnackbar } = useSnackbar();
  const [theId, setTheId] = useState();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const dialog = useBoolean(false);
  const { fullWidth } = useState(false);
  const { maxWidth } = useState('xs');
  const defaultValues = {
    patient: user?.patient?._id,
    title: `Appointment canceled successfully`,
    title_arabic: `تم الغاء الموعد بنجاح`,
    photo_URL: 'https://cdn-icons-png.freepik.com/512/391/391247.png',
    category: 'appointmentcancel',
    type: 'appointmentcancel',
  };
  const cancelBook = async () => {
    try {
      await axios.patch(`${endpoints.appointments.one(theId)}/cancel`, { info: defaultValues });
      refetch();
      enqueueSnackbar('Your appointment canceled successfully', { variant: 'success' });
      dialog.onFalse();
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };

  const savedId = async (id) => {
    setTheId(id);
    dialog.onTrue();
  };
  return pendingAppointments?.map((info, index) => (
    <>
      <Dialog open={dialog.value} maxWidth={maxWidth} onClose={dialog.onTrue} fullWidth={fullWidth}>
        <DialogTitle>{t('Are you sure you want to cancel')}</DialogTitle>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            margin: '20px',
            gap: '10px',
          }}
        >
          <Image
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTQmAZv0f5Hmss7QXQNK_utfkNQT24-uvV-kQ&usqp=CAU"
            sx={{
              width: '60px',
              height: '60px',
              border: '1px solid lightgreen',
              borderRadius: '50px',
            }}
          />
        </div>

        <DialogActions>
          <Button onClick={dialog.onFalse} variant="outlined" color="inherit">
            {t('No')}
          </Button>
          <Button variant="contained" onClick={() => cancelBook()}>
            {t('yes')}
          </Button>
        </DialogActions>
      </Dialog>
      <Box>
        <Card key={index}>
          <IconButton
            onClick={() => savedId(info?._id)}
            sx={{ position: 'absolute', top: 8, right: 8, '&:hover': { color: 'red' } }}
            title={t('cancel')}
          >
            <Iconify icon="mdi:cancel-bold" />
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
                primary={
                  doctor?.employee?.visibility_online_appointment === true ? (
                    <span style={{ color: 'inherit' }}>
                      {' '}
                      {t('Dr.')}{' '}
                      {curLangAr
                        ? doctor?.employee?.employee?.name_arabic
                        : doctor?.employee?.employee?.name_english}
                    </span>
                  ) : null
                }
                secondary={
                  doctor?.employee?.visibility_online_appointment === true ? (
                    <>
                      <span style={{ color: 'inherit' }}>
                        {' '}
                        {curLangAr
                          ? doctor?.employee?.employee?.speciality?.name_arabic
                          : doctor?.employee?.employee?.speciality?.name_english}
                      </span>
                      <br />
                      <span style={{ color: 'inherit' }}>
                        {' '}
                        {curLangAr
                          ? info?.unit_service?.name_arabic
                          : info?.unit_service?.name_english}
                      </span>
                    </>
                  ) : null
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
              {fDateAndTime(info?.start_time)}
            </Stack>
            {info?.not && (
              <Stack
                spacing={0.5}
                direction="row"
                alignItems="center"
                sx={{ color: 'primary.main', typography: 'caption', mt: 1 }}
              >
                <Iconify width={16} icon="emojione-v1:note-page" />
                {info.note}
              </Stack>
            )}
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
                label: t(info?.status),
                icon: (
                  <Iconify width={16} icon="fa-solid:file-medical-alt" sx={{ flexShrink: 0 }} />
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
    </>
  ));
}

Currentappoinment.propTypes = {
  refetch: PropTypes.func,
  pendingAppointments: PropTypes.array,
};
