import { useState } from 'react';
import PropTypes from 'prop-types';

import {
  Box,
  Chip,
  Table,
  Stack,
  Paper,
  Button,
  Dialog,
  Select,
  Divider,
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

import { fDate, fDateTime } from 'src/utils/format-time';

import Iconify from 'src/components/iconify';

import PanelCard from './panel-card';
import { toNotation } from '../constants/numbering';
import { idOf, splitByVisit } from '../constants/visit-scope';

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

function ViewNoteDialog({ open, onClose, note, numbering, lang }) {
  const isAr = lang === 'ar';

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>{isAr ? 'الملاحظة' : 'Note'}</DialogTitle>
      <DialogContent dividers>
        {note && (
          <Stack gap={2} sx={{ mt: 1 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">
                {isAr ? 'التاريخ' : 'Date'}
              </Typography>
              <Typography variant="body2">
                {note.created_at ? fDateTime(note.created_at) : '—'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="caption" color="text.secondary">
                {isAr ? 'الطبيب' : 'Doctor'}
              </Typography>
              <Typography variant="body2">{authorName(note.created_by, isAr)}</Typography>
            </Box>

            {note.tooth_fdi ? (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {isAr ? 'السن' : 'Tooth'}
                </Typography>
                <Typography variant="body2" color="primary.main">
                  {toNotation(note.tooth_fdi, numbering)}
                </Typography>
              </Box>
            ) : null}

            <Box>
              <Typography variant="caption" color="text.secondary">
                {isAr ? 'الملاحظة' : 'Note'}
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                {note.text}
              </Typography>
            </Box>
          </Stack>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">
          {isAr ? 'إغلاق' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ViewNoteDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  note: PropTypes.object,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

// Notes from earlier appointments, newest visit first. One card per visit so a
// past consultation reads as a whole rather than as loose lines.
function NotesHistoryDialog({ open, onClose, groups, numbering, lang }) {
  const isAr = lang === 'ar';
  const total = groups.reduce((sum, group) => sum + group.rows.length, 0);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ fontSize: '1rem' }}>
        {isAr ? 'ملاحظات سابقة' : 'Previous notes'}
      </DialogTitle>

      <DialogContent dividers sx={{ backgroundColor: 'background.neutral' }}>
        {groups.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" sx={{ py: 6, gap: 1 }}>
            <Iconify icon="solar:history-linear" width={32} sx={{ color: 'text.disabled' }} />
            <Typography variant="body2" color="text.secondary">
              {isAr ? 'لا توجد ملاحظات سابقة.' : 'No previous notes on record.'}
            </Typography>
          </Stack>
        ) : (
          <Stack gap={2} sx={{ py: 1 }}>
            <Typography variant="caption" color="text.secondary">
              {isAr
                ? `${total} ملاحظة عبر ${groups.length} زيارة`
                : `${total} notes across ${groups.length} visits`}
            </Typography>

            {groups.map((group) => (
              <Paper
                key={group.key}
                variant="outlined"
                sx={{ borderRadius: 1.5, overflow: 'hidden', backgroundColor: 'background.paper' }}
              >
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  flexWrap="wrap"
                  gap={1}
                  sx={{
                    px: 2,
                    py: 1.25,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    backgroundColor: 'background.neutral',
                  }}
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Iconify icon="solar:calendar-bold" width={16} sx={{ color: 'primary.main' }} />
                    <Typography variant="subtitle2">
                      {group.date ? fDate(group.date, 'dd MMM yyyy') : '—'}
                    </Typography>
                  </Stack>
                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${group.rows.length} ${isAr ? 'ملاحظة' : 'notes'}`}
                  />
                </Stack>

                <Stack divider={<Divider flexItem />} gap={1.5} sx={{ p: 2 }}>
                  {group.rows.map((note) => (
                    <Box key={note._id}>
                      <Stack direction="row" alignItems="center" flexWrap="wrap" gap={1} sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {note.created_at ? fDateTime(note.created_at) : '—'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          · {authorName(note.created_by, isAr)}
                        </Typography>
                        {note.tooth_fdi ? (
                          <Chip
                            size="small"
                            variant="outlined"
                            color="primary"
                            label={toNotation(note.tooth_fdi, numbering)}
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        ) : null}
                      </Stack>
                      <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                        {note.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Paper>
            ))}
          </Stack>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} size="small">
          {isAr ? 'إغلاق' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

NotesHistoryDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  groups: PropTypes.array,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};

// ----------------------------------------------------------------------

export default function NotesPanel({
  notes,
  teeth,
  onAddNote,
  onDeleteNote,
  visit,
  numbering,
  lang,
}) {
  const isAr = lang === 'ar';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewNote, setViewNote] = useState(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  const sorted = [...(notes || [])].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  // In an appointment the panel shows only that appointment's notes; earlier
  // ones move behind the history button. Standalone, this returns everything.
  const { current: rows, history: historyGroups } = splitByVisit(
    sorted.map((note) => ({ ...note, visitId: idOf(note.visit), date: note.created_at })),
    visit?.id
  );

  const inVisit = Boolean(visit?.id);
  const visitTitle = isAr ? 'ملاحظات هذا الموعد' : "This appointment's notes";
  const plainTitle = isAr ? 'الملاحظات' : 'Notes';
  const panelTitle = inVisit ? visitTitle : plainTitle;

  return (
    <PanelCard
      icon="solar:notes-bold"
      title={`${panelTitle} (${rows.length})`}
      action={
        <Stack direction="row" spacing={1}>
          {inVisit && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Iconify icon="solar:history-bold" width={16} />}
              onClick={() => setHistoryOpen(true)}
              disabled={historyGroups.length === 0}
            >
              {isAr ? 'عرض السجل السابق' : 'Show old history'}
            </Button>
          )}
          {onAddNote && (
            <Button
              size="small"
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" width={16} />}
              onClick={() => setDialogOpen(true)}
            >
              {isAr ? 'إضافة' : 'Add Note'}
            </Button>
          )}
        </Stack>
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
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((note) => (
                <TableRow key={note._id}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    {note.created_at ? fDate(note.created_at, 'dd MMM yyyy') : '—'}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>{authorName(note.created_by, isAr)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Iconify icon="solar:eye-bold" width={16} />}
                        onClick={() => setViewNote(note)}
                      >
                        {isAr ? 'عرض المزيد' : 'View more'}
                      </Button>
                      {onDeleteNote && (
                        <Tooltip title={isAr ? 'حذف' : 'Delete'}>
                          <IconButton size="small" onClick={() => onDeleteNote(note._id)}>
                            <Iconify icon="solar:trash-bin-trash-bold" width={16} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Stack>
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

      <ViewNoteDialog
        open={Boolean(viewNote)}
        onClose={() => setViewNote(null)}
        note={viewNote}
        numbering={numbering}
        lang={lang}
      />

      <NotesHistoryDialog
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        groups={historyGroups}
        numbering={numbering}
        lang={lang}
      />
    </PanelCard>
  );
}

NotesPanel.propTypes = {
  notes: PropTypes.array,
  teeth: PropTypes.arrayOf(PropTypes.number),
  onAddNote: PropTypes.func,
  onDeleteNote: PropTypes.func,
  // The appointment being treated; its presence scopes the panel to that visit.
  visit: PropTypes.object,
  numbering: PropTypes.string,
  lang: PropTypes.string,
};
