import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Chip,
  Stack,
  Button,
  Dialog,
  Select,
  Tooltip,
  MenuItem,
  TextField,
  InputLabel,
  IconButton,
  Typography,
  FormControl,
  DialogTitle,
  Autocomplete,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';
import { toNotation } from '../constants/numbering';
import {
  CHIEF_COMPLAINTS,
  OTHER_COMPLAINT_CODE,
  getChiefComplaintLabel,
} from '../constants/chief-complaints';

// ----------------------------------------------------------------------

const authorName = (createdBy, isAr) => {
  if (!createdBy || typeof createdBy === 'string') return '—';
  // The name lives on the linked employee; the user only carries the email.
  const src = createdBy.employee || createdBy;
  const name = isAr ? src.name_arabic || src.name_english : src.name_english || src.name_arabic;
  return name || createdBy.email || '—';
};

const todayValue = () => new Date().toISOString().slice(0, 10);

// ----------------------------------------------------------------------

function AddComplaintDialog({ open, onClose, onSubmit, teeth, numbering, lang }) {
  const isAr = lang === 'ar';
  const [selected, setSelected] = useState([]);
  const [otherText, setOtherText] = useState('');
  const [fdi, setFdi] = useState('');
  const [date, setDate] = useState(todayValue());
  const [saving, setSaving] = useState(false);

  const showOther = selected.some((c) => c.code === OTHER_COMPLAINT_CODE);
  const canSubmit = selected.length > 0 || otherText.trim().length > 0;

  const reset = () => {
    setSelected([]);
    setOtherText('');
    setFdi('');
    setDate(todayValue());
  };

  const handleClose = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSaving(true);
    try {
      await onSubmit({
        codes: selected.map((c) => c.code),
        other_text: otherText.trim() || undefined,
        teeth: fdi ? [Number(fdi)] : [],
        date,
      });
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>
        {isAr ? 'إضافة الشكوى الرئيسية' : 'Add Chief Complaint'}
      </DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
          <Autocomplete
            multiple
            size="small"
            options={CHIEF_COMPLAINTS}
            value={selected}
            onChange={(_, value) => setSelected(value)}
            isOptionEqualToValue={(option, value) => option.code === value.code}
            getOptionLabel={(option) => (isAr ? option.labelAr || option.label : option.label)}
            // Searchable in both languages regardless of the current UI language.
            filterOptions={(options, { inputValue }) => {
              const q = inputValue.trim().toLowerCase();
              if (!q) return options;
              return options.filter(
                (o) =>
                  o.label.toLowerCase().includes(q) ||
                  (o.labelAr || '').toLowerCase().includes(q) ||
                  o.code.toLowerCase().includes(q)
              );
            }}
            renderOption={(props, option) => (
              <li {...props} key={option.code}>
                <Stack>
                  <Typography variant="body2">{option.label}</Typography>
                  <Typography variant="caption" color="text.secondary" dir="rtl">
                    {option.labelAr}
                  </Typography>
                </Stack>
              </li>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                autoFocus
                label={isAr ? 'الشكوى' : 'Complaint'}
                placeholder={isAr ? 'ابحث...' : 'Search...'}
              />
            )}
          />

          {showOther && (
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              label={isAr ? 'تفاصيل أخرى' : 'Other — details'}
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
            />
          )}

          <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
            <FormControl size="small" fullWidth>
              <InputLabel>{isAr ? 'السن (اختياري)' : 'Tooth (optional)'}</InputLabel>
              <Select
                value={fdi}
                label={isAr ? 'السن (اختياري)' : 'Tooth (optional)'}
                onChange={(e) => setFdi(e.target.value)}
              >
                <MenuItem value="">{isAr ? 'عام' : 'General'}</MenuItem>
                {teeth.map((t) => (
                  <MenuItem key={t} value={t}>
                    {toNotation(t, numbering)}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              size="small"
              type="date"
              label={isAr ? 'التاريخ' : 'Date'}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small" disabled={saving}>
          {isAr ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button variant="contained" size="small" onClick={handleSubmit} disabled={saving || !canSubmit}>
          {isAr ? 'حفظ' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddComplaintDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  teeth: PropTypes.arrayOf(PropTypes.number),
  numbering: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function ChiefComplaintPanel({
  complaints,
  teeth,
  onAddComplaint,
  onDeleteComplaint,
  numbering,
  lang,
}) {
  const isAr = lang === 'ar';
  const [dialogOpen, setDialogOpen] = useState(false);

  // Newest visit first — the current complaint is what the doctor needs on screen.
  const entries = [...(complaints || [])].sort(
    (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
  );

  return (
    <PanelCard
      icon="solar:chat-square-like-bold"
      title={`${isAr ? 'الشكوى الرئيسية' : 'Chief Complaint'} (${entries.length})`}
      action={
        <Button
          size="small"
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" width={16} />}
          onClick={() => setDialogOpen(true)}
          disabled={!onAddComplaint}
        >
          {isAr ? 'إضافة' : 'Add'}
        </Button>
      }
    >
      {entries.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 3, gap: 1 }}>
          <Iconify icon="solar:chat-square-linear" width={28} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">
            {isAr ? 'لا توجد شكوى مسجلة بعد.' : 'No chief complaint recorded yet.'}
          </Typography>
        </Stack>
      ) : (
        <Stack divider={<Box sx={{ borderBottom: '1px dashed', borderColor: 'divider' }} />} gap={1.5}>
          {entries.map((entry) => (
            <Stack
              key={entry._id}
              direction="row"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={1}
              sx={{ pt: 0.5 }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" flexWrap="wrap" gap={0.5} sx={{ mb: 0.5 }}>
                  {(entry.codes || []).map((code) => (
                    <Chip
                      key={code}
                      size="small"
                      variant="soft"
                      color="primary"
                      label={getChiefComplaintLabel(code, lang)}
                      sx={{ height: 22, fontSize: '0.7rem' }}
                    />
                  ))}
                </Stack>

                {entry.other_text && (
                  <Typography variant="body2" sx={{ mb: 0.25 }}>
                    {entry.other_text}
                  </Typography>
                )}

                <Typography variant="caption" color="text.secondary">
                  {fDate(entry.date)}
                  {entry.teeth?.length > 0 &&
                    ` · ${isAr ? 'الأسنان' : 'teeth'} ${entry.teeth
                      .map((t) => toNotation(t, numbering))
                      .join(', ')}`}
                  {` · ${authorName(entry.created_by, isAr)}`}
                </Typography>
              </Box>

              {onDeleteComplaint && (
                <Tooltip title={isAr ? 'حذف' : 'Delete'}>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => onDeleteComplaint(entry._id)}
                  >
                    <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          ))}
        </Stack>
      )}

      {onAddComplaint && (
        <AddComplaintDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={onAddComplaint}
          teeth={teeth}
          numbering={numbering}
          lang={lang}
        />
      )}
    </PanelCard>
  );
}

ChiefComplaintPanel.propTypes = {
  complaints: PropTypes.array,
  teeth: PropTypes.arrayOf(PropTypes.number),
  onAddComplaint: PropTypes.func,
  onDeleteComplaint: PropTypes.func,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
