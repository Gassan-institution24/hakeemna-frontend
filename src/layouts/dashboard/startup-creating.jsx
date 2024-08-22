import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { LoadingButton } from '@mui/lab';
import { Stack, Checkbox, Typography } from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetUSRooms,
  useGetUSWorkGroups,
  useGetUSWorkShifts,
  useGetUSActivities,
  useGetUSDepartments,
} from 'src/api';

import { ConfirmDialog } from 'src/components/custom-dialog';

export default function StartupCreating({ open, onClose }) {
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslate();
  const checkAcl = useAclGuard();
  const loading = useBoolean();

  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const USData =
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service;

  const { departmentsData } = useGetUSDepartments(USData?._id);
  const { workGroupsData } = useGetUSWorkGroups(USData?._id);
  const { workShiftsData } = useGetUSWorkShifts(USData?._id);
  const { roomsData } = useGetUSRooms(USData?._id);
  const { activitiesData } = useGetUSActivities(USData?._id);

  const [tables, setTables] = useState([]);

  const onAcceptCreating = async () => {
    try {
      loading.onTrue();
      if (tables.includes('department')) {
        await axiosInstance.post(endpoints.departments.all, {
          unit_service: USData?._id,
          name_english: 'main department',
          name_arabic: 'القسم الرئيسي',
        });
      }
      if (tables.includes('work shift')) {
        const start_time = new Date();
        start_time.setHours(8, 0, 0, 0);
        const end_time = new Date();
        end_time.setHours(15, 0, 0, 0);
        await axiosInstance.post(endpoints.work_shifts.all, {
          unit_service: USData?._id,
          start_time,
          end_time,
          name_english: 'morning work shift',
          name_arabic: 'وردية عمل صباحية',
        });
      }
      if (tables.includes('work group')) {
        await axiosInstance.post(endpoints.work_groups.all, {
          unit_service: USData?._id,
          employees: [
            user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?._id,
          ],
          name_english: `${user.employee?.name_english} work group`,
          name_arabic: `فريق عمل ${user.employee?.name_arabic}`,
        });
      }
      if (tables.includes('rooms')) {
        await axiosInstance.post(endpoints.rooms.all, {
          unit_service: USData?._id,
          name_english: `room 1`,
          name_arabic: `غرفة 1`,
        });
        await axiosInstance.post(endpoints.rooms.all, {
          unit_service: USData?._id,
          name_english: `room 2`,
          name_arabic: `غرفة 2`,
        });
      }
      if (tables.includes('activities')) {
        await axiosInstance.post(endpoints.activities.all, {
          unit_service: USData?._id,
          name_english: `accounting`,
          name_arabic: `المحاسبة`,
        });
        await axiosInstance.post(endpoints.activities.all, {
          unit_service: USData?._id,
          name_english: `consultant`,
          name_arabic: `استشارة`,
        });
        await axiosInstance.post(endpoints.activities.all, {
          unit_service: USData?._id,
          name_english: `vital sign monotoring`,
          name_arabic: `فحص العلامات الحيوية`,
        });
        await axiosInstance.post(endpoints.activities.all, {
          unit_service: USData?._id,
          name_english: `diagnosis`,
          name_arabic: `تشخيص`,
        });
      }
      loading.onFalse();
      onClose();
      window.location.reload();
    } catch (error) {
      loading.onFalse();
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      onclose();
    }
  };
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      title={t('creating startup data')}
      content={
        <Stack sx={{ p: 1 }}>
          <Typography variant="subtitle2" paddingBottom="15px">
            {t('Dear member of our community,')}
          </Typography>
          <Typography variant="subtitle2" paddingBottom="15px">
            {t('Thank you for registering in Hakeemna.Online; for the correct installation of the system, it is required some information of your institution to assure the well functionality of our sustenm.')}
          </Typography>

          <Typography variant="subtitle2" paddingBottom="15px">
            {t('For that, we recommend you to complete the next required information of your institution: 1) department, 2) work group, 3) work shift, 4) rooms.')}
          </Typography>

          <Typography variant="subtitle2" paddingBottom="15px">
            {t("To make this step easier, we suggest you to use our 'setup information' that will insert automatically the required data.")}
          </Typography>

          <Typography variant="subtitle2" paddingBottom="15px">
            {t("Please select 'all' or the 'specify' which information that you want to insert automatically.")}
          </Typography>

          {USData &&
            (!USData?.employees_number || USData?.employees_number > 3) &&
            checkAcl({ category: 'unit_service', subcategory: 'departments', acl: 'create' }) && (
              <Stack direction="row">
                <Checkbox
                  disabled={departmentsData.length > 0}
                  checked={tables.includes('department')}
                  onChange={() =>
                    tables.includes('department')
                      ? setTables(tables.filter((one) => one !== 'department'))
                      : setTables((prev) => [...prev, 'department'])
                  }
                />
                <Typography variant="subtitle2" alignSelf="center">
                  {t('department')}
                </Typography>
                {departmentsData.length > 0 && (
                  <Typography
                    sx={{ p: 2, color: 'error.main' }}
                    alignSelf="center"
                    variant="caption"
                  >
                    {t('already created')}
                  </Typography>
                )}
              </Stack>
            )}

          <Stack direction="row">
            <Checkbox
              disabled={workGroupsData.length > 0}
              checked={tables.includes('work group')}
              onChange={() =>
                tables.includes('work group')
                  ? setTables(tables.filter((one) => one !== 'work group'))
                  : setTables((prev) => [...prev, 'work group'])
              }
            />
            <Typography variant="subtitle2" alignSelf="center">
              {t('work group')}
            </Typography>
            {workGroupsData.length > 0 && (
              <Typography sx={{ p: 2, color: 'error.main' }} alignSelf="center" variant="caption">
                {t('already created')}
              </Typography>
            )}
          </Stack>

          <Stack direction="row">
            <Checkbox
              disabled={workShiftsData.length > 0}
              checked={tables.includes('work shift')}
              onChange={() =>
                tables.includes('work shift')
                  ? setTables(tables.filter((one) => one !== 'work shift'))
                  : setTables((prev) => [...prev, 'work shift'])
              }
            />
            <Typography variant="subtitle2" alignSelf="center">
              {t('work shift')}
            </Typography>
            {workShiftsData.length > 0 && (
              <Typography sx={{ p: 2, color: 'error.main' }} alignSelf="center" variant="caption">
                {t('already created')}
              </Typography>
            )}
          </Stack>
          <Stack direction="row">
            <Checkbox
              disabled={roomsData.length > 1}
              checked={tables.includes('rooms')}
              onChange={() =>
                tables.includes('rooms')
                  ? setTables(tables.filter((one) => one !== 'rooms'))
                  : setTables((prev) => [...prev, 'rooms'])
              }
            />
            <Typography variant="subtitle2" alignSelf="center">
              {t('rooms')}
            </Typography>
            {roomsData.length > 1 && (
              <Typography sx={{ p: 2, color: 'error.main' }} alignSelf="center" variant="caption">
                {t('already created')}
              </Typography>
            )}
          </Stack>
          <Stack direction="row">
            <Checkbox
              disabled={activitiesData.length > 1}
              checked={tables.includes('activities')}
              onChange={() =>
                tables.includes('activities')
                  ? setTables(tables.filter((one) => one !== 'activities'))
                  : setTables((prev) => [...prev, 'activities'])
              }
            />
            <Typography variant="subtitle2" alignSelf="center">
              {t('activities')}
            </Typography>
            {activitiesData.length > 1 && (
              <Typography sx={{ p: 2, color: 'error.main' }} alignSelf="center" variant="caption">
                {t('already created')}
              </Typography>
            )}
          </Stack>
        </Stack>
      }
      action={
        <LoadingButton
          loading={loading.value}
          variant="contained"
          color="info"
          onClick={onAcceptCreating}
        >
          {t('create')}
        </LoadingButton>
      }
    />
  );
}
StartupCreating.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
