import { useState } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import {
  Box,
  Card,
  Chip,
  Stack,
  Button,
  Dialog,
  Switch,
  Divider,
  Tooltip,
  Collapse,
  TextField,
  IconButton,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
  FormControlLabel,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import {
  updateLabRequest,
  deleteLabRequest,
  labRequestShareUrl,
  addLabRequestMessage,
  deleteLabRequestImage,
  uploadLabRequestImages,
  useGetPatientLabRequests,
  regenerateLabRequestLink,
} from 'src/api/lab_requests';

import Iconify from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';

import ProfilePane from 'src/sections/shared/patient-profile/profile-pane';
import { restorationLabel } from 'src/sections/shared/lab-requests/lab-request-options';
import {
  LabStatusChip,
  LabRequestThread,
  LabRequestGallery,
  LabRequestSummary,
} from 'src/sections/shared/lab-requests/lab-request-parts';

import LabRequestFormDialog from './items/lab-requests/lab-request-form-dialog';

// ----------------------------------------------------------------------

// Dental lab requests (lab prescriptions). Each one can be shared with the lab
// as a link that opens without an account; see the public page under
// src/pages/lab-request.
export default function PatientLabRequests({ patient }) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();

  const { labRequests, loading, error, refetch } = useGetPatientLabRequests(patient?._id);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [sharing, setSharing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const openNew = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteLabRequest(deleting._id);
      enqueueSnackbar(t('Lab request deleted'));
      refetch();
    } catch (err) {
      enqueueSnackbar(err?.message || t('Something went wrong'), { variant: 'error' });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <>
      <ProfilePane
        icon="mdi:tooth-outline"
        title={t('Lab Requests')}
        count={labRequests.length}
        loading={loading}
        error={error}
        isEmpty={!labRequests.length}
        emptyTitle={t('No lab requests')}
        emptyDescription={t(
          'Send crowns, bridges, dentures and other work to a dental lab, and share the request with the lab by link.'
        )}
        addLabel={t('New Lab Request')}
        onToggleAdd={openNew}
      >
        <Stack spacing={2}>
          {labRequests.map((one) => (
            <LabRequestCard
              key={one._id}
              request={one}
              refetch={refetch}
              onEdit={() => {
                setEditing(one);
                setFormOpen(true);
              }}
              onShare={() => setSharing(one)}
              onDelete={() => setDeleting(one)}
            />
          ))}
        </Stack>
      </ProfilePane>

      <LabRequestFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        patient={patient}
        request={editing}
        onSaved={(saved) => {
          refetch();
          // A brand-new request goes straight to the share dialog: sending it to
          // the lab is the next thing the doctor does.
          if (!editing && saved?.share_token) setSharing(saved);
        }}
      />

      {sharing && (
        <ShareDialog
          request={labRequests.find((one) => one._id === sharing._id) || sharing}
          onClose={() => setSharing(null)}
          refetch={refetch}
        />
      )}

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        title={t('Delete')}
        content={t('Delete this lab request? The shared link will stop working.')}
        action={
          <Button variant="contained" color="error" onClick={handleDelete}>
            {t('Delete')}
          </Button>
        }
      />
    </>
  );
}

PatientLabRequests.propTypes = { patient: PropTypes.object };

// ----------------------------------------------------------------------

function LabRequestCard({ request, refetch, onEdit, onShare, onDelete }) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const teeth = request.teeth || [];
  const labImages = (request.images || []).filter((one) => one.source === 'lab').length;

  const run = async (fn, success) => {
    setBusy(true);
    try {
      await fn();
      if (success) enqueueSnackbar(success);
      await refetch();
    } catch (err) {
      enqueueSnackbar(err?.message || t('Something went wrong'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card variant="outlined" sx={{ p: 2.5 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="space-between">
        <Box sx={{ minWidth: 0, cursor: 'pointer' }} onClick={() => setOpen((v) => !v)}>
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            <Typography variant="subtitle1">{t(restorationLabel(request.restoration_type))}</Typography>
            {!!teeth.length && (
              <Typography variant="body2" color="text.secondary">
                · {teeth.join(', ')}
              </Typography>
            )}
            <LabStatusChip status={request.status} />
            {request.urgent && <Chip size="small" color="error" label={t('Urgent')} />}
            {!request.share_enabled && (
              <Chip size="small" variant="outlined" label={t('Link disabled')} />
            )}
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {[
              request.code,
              request.lab_name,
              request.material && t(request.material),
              request.shade && `${t('Shade')} ${request.shade}`,
            ]
              .filter(Boolean)
              .join(' · ')}
          </Typography>
          <Typography variant="caption" color="text.disabled">
            {t('Sent')} {fDate(request.request_date || request.created_at, 'dd/MM/yyyy')}
            {request.due_date && ` · ${t('Due')} ${fDate(request.due_date, 'dd/MM/yyyy')}`}
            {request.lab_expected_delivery &&
              ` · ${t('Lab expects')} ${fDate(request.lab_expected_delivery, 'dd/MM/yyyy')}`}
            {labImages > 0 && ` · ${labImages} ${t('photos from the lab')}`}
          </Typography>
        </Box>

        <Stack direction="row" spacing={0.5} alignItems="flex-start" flexShrink={0}>
          <Button
            size="small"
            variant="contained"
            startIcon={<Iconify icon="solar:share-bold" />}
            onClick={onShare}
          >
            {t('Share with lab')}
          </Button>
          <Tooltip title={t('Edit')}>
            <IconButton onClick={onEdit}>
              <Iconify icon="solar:pen-bold" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('Delete')}>
            <IconButton color="error" onClick={onDelete}>
              <Iconify icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
          <IconButton onClick={() => setOpen((v) => !v)}>
            <Iconify icon={open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'} />
          </IconButton>
        </Stack>
      </Stack>

      <Collapse in={open} unmountOnExit>
        <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

        <Stack spacing={3}>
          {(request.lab_technician || request.lab_case_number) && (
            <Typography variant="body2" color="text.secondary">
              {[
                request.lab_technician && `${t('Technician')}: ${request.lab_technician}`,
                request.lab_case_number && `${t('Lab case no.')}: ${request.lab_case_number}`,
              ]
                .filter(Boolean)
                .join(' · ')}
            </Typography>
          )}

          <LabRequestSummary request={request} />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
              <Typography variant="subtitle2">{t('Images & files')}</Typography>
              <Button
                size="small"
                component="label"
                disabled={busy}
                startIcon={<Iconify icon="solar:upload-bold-duotone" />}
              >
                {t('Upload')}
                <input
                  hidden
                  multiple
                  type="file"
                  accept="image/*,.pdf,.stl,.ply,.obj,.zip"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    e.target.value = '';
                    if (files.length) {
                      run(() => uploadLabRequestImages(request._id, files), t('Uploaded'));
                    }
                  }}
                />
              </Button>
            </Stack>
            <LabRequestGallery
              images={request.images}
              canDelete={(img) => img.source === 'clinic'}
              onDelete={(img) => run(() => deleteLabRequestImage(request._id, img._id))}
            />
          </Box>

          <Divider sx={{ borderStyle: 'dashed' }} />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
              {t('Messages with the lab')}
            </Typography>
            <LabRequestThread messages={request.messages} />
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                size="small"
                value={message}
                placeholder={t('Write a message to the lab…')}
                onChange={(e) => setMessage(e.target.value)}
              />
              <Button
                variant="contained"
                disabled={busy || !message.trim()}
                onClick={() =>
                  run(async () => {
                    await addLabRequestMessage(request._id, message.trim());
                    setMessage('');
                  })
                }
              >
                {t('Send')}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </Collapse>
    </Card>
  );
}

LabRequestCard.propTypes = {
  request: PropTypes.object,
  refetch: PropTypes.func,
  onEdit: PropTypes.func,
  onShare: PropTypes.func,
  onDelete: PropTypes.func,
};

// ----------------------------------------------------------------------

function ShareDialog({ request, onClose, refetch }) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const [busy, setBusy] = useState(false);

  const url = labRequestShareUrl(request.share_token);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      enqueueSnackbar(t('Link copied'));
    } catch (err) {
      enqueueSnackbar(t('Copy failed, select the link and copy it manually'), { variant: 'warning' });
    }
  };

  const run = async (fn, success) => {
    setBusy(true);
    try {
      await fn();
      enqueueSnackbar(success);
      await refetch();
    } catch (err) {
      enqueueSnackbar(err?.message || t('Something went wrong'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  const whatsappText = encodeURIComponent(
    `${t('Dental lab request')} ${request.code || ''}\n${url}`
  );

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('Share with lab')}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Typography variant="body2" color="text.secondary">
            {t(
              'Anyone with this link can view this request and update its status, add photos and send messages — no account needed. Only this request is visible; nothing else from the patient file.'
            )}
          </Typography>

          <TextField
            fullWidth
            value={request.share_enabled ? url : t('Link disabled')}
            disabled={!request.share_enabled}
            InputProps={{
              readOnly: true,
              endAdornment: request.share_enabled && (
                <InputAdornment position="end">
                  <Tooltip title={t('Copy')}>
                    <IconButton onClick={copy}>
                      <Iconify icon="solar:copy-bold" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t('Open')}>
                    <IconButton href={url} target="_blank" rel="noopener">
                      <Iconify icon="solar:square-top-down-bold" />
                    </IconButton>
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />

          {request.share_enabled && (
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                variant="outlined"
                color="success"
                startIcon={<Iconify icon="logos:whatsapp-icon" />}
                href={`https://wa.me/?text=${whatsappText}`}
                target="_blank"
                rel="noopener"
              >
                WhatsApp
              </Button>
              {request.lab_email && (
                <Button
                  variant="outlined"
                  startIcon={<Iconify icon="solar:letter-bold" />}
                  href={`mailto:${request.lab_email}?subject=${encodeURIComponent(
                    `${t('Dental lab request')} ${request.code || ''}`
                  )}&body=${whatsappText}`}
                >
                  {t('Email')}
                </Button>
              )}
            </Stack>
          )}

          <Divider />

          <FormControlLabel
            control={
              <Switch
                checked={!!request.share_enabled}
                disabled={busy}
                onChange={(e) =>
                  run(
                    () => updateLabRequest(request._id, { share_enabled: e.target.checked }),
                    e.target.checked ? t('Link enabled') : t('Link disabled')
                  )
                }
              />
            }
            label={t('Link is active')}
          />

          <Box>
            <Button
              color="warning"
              disabled={busy}
              startIcon={<Iconify icon="solar:refresh-bold" />}
              onClick={() => run(() => regenerateLabRequestLink(request._id), t('New link created'))}
            >
              {t('Create a new link')}
            </Button>
            <Typography variant="caption" color="text.secondary" component="div">
              {t('The old link stops working immediately.')}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onClose}>
          {t('Done')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

ShareDialog.propTypes = {
  request: PropTypes.object,
  onClose: PropTypes.func,
  refetch: PropTypes.func,
};
