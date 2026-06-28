import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Chip,
  Alert,
  Stack,
  Collapse,
  Checkbox,
  Divider,
  Typography,
} from '@mui/material';

import { useBoolean } from 'src/hooks/use-boolean';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useAclGuard } from 'src/auth/guard/acl-guard';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetUSRooms,
  useGetUSWorkGroups,
  useGetUSWorkShifts,
  useGetUSDepartments,
  useGetMedicineCategoriesBySpeciality,
} from 'src/api';
import { useGetFavoriteMedication } from 'src/api/doctor_favorite';

import Iconify from 'src/components/iconify';
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

  const doctorSpeciality = user?.employee?.speciality;
  const doctorSpecialityId = doctorSpeciality?._id || doctorSpeciality;

  const { departmentsData } = useGetUSDepartments(USData?._id);
  const { workGroupsData } = useGetUSWorkGroups(USData?._id);
  const { workShiftsData } = useGetUSWorkShifts(USData?._id);
  const { roomsData } = useGetUSRooms(USData?._id);

  const { categoriesBySpeciality } = useGetMedicineCategoriesBySpeciality(doctorSpecialityId);
  const { favoriteMedication } = useGetFavoriteMedication();

  const existingFavNames = new Set((favoriteMedication || []).map((f) => f.favorite_name));

  const newCategories = categoriesBySpeciality.filter(
    (cat) => cat.medicines?.length > 0 && !existingFavNames.has(cat.name_english)
  );
  const alreadyImported = categoriesBySpeciality.filter(
    (cat) => cat.medicines?.length > 0 && existingFavNames.has(cat.name_english)
  );
  const noCategoriesAtAll = categoriesBySpeciality.length === 0;
  const allAlreadyImported = !noCategoriesAtAll && newCategories.length === 0;

  const [tables, setTables] = useState([]);
  const medCatChecked = tables.includes('medicines categories');

  const toggleMedCat = () => {
    setTables((prev) =>
      medCatChecked
        ? prev.filter((one) => one !== 'medicines categories')
        : [...prev, 'medicines categories']
    );
  };

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
          name_english: `${user.employee?.name_english || ''} work group`,
          name_arabic: `فريق عمل ${user.employee?.name_arabic || ''}`,
        });
      }
      if (tables.includes('medicines categories') && doctorSpecialityId) {
        await axiosInstance.post(endpoints.medicinesCategories.importToFavorites, {
          specialityId: doctorSpecialityId,
        });
      }
      if (tables.includes('rooms and activities')) {
        const { data: consultanstActivity } = await axiosInstance.post(endpoints.activities.all, {
          unit_service: USData?._id,
          name_english: `consultant`,
          name_arabic: `استشارة`,
        });
        await axiosInstance.post(endpoints.rooms.all, {
          unit_service: USData?._id,
          name_english: `consultation room`,
          name_arabic: `غرفة الاستشارات`,
          activities: consultanstActivity?._id,
        });
      }

      loading.onFalse();
      onClose();
      window.location.reload();
    } catch (error) {
      loading.onFalse();
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
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
            {t(
              'Thank you for registering in Hakeemna.Online; for the correct installation of the system, it is required some information of your institution to assure the well functionality of our sustenm.'
            )}
          </Typography>

          <Typography variant="subtitle2" paddingBottom="15px">
            {t(
              'For that, we recommend you to complete the next required information of your institution: 1) department, 2) work group, 3) work shift, 4) rooms.'
            )}
          </Typography>

          <Typography variant="subtitle2" paddingBottom="15px">
            {t(
              "To make this step easier, we suggest you to use our 'setup information' that will insert automatically the required data."
            )}
          </Typography>

          <Typography variant="subtitle2" paddingBottom="15px">
            {t(
              "Please select 'all' or the 'specify' which information that you want to insert automatically."
            )}
          </Typography>

          {USData &&
            (!USData?.employees_number || USData?.employees_number > 3) &&
            checkAcl('departments:create') && (
              <Stack direction="row" alignItems="center">
                <Checkbox
                  disabled={departmentsData.length > 0}
                  checked={tables.includes('department')}
                  onChange={() =>
                    tables.includes('department')
                      ? setTables(tables.filter((one) => one !== 'department'))
                      : setTables((prev) => [...prev, 'department'])
                  }
                />
                <Typography variant="subtitle2">{t('department')}</Typography>
                {departmentsData.length > 0 && (
                  <Typography sx={{ pl: 1, color: 'error.main' }} variant="caption">
                    {t('already created')}
                  </Typography>
                )}
              </Stack>
            )}

          <Stack direction="row" alignItems="center">
            <Checkbox
              disabled={workGroupsData.length > 0}
              checked={tables.includes('work group')}
              onChange={() =>
                tables.includes('work group')
                  ? setTables(tables.filter((one) => one !== 'work group'))
                  : setTables((prev) => [...prev, 'work group'])
              }
            />
            <Typography variant="subtitle2">{t('work group')}</Typography>
            {workGroupsData.length > 0 && (
              <Typography sx={{ pl: 1, color: 'error.main' }} variant="caption">
                {t('already created')}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" alignItems="center">
            <Checkbox
              disabled={workShiftsData.length > 0}
              checked={tables.includes('work shift')}
              onChange={() =>
                tables.includes('work shift')
                  ? setTables(tables.filter((one) => one !== 'work shift'))
                  : setTables((prev) => [...prev, 'work shift'])
              }
            />
            <Typography variant="subtitle2">{t('work shift')}</Typography>
            {workShiftsData.length > 0 && (
              <Typography sx={{ pl: 1, color: 'error.main' }} variant="caption">
                {t('already created')}
              </Typography>
            )}
          </Stack>

          <Stack direction="row" alignItems="center">
            <Checkbox
              disabled={roomsData.length > 1}
              checked={tables.includes('rooms and activities')}
              onChange={() =>
                tables.includes('rooms and activities')
                  ? setTables(tables.filter((one) => one !== 'rooms and activities'))
                  : setTables((prev) => [...prev, 'rooms and activities'])
              }
            />
            <Typography variant="subtitle2">{t('rooms and activities')}</Typography>
            {roomsData.length > 1 && (
              <Typography sx={{ pl: 1, color: 'error.main' }} variant="caption">
                {t('already created')}
              </Typography>
            )}
          </Stack>

          {/* ── Medicines Categories ── */}
          {doctorSpecialityId && (
            <Box>
              <Stack direction="row" alignItems="center" flexWrap="wrap" gap={0.5}>
                <Checkbox
                  disabled={noCategoriesAtAll || allAlreadyImported}
                  checked={medCatChecked}
                  onChange={toggleMedCat}
                />
                <Typography variant="subtitle2">{t('favorite medicines')}</Typography>

                {/* {noCategoriesAtAll && (
                  <Typography variant="caption" sx={{ color: 'text.disabled', pl: 0.5 }}>
                    {t('no categories for your speciality yet')}
                  </Typography>
                )} */}

                {allAlreadyImported && (
                  <Typography variant="caption" sx={{ color: 'error.main', pl: 0.5 }}>
                    {t('already added to favorites')}
                  </Typography>
                )}

                {!noCategoriesAtAll && !allAlreadyImported && (
                  <Stack direction="row" gap={0.5} alignItems="center" flexWrap="wrap">
                    <Chip
                      size="small"
                      color="success"
                      label={`${newCategories.length} ${t('new')}`}
                      icon={<Iconify icon="mingcute:add-line" width={14} />}
                    />
                    {alreadyImported.length > 0 && (
                      <Chip
                        size="small"
                        color="default"
                        label={`${alreadyImported.length} ${t('already added')}`}
                        icon={<Iconify icon="eva:checkmark-fill" width={14} />}
                      />
                    )}
                  </Stack>
                )}
              </Stack>

              {/* Preview panel — shows when checkbox is ticked */}
              <Collapse in={medCatChecked && newCategories.length > 0}>
                <Alert
                  severity="info"
                  icon={<Iconify icon="solar:star-bold-duotone" />}
                  sx={{ mt: 1, mb: 1, borderRadius: 1.5 }}
                >
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    {t('The following favorite lists will be created in your prescription favorites:')}
                  </Typography>
                </Alert>

                <Stack
                  spacing={1.5}
                  sx={{
                    maxHeight: 260,
                    overflowY: 'auto',
                    pr: 0.5,
                    pb: 1,
                  }}
                >
                  {newCategories.map((cat, idx) => (
                    <Box
                      key={cat._id || idx}
                      sx={{
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: 1.5,
                        p: { xs: 1, sm: 1.5 },
                        bgcolor: 'background.neutral',
                      }}
                    >
                      <Stack direction="row" alignItems="center" gap={1} sx={{ mb: 1 }}>
                        <Iconify
                          icon="solar:pills-bold-duotone"
                          width={18}
                          sx={{ color: 'primary.main', flexShrink: 0 }}
                        />
                        <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                          {curLangAr ? cat.name_arabic || cat.name_english : cat.name_english}
                        </Typography>
                        <Chip
                          size="small"
                          label={`${cat.medicines?.length} ${t('medicines')}`}
                          sx={{ ml: 'auto', flexShrink: 0 }}
                        />
                      </Stack>

                      <Divider sx={{ mb: 1 }} />

                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 0.5,
                        }}
                      >
                        {cat.medicines?.map((med, mi) => (
                          <Chip
                            key={med._id || mi}
                            size="small"
                            variant="outlined"
                            label={med.trade_name || med.scientific_name || '—'}
                            sx={{ fontSize: '0.7rem' }}
                          />
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          )}
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
