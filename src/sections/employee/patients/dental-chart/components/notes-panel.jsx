import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Table,
  Stack,
  Button,
  Dialog,
  Select,
  Tooltip,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TextField,
  InputLabel,
  IconButton,
  Typography,
  FormControl,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import { fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';
import { toNotation } from '../constants/numbering';

// ----------------------------------------------------------------------

const authorName = (createdBy, isAr) => {
  if (!createdBy || typeof createdBy === 'string') return '—';
  // The name lives on the linked employee; the user only carries the email.
  const src = createdBy.employee || createdBy;
  const name = isAr
    ? src.name_arabic || src.name_english
    : src.name_english || src.name_arabic;
  return name || createdBy.email || '—';
};

// ----------------------------------------------------------------------

function AddNoteDialog({ open, onClose, onSubmit, teeth, numbering, lang }) {
  const isAr = lang === 'ar';
  const [text, setText] = useState('');
  const [fdi, setFdi] = useState('');
  const [saving, setSaving] = useState(false);

  const reset = () => {
    setText('');
    setFdi('');
  };

  const handleClose = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSaving(true);
    try {
      await onSubmit({ text: text.trim(), tooth_fdi: fdi ? Number(fdi) : undefined });
      reset();
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>{isAr ? 'إضافة ملاحظة' : 'Add Note'}</DialogTitle>
      <DialogContent>
        <Stack gap={2} sx={{ mt: 1 }}>
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
            autoFocus
            fullWidth
            multiline
            minRows={3}
            size="small"
            label={isAr ? 'الملاحظة' : 'Note'}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} size="small" disabled={saving}>
          {isAr ? 'إلغاء' : 'Cancel'}
        </Button>
        <Button variant="contained" size="small" onClick={handleSubmit} disabled={saving || !text.trim()}>
          {isAr ? 'حفظ' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AddNoteDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  teeth: PropTypes.arrayOf(PropTypes.number),
  numbering: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function NotesPanel({ notes, teeth, onAddNote, onDeleteNote, numbering, lang }) {
  const isAr = lang === 'ar';
  const [dialogOpen, setDialogOpen] = useState(false);

  const rows = [...(notes || [])].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  return (
    <PanelCard
      icon="solar:notes-bold"
      title={`${isAr ? 'الملاحظات' : 'Notes'} (${rows.length})`}
      action={
        <Button
          size="small"
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" width={16} />}
          onClick={() => setDialogOpen(true)}
          disabled={!onAddNote}
        >
          {isAr ? 'إضافة' : 'Add Note'}
        </Button>
      }
    >
      {rows.length === 0 ? (
        <Stack alignItems="center" justifyContent="center" sx={{ py: 4, gap: 1 }}>
          <Iconify icon="solar:notes-linear" width={28} sx={{ color: 'text.disabled' }} />
          <Typography variant="caption" color="text.secondary">
            {isAr ? 'لا توجد ملاحظات بعد.' : 'No notes added yet.'}
          </Typography>
        </Stack>
      ) : (
        <Box sx={{ overflowX: 'auto' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>{isAr ? 'التاريخ' : 'Date'}</TableCell>
                <TableCell>{isAr ? 'الطبيب' : 'Doctor'}</TableCell>
                <TableCell>{isAr ? 'الملاحظة' : 'Note'}</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((note) => (
                <TableRow key={note._id}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {note.created_at ? fDateTime(note.created_at) : '—'}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{authorName(note.created_by, isAr)}</TableCell>
                  <TableCell>
                    {note.tooth_fdi ? (
                      <Typography variant="caption" color="primary.main" sx={{ mr: 0.5 }}>
                        [{toNotation(note.tooth_fdi, numbering)}]
                      </Typography>
                    ) : null}
                    {note.text}
                  </TableCell>
                  <TableCell align="right">
                    {onDeleteNote && (
                      <Tooltip title={isAr ? 'حذف' : 'Delete'}>
                        <IconButton size="small" onClick={() => onDeleteNote(note._id)}>
                          <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                        </IconButton>
                      </Tooltip>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      {onAddNote && (
        <AddNoteDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={onAddNote}
          teeth={teeth}
          numbering={numbering}
          lang={lang}
        />
      )}
    </PanelCard>
  );
}

NotesPanel.propTypes = {
  notes: PropTypes.array,
  teeth: PropTypes.arrayOf(PropTypes.number),
  onAddNote: PropTypes.func,
  onDeleteNote: PropTypes.func,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
