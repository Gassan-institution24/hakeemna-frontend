import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';

import {
  Stack,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
  InputAdornment,
  CircularProgress,
} from '@mui/material';

import useSpecialityGuard from 'src/auth/guard/speciality-guard';
import {
  useGetSpecialties,
  useGetSpecialityServices,
  addClinicServicesFromSpeciality,
} from 'src/api';

// ----------------------------------------------------------------------

// "Add new" from the treatment dialog: pick a service from the superadmin's speciality list and
// set this clinic's price. It joins the clinic's services (so it is billable and offered next
// time) and the caller selects it straight away.
export default function AddServiceFromSpecialityDialog({
  open,
  onClose,
  onAdded,
  clinicServices,
  lang,
}) {
  const isAr = lang === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const { specialityId: mySpeciality } = useSpecialityGuard();
  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });

  const [specialityId, setSpecialityId] = useState(mySpeciality || '');
  const { services, loading } = useGetSpecialityServices(specialityId || null);
  const [entry, setEntry] = useState(null);
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const nameOf = (one) =>
    (isAr ? one?.name_arabic || one?.name_english : one?.name_english || one?.name_arabic) || '';

  // Services the clinic already offers are already in the treatment list — leave them out.
  const offered = useMemo(
    () =>
      new Set(
        (clinicServices || [])
          .map((one) => one.speciality_service?._id || one.speciality_service)
          .filter(Boolean)
          .map(String)
      ),
    [clinicServices]
  );
  const options = useMemo(
    () => services.filter((one) => !offered.has(one._id)),
    [services, offered]
  );

  const speciality = specialtiesData.find((one) => one._id === specialityId) || null;

  const handleSave = async () => {
    if (!entry || price === '' || Number(price) < 0) return;
    setSaving(true);
    try {
      await addClinicServicesFromSpeciality({
        items: [{ speciality_service: entry._id, Price_per_unit: price }],
      });
      enqueueSnackbar(
        isAr ? 'تمت إضافة الخدمة إلى خدمات العيادة' : 'Added to the clinic services',
        {
          variant: 'success',
        }
      );
      onAdded(entry, Number(price));
    } catch (error) {
      enqueueSnackbar((isAr && error?.arabic_message) || error?.message || 'Something went wrong', {
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>
        {isAr ? 'إضافة خدمة من قائمة التخصص' : 'Add a service from the speciality list'}
      </DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <Autocomplete
            size="small"
            options={specialtiesData}
            value={speciality}
            onChange={(e, value) => {
              setSpecialityId(value?._id || '');
              setEntry(null);
            }}
            getOptionLabel={nameOf}
            isOptionEqualToValue={(a, b) => a._id === b._id}
            renderInput={(params) => (
              <TextField {...params} label={isAr ? 'التخصص' : 'Speciality'} />
            )}
          />

          <Autocomplete
            size="small"
            options={options}
            value={entry}
            loading={loading}
            disabled={!specialityId}
            onChange={(e, value) => setEntry(value)}
            // The code is part of the label so typing "D011" finds the service.
            getOptionLabel={(one) => [one.code, nameOf(one)].filter(Boolean).join(' · ')}
            isOptionEqualToValue={(a, b) => a._id === b._id}
            renderOption={(props, one) => (
              <li {...props} key={one._id}>
                <Stack direction="row" gap={1} alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{ fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}
                  >
                    {one.code}
                  </Typography>
                  <Typography variant="body2">{nameOf(one)}</Typography>
                </Stack>
              </li>
            )}
            noOptionsText={
              isAr
                ? 'لا توجد خدمات أخرى — كل خدمات هذا التخصص مضافة'
                : 'Nothing left to add — every service of this speciality is already in the clinic'
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={isAr ? 'الخدمة' : 'Service'}
                placeholder={isAr ? 'ابحث بالرمز أو الاسم' : 'Search by code or name'}
              />
            )}
          />

          <TextField
            size="small"
            type="number"
            label={isAr ? 'سعر العيادة' : 'Clinic price'}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            inputProps={{ min: 0, step: '0.01', inputMode: 'decimal' }}
            InputProps={{ endAdornment: <InputAdornment position="end">JOD</InputAdornment> }}
            helperText={
              isAr
                ? 'تُحفظ في خدمات العيادة وتُستخدم في المرات القادمة'
                : 'Saved to the clinic services and used next time too'
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button size="small" onClick={onClose} disabled={saving}>
          {isAr ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button
          size="small"
          variant="contained"
          onClick={handleSave}
          disabled={saving || !entry || price === ''}
          startIcon={saving ? <CircularProgress size={14} /> : null}
        >
          {isAr ? 'إضافة واختيار' : 'Add and select'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddServiceFromSpecialityDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAdded: PropTypes.func,
  clinicServices: PropTypes.array,
  lang: PropTypes.string,
};
