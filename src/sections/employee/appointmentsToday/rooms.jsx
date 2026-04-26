import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import { alpha, useTheme } from '@mui/material/styles';
import {
  Box,
  Card,
  Grid,
  Chip,
  Stack,
  Avatar,
  Button,
  Divider,
  Typography,
  CardContent,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance from 'src/utils/axios';
import { useFDateTimeUnit } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetRoom,
  useGetUSRooms,
  useGetEmployeeRooms,
  useGetEntranceManagementByActivity,
} from 'src/api';

import Iconify from 'src/components/iconify';

// ─── Helper ──────────────────────────────────────────────────────────────────

function getInitials(name = '') {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0] || '')
    .join('')
    .toUpperCase();
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function WaitingRoom() {
  const { fTimeUnit } = useFDateTimeUnit();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const router = useRouter();
  const theme = useTheme();
  const { user } = useAuthContext();

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const { roomsData } = useGetUSRooms(unitServiceId);
  const { employeeRoomsData } = useGetEmployeeRooms(user.employee._id);

  const receptionActivity = roomsData.find(
    (activity) => activity?.activities?.name_english === 'Reception'
  );

  const [selectedTitle, setSelectedTitle] = useState();
  const { data } = useGetRoom(selectedTitle);
  const { EntranceByActivity } = useGetEntranceManagementByActivity(
    data?.activities,
    unitServiceId
  );

  useEffect(() => {
    setSelectedTitle(employeeRoomsData?._id);
  }, [employeeRoomsData]);

  // ─── Actions ──────────────────────────────────────────────────────────────

  const goToProcessingPage = async (entrance) => {
    try {
      await axiosInstance.patch(`/api/entrance/${entrance?._id}`, {
        Current_activity: entrance?.Next_activity?._id,
      });
      router.push(`${paths.unitservice.departments.processingPage}/${entrance?._id}`);
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(t('Error updating status'), { variant: 'error' });
    }
  };

  const updateRoom = async (roomId) => {
    try {
      const { data: allRooms } = await axiosInstance.get(`/api/rooms/unitservice/${unitServiceId}`);

      const currentRoom = allRooms.find((room) =>
        room.employee?.some((emp) => emp._id === user?.employee?._id)
      );
      if (currentRoom) {
        await axiosInstance.patch(`/api/rooms/${currentRoom?._id}`, {
          employee: currentRoom.employee.filter((emp) => emp._id !== user?.employee?._id),
        });
      }

      const targetRoom = allRooms.find((one) => one._id === roomId);
      const nextRoomEmployees = targetRoom ? targetRoom.employee : [];
      const isEmployeeInTargetRoom = nextRoomEmployees.some(
        (emp) => emp._id === user?.employee?._id
      );

      if (!isEmployeeInTargetRoom) {
        await axiosInstance.patch(`/api/rooms/${roomId}`, {
          employee: [...nextRoomEmployees, user?.employee?._id],
        });
        enqueueSnackbar(t('Room updated successfully'), { variant: 'success' });
      } else {
        enqueueSnackbar(t('Employee is already in the selected room'), { variant: 'info' });
      }
    } catch (error) {
      console.error('Error updating room:', error.message);
      enqueueSnackbar(t('Error updating room'), { variant: 'error' });
    }
  };

  const availableRooms = roomsData.filter(
    (r) => r?.activities?.name_english !== receptionActivity?.activities?.name_english
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <Box sx={{ mt: 3 }}>
      {/* ── Room selector ── */}
      <Card
        sx={{
          mb: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
          borderRadius: 2.5,
          boxShadow: 'none',
        }}
      >
        <Box
          sx={{ height: 4, borderRadius: '10px 10px 0 0', bgcolor: 'primary.main', opacity: 0.7 }}
        />
        <CardContent sx={{ p: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <Iconify
              icon="solar:map-point-bold-duotone"
              sx={{ color: 'primary.main' }}
              width={22}
            />
            <Typography variant="subtitle1" fontWeight={700}>
              {t('Kindly select your assigned work area for today')}
            </Typography>
          </Stack>

          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            {availableRooms.map((room) => {
              const roomName = curLangAr ? room?.name_arabic : room?.name_english;
              const isSelected = selectedTitle === room._id;
              return (
                <Chip
                  key={room._id}
                  label={roomName}
                  icon={
                    <Iconify
                      icon={isSelected ? 'solar:door-open-bold' : 'solar:door-bold'}
                      width={16}
                    />
                  }
                  color={isSelected ? 'primary' : 'default'}
                  variant={isSelected ? 'filled' : 'outlined'}
                  onClick={() => {
                    setSelectedTitle(room._id);
                    updateRoom(room._id);
                  }}
                  sx={{ fontWeight: isSelected ? 700 : 500, px: 0.5, cursor: 'pointer' }}
                />
              );
            })}
          </Stack>
        </CardContent>
      </Card>

      {/* ── Patient queue ── */}
      {!EntranceByActivity?.length ? (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            borderRadius: 3,
            border: `1.5px dashed ${alpha(theme.palette.grey[500], 0.24)}`,
            bgcolor: alpha(theme.palette.grey[500], 0.04),
          }}
        >
          <Iconify
            icon="solar:users-group-two-rounded-bold-duotone"
            width={64}
            sx={{ color: 'text.disabled', mb: 2 }}
          />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t('No patients waiting')}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={2.5}>
          {EntranceByActivity?.map((entranceData, i) => {
            let patientName;
            if (entranceData.patient) {
              patientName = curLangAr
                ? entranceData?.patient?.name_arabic || entranceData?.patient?.name_english
                : entranceData?.patient?.name_english || entranceData?.patient?.name_arabic;
            } else if (entranceData.unit_service_patient) {
              patientName = curLangAr
                ? entranceData?.unit_service_patient?.name_arabic ||
                  entranceData?.unit_service_patient?.name_english
                : entranceData?.unit_service_patient?.name_english ||
                  entranceData?.unit_service_patient?.name_arabic;
            }

            return (
              <Grid item xs={12} sm={6} md={4} xl={3} key={i}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    border: `1px solid ${alpha(theme.palette.divider, 0.14)}`,
                    borderRadius: 2.5,
                    boxShadow: 'none',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: `0 12px 32px ${alpha(theme.palette.grey[500], 0.2)}`,
                    },
                  }}
                >
                  {/* Queue number accent */}
                  <Box
                    sx={{
                      height: 4,
                      borderRadius: '10px 10px 0 0',
                      bgcolor: 'success.main',
                      opacity: 0.7,
                    }}
                  />

                  <CardContent
                    sx={{
                      p: 2.5,
                      pb: '20px !important',
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Header */}
                    <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
                      <Avatar
                        sx={{
                          width: 44,
                          height: 44,
                          bgcolor: alpha(theme.palette.success.main, 0.12),
                          color: 'success.main',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          flexShrink: 0,
                        }}
                      >
                        {getInitials(patientName)}
                      </Avatar>

                      <Box flex={1} minWidth={0}>
                        <Typography variant="subtitle2" fontWeight={700} noWrap>
                          {patientName}
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={0.5} mt={0.3}>
                          <Iconify
                            icon="solar:clock-circle-outline"
                            width={13}
                            sx={{ color: 'text.disabled' }}
                          />
                          <Typography variant="caption" color="text.disabled" fontWeight={500}>
                            {fTimeUnit(entranceData?.Arrival_time, 'p', true)}
                          </Typography>
                        </Stack>
                      </Box>

                      <Chip
                        size="small"
                        label={`#${i + 1}`}
                        color="success"
                        sx={{ fontWeight: 700, minWidth: 36 }}
                      />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {/* Last activity badge */}
                    {entranceData?.Last_activity_atended?.name_english && (
                      <Stack direction="row" alignItems="center" spacing={1} mb={1.5}>
                        <Iconify
                          icon="solar:history-bold"
                          width={15}
                          sx={{ color: 'text.secondary', flexShrink: 0 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          {t('From')}:{' '}
                          <strong>{entranceData.Last_activity_atended.name_english}</strong>
                        </Typography>
                      </Stack>
                    )}

                    {/* Doctor note */}
                    {entranceData?.note && (
                      <Box
                        sx={{
                          p: 1.25,
                          mb: 2,
                          borderRadius: 1.5,
                          bgcolor: alpha(theme.palette.info.main, 0.06),
                          border: `1px solid ${alpha(theme.palette.info.main, 0.15)}`,
                        }}
                      >
                        <Stack direction="row" spacing={0.75} alignItems="flex-start">
                          <Iconify
                            icon="solar:notes-bold"
                            width={15}
                            sx={{ color: 'info.main', mt: 0.25, flexShrink: 0 }}
                          />
                          <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ lineHeight: 1.5 }}
                          >
                            {entranceData.note}
                          </Typography>
                        </Stack>
                      </Box>
                    )}

                    {/* Proceed CTA */}
                    <Box sx={{ mt: 'auto' }}>
                      <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<Iconify icon="solar:arrow-right-bold" width={16} />}
                        onClick={() => goToProcessingPage(entranceData)}
                        sx={{ borderRadius: 1.5, fontWeight: 700 }}
                      >
                        {t('Proceed')}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
}
