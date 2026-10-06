import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import {
  Box,
  Chip,
  Stack,
  Button,
  Dialog,
  Switch,
  Divider,
  MenuItem,
  TextField,
  Typography,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
  FormControlLabel,
} from '@mui/material';

import { useTranslate } from 'src/locales';
import {
  createLabRequest,
  updateLabRequest,
  uploadLabRequestImages,
} from 'src/api/lab_requests';

import Iconify from 'src/components/iconify';

import TeethPicker from 'src/sections/shared/lab-requests/teeth-picker';
import {
  SHADES,
  STAGES,
  STATUSES,
  MATERIALS,
  ENCLOSURES,
  FIXED_TYPES,
  BRIDGE_TYPES,
  MARGIN_TYPES,
  SHADE_GUIDES,
  TRANSLUCENCY,
  DENTURE_BASES,
  IMPLANT_TYPES,
  ABUTMENT_TYPES,
  PONTIC_DESIGNS,
  REMOVABLE_TYPES,
  IMPRESSION_TYPES,
  RESTORATION_TYPES,
  EMPTY_LAB_REQUEST,
  OCCLUSAL_CONTACTS,
  PROXIMAL_CONTACTS,
  INSUFFICIENT_CLEARANCE,
} from 'src/sections/shared/lab-requests/lab-request-options';

// ----------------------------------------------------------------------

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

const fromRequest = (request) => {
  if (!request) return { ...EMPTY_LAB_REQUEST };
  const values = { ...EMPTY_LAB_REQUEST };
  Object.keys(values).forEach((key) => {
    if (request[key] !== undefined && request[key] !== null) values[key] = request[key];
  });
  values.due_date = toDateInput(request.due_date);
  return values;
};

function Section({ title, children }) {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'primary.main' }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

Section.propTypes = { title: PropTypes.node, children: PropTypes.node };

export default function LabRequestFormDialog({ open, onClose, patient, request, onSaved }) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();

  const [values, setValues] = useState(() => fromRequest(request));
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setValues(fromRequest(request));
      setFiles([]);
    }
  }, [open, request]);

  const set = (key) => (event) => {
    const value = event?.target ? event.target.value : event;
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const type = values.restoration_type;
  const isFixed = FIXED_TYPES.includes(type);
  const isBridge = BRIDGE_TYPES.includes(type);
  const isImplant = IMPLANT_TYPES.includes(type);
  const isRemovable = REMOVABLE_TYPES.includes(type);

  // Free-text select: a list of common choices that still accepts anything typed.
  const freeSelect = (key, label, options, extra = {}) => (
    <Autocomplete
      freeSolo
      options={options}
      getOptionLabel={(option) => t(option)}
      value={values[key] || ''}
      onChange={(_, value) => setValues((prev) => ({ ...prev, [key]: value || '' }))}
      onInputChange={(_, value, reason) => {
        if (reason === 'input') setValues((prev) => ({ ...prev, [key]: value }));
      }}
      renderInput={(params) => <TextField {...params} label={label} {...extra} />}
    />
  );

  const handleSubmit = async () => {
    if (!values.restoration_type) {
      enqueueSnackbar(t('Choose the restoration type'), { variant: 'warning' });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...values,
        // Pontics only make sense on a bridge.
        pontics: isBridge ? values.pontics : [],
      };
      const saved = request?._id
        ? await updateLabRequest(request._id, payload)
        : await createLabRequest({ ...payload, unit_service_patient: patient?._id });
      if (files.length && saved?._id) {
        await uploadLabRequestImages(saved._id, files);
      }
      enqueueSnackbar(request?._id ? t('Lab request updated') : t('Lab request created'));
      onSaved?.(saved);
      onClose();
    } catch (error) {
      enqueueSnackbar(error?.message || t('Something went wrong'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} fullWidth maxWidth="md">
      <DialogTitle>{request?._id ? t('Edit Lab Request') : t('New Lab Request')}</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} divider={<Divider sx={{ borderStyle: 'dashed' }} />}>
          <Section title={t('Laboratory')}>
            <TextField label={t('Lab name')} value={values.lab_name} onChange={set('lab_name')} />
            <TextField label={t('Lab phone')} value={values.lab_phone} onChange={set('lab_phone')} />
            <TextField label={t('Lab email')} value={values.lab_email} onChange={set('lab_email')} />
            <TextField
              type="date"
              label={t('Due date')}
              value={values.due_date}
              onChange={set('due_date')}
              InputLabelProps={{ shrink: true }}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={!!values.urgent}
                  onChange={(e) => setValues((prev) => ({ ...prev, urgent: e.target.checked }))}
                  color="error"
                />
              }
              label={t('Urgent')}
            />
            <TextField select label={t('Status')} value={values.status} onChange={set('status')}>
              {STATUSES.map((one) => (
                <MenuItem key={one.value} value={one.value}>
                  {t(one.label)}
                </MenuItem>
              ))}
            </TextField>
          </Section>

          <Box>
            <Section title={t('Restoration')}>
              <TextField
                select
                label={t('Restoration type')}
                value={values.restoration_type}
                onChange={set('restoration_type')}
              >
                {RESTORATION_TYPES.map((one) => (
                  <MenuItem key={one.value} value={one.value}>
                    {t(one.label)}
                  </MenuItem>
                ))}
              </TextField>
              {freeSelect('material', t('Material'), MATERIALS)}
              {freeSelect('stage', t('Stage'), STAGES)}
            </Section>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                {t('Teeth (FDI)')}
              </Typography>
              <TeethPicker
                teeth={values.teeth}
                pontics={values.pontics}
                allowPontics={isBridge}
                onChange={({ teeth, pontics }) => setValues((prev) => ({ ...prev, teeth, pontics }))}
              />
            </Box>
          </Box>

          <Section title={t('Shade')}>
            {freeSelect('shade_guide', t('Shade guide'), SHADE_GUIDES)}
            {freeSelect('shade', t('Body shade'), SHADES)}
            {freeSelect('shade_incisal', t('Incisal shade'), SHADES)}
            {freeSelect('shade_cervical', t('Cervical shade'), SHADES)}
            {freeSelect('stump_shade', t('Stump shade'), [], {
              helperText: t('Needed for e.max / translucent ceramics'),
            })}
            {freeSelect('translucency', t('Translucency'), TRANSLUCENCY)}
            <TextField
              label={t('Characterization')}
              value={values.characterization}
              onChange={set('characterization')}
              placeholder={t('e.g. incisal halo, white spots, cracks')}
              sx={{ gridColumn: { sm: 'span 2', md: 'span 3' } }}
            />
          </Section>

          {(isFixed || isImplant) && (
            <Section title={t('Design')}>
              {freeSelect('margin_type', t('Margin'), MARGIN_TYPES)}
              {isBridge && freeSelect('pontic_design', t('Pontic design'), PONTIC_DESIGNS)}
              {freeSelect('occlusal_contact', t('Occlusal contact'), OCCLUSAL_CONTACTS)}
              {freeSelect('proximal_contact', t('Proximal contact'), PROXIMAL_CONTACTS)}
              {freeSelect('insufficient_clearance', t('If clearance is insufficient'), INSUFFICIENT_CLEARANCE)}
            </Section>
          )}

          {isImplant && (
            <Section title={t('Implant')}>
              <TextField
                label={t('Implant system')}
                value={values.implant_system}
                onChange={set('implant_system')}
                placeholder="Straumann, Nobel, MIS…"
              />
              <TextField
                label={t('Platform / size')}
                value={values.implant_platform}
                onChange={set('implant_platform')}
              />
              {freeSelect('abutment_type', t('Abutment'), ABUTMENT_TYPES)}
              <TextField
                select
                label={t('Retention')}
                value={values.implant_retention || ''}
                onChange={set('implant_retention')}
              >
                <MenuItem value="">—</MenuItem>
                <MenuItem value="screw">{t('Screw-retained')}</MenuItem>
                <MenuItem value="cement">{t('Cement-retained')}</MenuItem>
              </TextField>
            </Section>
          )}

          {isRemovable && (
            <Section title={t('Denture')}>
              {freeSelect('denture_base', t('Denture base'), DENTURE_BASES)}
              <TextField
                label={t('Teeth mould')}
                value={values.teeth_mould}
                onChange={set('teeth_mould')}
              />
            </Section>
          )}

          <Box>
            <Section title={t('Records sent')}>
              {freeSelect('impression_type', t('Impression'), IMPRESSION_TYPES)}
            </Section>
            <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
              {t('Enclosures')}
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {ENCLOSURES.map((one) => {
                const checked = values.enclosures.includes(one);
                return (
                  <Chip
                    key={one}
                    label={t(one)}
                    color={checked ? 'primary' : 'default'}
                    variant={checked ? 'filled' : 'outlined'}
                    icon={checked ? <Iconify icon="eva:checkmark-fill" /> : undefined}
                    onClick={() =>
                      setValues((prev) => ({
                        ...prev,
                        enclosures: checked
                          ? prev.enclosures.filter((e) => e !== one)
                          : [...prev.enclosures, one],
                      }))
                    }
                  />
                );
              })}
            </Stack>
          </Box>

          <Box>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label={t('Special instructions')}
              value={values.instructions}
              onChange={set('instructions')}
            />
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, color: 'primary.main' }}>
              {t('Images & files')}
            </Typography>
            <Typography variant="caption" color="text.secondary" component="div" sx={{ mb: 1 }}>
              {t('Intraoral photos, shade photos, scans (STL) or PDFs.')}
            </Typography>
            <Button
              component="label"
              variant="outlined"
              startIcon={<Iconify icon="solar:upload-bold-duotone" />}
            >
              {t('Choose files')}
              <input
                hidden
                multiple
                type="file"
                accept="image/*,.pdf,.stl,.ply,.obj,.zip"
                onChange={(e) => {
                  setFiles((prev) => [...prev, ...Array.from(e.target.files || [])]);
                  e.target.value = '';
                }}
              />
            </Button>
            {!!files.length && (
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mt: 1.5 }}>
                {files.map((file, index) => (
                  <Chip
                    key={`${file.name}-${index}`}
                    label={file.name}
                    onDelete={() => setFiles((prev) => prev.filter((_, i) => i !== index))}
                  />
                ))}
              </Stack>
            )}
          </Box>

          <FormControlLabel
            control={
              <Switch
                checked={!!values.hide_patient_name}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, hide_patient_name: e.target.checked }))
                }
              />
            }
            label={t("Show only the patient's initials to the lab")}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" variant="outlined" onClick={onClose} disabled={saving}>
          {t('Cancel')}
        </Button>
        <Button variant="contained" onClick={handleSubmit} disabled={saving}>
          {saving ? t('Saving…') : t('Save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

LabRequestFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  patient: PropTypes.object,
  request: PropTypes.object,
  onSaved: PropTypes.func,
};
