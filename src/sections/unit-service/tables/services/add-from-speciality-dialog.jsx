import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useMemo, useState } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Chip,
  Stack,
  Alert,
  Table,
  Button,
  Dialog,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
  InputAdornment,
  TableContainer,
} from '@mui/material';

import { useResponsive } from 'src/hooks/use-responsive';

import { useLocales, useTranslate } from 'src/locales';
import useSpecialityGuard from 'src/auth/guard/speciality-guard';
import {
  useGetSpecialties,
  useGetSpecialityServices,
  addClinicServicesFromSpeciality,
} from 'src/api';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

// The clinic picks services from the superadmin's speciality list and sets its own price for
// each. Each becomes a normal clinic service — billable, and offered in the treatment picker.
export default function AddFromSpecialityDialog({ open, onClose, onAdded, clinicServices }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const isAr = currentLang?.value === 'ar';
  const smUp = useResponsive('up', 'sm');
  const { enqueueSnackbar } = useSnackbar();

  const { specialityId: mySpeciality } = useSpecialityGuard();
  const { specialtiesData } = useGetSpecialties({ select: 'name_english name_arabic' });

  const [specialityId, setSpecialityId] = useState(mySpeciality || '');
  const { services, loading } = useGetSpecialityServices(specialityId || null);

  // { [specialityServiceId]: price string } — a row is ticked when it has an entry.
  const [picked, setPicked] = useState({});
  const [search, setSearch] = useState('');
  const [saving, setSaving] = useState(false);

  const alreadyAdded = useMemo(
    () =>
      new Set(
        (clinicServices || [])
          .map((one) => one.speciality_service?._id || one.speciality_service)
          .filter(Boolean)
          .map(String)
      ),
    [clinicServices]
  );

  const speciality = specialtiesData.find((one) => one._id === specialityId) || null;
  const nameOf = (one) =>
    (isAr ? one.name_arabic || one.name_english : one.name_english || one.name_arabic) || '';

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return services.filter(
      (one) =>
        !q ||
        [one.code, one.name_english, one.name_arabic].some((v) => v?.toLowerCase().includes(q))
    );
  }, [services, search]);

  const pickedIds = Object.keys(picked);
  const missingPrice = pickedIds.filter((id) => picked[id] === '' || Number(picked[id]) < 0);
  const selectable = visible.filter((one) => !alreadyAdded.has(one._id));
  const allVisiblePicked = selectable.length > 0 && selectable.every((one) => one._id in picked);

  const toggle = (id) =>
    setPicked((prev) => {
      const next = { ...prev };
      if (id in next) delete next[id];
      else next[id] = '';
      return next;
    });

  const toggleAll = () =>
    setPicked((prev) => {
      const next = { ...prev };
      if (allVisiblePicked) selectable.forEach((one) => delete next[one._id]);
      else
        selectable.forEach((one) => {
          if (!(one._id in next)) next[one._id] = '';
        });
      return next;
    });

  const handleSave = async () => {
    if (missingPrice.length) {
      enqueueSnackbar(t('Enter a price for every ticked service'), { variant: 'warning' });
      return;
    }
    try {
      setSaving(true);
      const result = await addClinicServicesFromSpeciality({
        items: pickedIds.map((id) => ({ speciality_service: id, Price_per_unit: picked[id] })),
      });
      enqueueSnackbar(`${t('Services added')}: ${result.created}`);
      setPicked({});
      onAdded();
    } catch (error) {
      enqueueSnackbar(
        (isAr && error?.arabic_message) || error?.message || t('Something went wrong'),
        {
          variant: 'error',
        }
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md" fullScreen={!smUp}>
      <DialogTitle>{t('Add services from the speciality list')}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Autocomplete
              sx={{ flex: 1 }}
              options={specialtiesData}
              value={speciality}
              onChange={(e, value) => {
                setSpecialityId(value?._id || '');
                setPicked({});
              }}
              getOptionLabel={(option) => nameOf(option)}
              isOptionEqualToValue={(option, value) => option._id === value._id}
              renderInput={(params) => (
                <TextField {...params} size="small" label={t('speciality')} />
              )}
            />
          </Stack>

          {!specialityId && (
            <Alert severity="info">{t('Choose a speciality to see its services.')}</Alert>
          )}

          {specialityId && !loading && !services.length && (
            <Alert severity="info">
              {t('This speciality has no services yet. Hakeemna adds them per speciality.')}
            </Alert>
          )}

          {!!services.length && (
            <>
              <TextField
                size="small"
                placeholder={t('Search code or service...')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                }}
              />
              <TableContainer sx={{ maxHeight: 420 }}>
                <Table size="small" stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={allVisiblePicked}
                          indeterminate={
                            !allVisiblePicked && selectable.some((one) => one._id in picked)
                          }
                          disabled={!selectable.length}
                          onChange={toggleAll}
                        />
                      </TableCell>
                      <TableCell width={100}>{t('code')}</TableCell>
                      <TableCell>{t('service')}</TableCell>
                      <TableCell width={170}>{t('price per unit')}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {visible.map((one) => {
                      const added = alreadyAdded.has(one._id);
                      const isPicked = one._id in picked;
                      const priceMissing = isPicked && picked[one._id] === '';
                      return (
                        <TableRow
                          key={one._id}
                          hover={!added}
                          selected={isPicked}
                          sx={{ opacity: added ? 0.55 : 1 }}
                        >
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={added || isPicked}
                              disabled={added}
                              onChange={() => toggle(one._id)}
                            />
                          </TableCell>
                          <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                            {one.code}
                          </TableCell>
                          <TableCell>{nameOf(one)}</TableCell>
                          <TableCell>
                            {added ? (
                              <Chip
                                size="small"
                                variant="soft"
                                color="success"
                                label={t('Added')}
                              />
                            ) : (
                              <TextField
                                size="small"
                                type="number"
                                placeholder="0.00"
                                value={isPicked ? picked[one._id] : ''}
                                error={priceMissing}
                                // Typing a price ticks the row — one step instead of two.
                                onChange={(e) =>
                                  setPicked((prev) => ({ ...prev, [one._id]: e.target.value }))
                                }
                                inputProps={{ min: 0, step: '0.01', inputMode: 'decimal' }}
                                sx={{ width: 140 }}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Box sx={{ flexGrow: 1, color: 'text.secondary', typography: 'body2', pl: 1 }}>
          {pickedIds.length > 0 && `${pickedIds.length} ${t('selected')}`}
        </Box>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <LoadingButton
          variant="contained"
          loading={saving}
          disabled={!pickedIds.length}
          onClick={handleSave}
        >
          {t('Add to my services')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

AddFromSpecialityDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onAdded: PropTypes.func,
  clinicServices: PropTypes.array,
};
