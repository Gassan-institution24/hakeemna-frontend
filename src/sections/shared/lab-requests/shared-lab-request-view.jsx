import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useState, useEffect } from 'react';

import {
  Box,
  Card,
  Chip,
  Stack,
  Alert,
  Avatar,
  Button,
  Divider,
  MenuItem,
  Skeleton,
  Container,
  TextField,
  Typography,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import {
  addSharedLabMessage,
  uploadSharedLabImages,
  useGetSharedLabRequest,
  updateSharedLabRequest,
} from 'src/api/lab_requests';

import Iconify from 'src/components/iconify';

import { statusOf, restorationLabel } from './lab-request-options';
import {
  LabStatusChip,
  LabRequestThread,
  LabRequestGallery,
  LabRequestSummary,
} from './lab-request-parts';

// ----------------------------------------------------------------------

// The page a dental lab opens from the link the clinic shared. No login: the
// token in the URL is the only credential, and the API answers with this one
// request only. The technician's name is remembered in this browser so it does
// not have to be typed on every update.

const NAME_KEY = 'labRequestAuthorName';

const readName = () => {
  try {
    return localStorage.getItem(NAME_KEY) || '';
  } catch (error) {
    return '';
  }
};

const saveName = (name) => {
  try {
    localStorage.setItem(NAME_KEY, name);
  } catch (error) {
    /* storage unavailable */
  }
};

const toDateInput = (value) => (value ? new Date(value).toISOString().slice(0, 10) : '');

function Block({ title, icon, children, action }) {
  return (
    <Card sx={{ p: { xs: 2, md: 3 } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Iconify icon={icon} width={22} sx={{ color: 'primary.main' }} />
          <Typography variant="h6">{title}</Typography>
        </Stack>
        {action}
      </Stack>
      {children}
    </Card>
  );
}

Block.propTypes = {
  title: PropTypes.node,
  icon: PropTypes.string,
  children: PropTypes.node,
  action: PropTypes.node,
};

export default function SharedLabRequestView({ token }) {
  const { t, onChangeLang } = useTranslate();
  const { currentLang } = useLocales();
  const isAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();

  const { labRequest: request, loading, error } = useGetSharedLabRequest(token);

  const [author, setAuthor] = useState(readName);
  const [form, setForm] = useState({
    status: '',
    lab_technician: '',
    lab_case_number: '',
    lab_expected_delivery: '',
  });
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!request) return;
    setForm({
      status: request.lab_statuses?.includes(request.status) ? request.status : '',
      lab_technician: request.lab_technician || '',
      lab_case_number: request.lab_case_number || '',
      lab_expected_delivery: toDateInput(request.lab_expected_delivery),
    });
  }, [request]);

  const pick = (en, ar) => (isAr ? ar || en : en || ar);

  const run = async (fn, success) => {
    setBusy(true);
    try {
      if (author) saveName(author);
      await fn();
      if (success) enqueueSnackbar(success);
    } catch (err) {
      enqueueSnackbar(err?.message || t('Something went wrong'), { variant: 'error' });
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Skeleton variant="rounded" height={120} sx={{ mb: 3 }} />
        <Skeleton variant="rounded" height={320} />
      </Container>
    );
  }

  if (error || !request) {
    return (
      <Container maxWidth="sm" sx={{ py: 10, textAlign: 'center' }}>
        <Iconify icon="solar:link-broken-bold-duotone" width={72} sx={{ color: 'text.disabled' }} />
        <Typography variant="h5" sx={{ mt: 2 }}>
          {t('This link is not available')}
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          {(isAr ? error?.arabic_message : error?.message) ||
            t('The link is invalid or has been disabled by the clinic.')}
        </Typography>
      </Container>
    );
  }

  const closed = ['completed', 'cancelled'].includes(request.status);
  const clinicName = pick(request.clinic?.name_english, request.clinic?.name_arabic);
  const doctorName = pick(request.doctor?.name_english, request.doctor?.name_arabic);
  const patientName = pick(request.patient?.name_english, request.patient?.name_arabic);

  const statusOptions = request.lab_statuses || [];

  return (
    <Box sx={{ bgcolor: 'background.neutral', minHeight: '100vh', py: { xs: 2, md: 5 } }}>
      <Container maxWidth="md">
        <Stack spacing={3}>
          {/* Header: who sent it */}
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0 }}>
                <Avatar
                  src={request.clinic?.company_logo}
                  sx={{ width: 56, height: 56, bgcolor: 'primary.lighter', color: 'primary.main' }}
                >
                  <Iconify icon="mdi:tooth-outline" width={30} />
                </Avatar>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="overline" color="text.secondary">
                    {t('Dental lab request')} {request.code}
                  </Typography>
                  <Typography variant="h5" noWrap>
                    {clinicName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {[doctorName && `${t('Dr.')} ${doctorName}`, request.clinic?.phone]
                      .filter(Boolean)
                      .join(' · ')}
                  </Typography>
                </Box>
              </Stack>
              <Button
                size="small"
                color="inherit"
                onClick={() => onChangeLang(isAr ? 'en' : 'ar')}
                startIcon={<Iconify icon="solar:global-bold" />}
              >
                {isAr ? 'English' : 'العربية'}
              </Button>
            </Stack>

            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' },
              }}
            >
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('Patient')}
                </Typography>
                <Typography variant="subtitle2">
                  {patientName || '—'}
                  {request.patient?.age != null && ` · ${request.patient.age} ${t('yrs')}`}
                  {request.patient?.gender && ` · ${t(request.patient.gender)}`}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('Sent')}
                </Typography>
                <Typography variant="subtitle2">
                  {fDate(request.request_date || request.created_at, 'dd/MM/yyyy')}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t('Due date')}
                </Typography>
                <Typography variant="subtitle2" color={request.urgent ? 'error.main' : 'text.primary'}>
                  {request.due_date ? fDate(request.due_date, 'dd/MM/yyyy') : '—'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary" component="div">
                  {t('Status')}
                </Typography>
                <Stack direction="row" spacing={0.5}>
                  <LabStatusChip status={request.status} />
                  {request.urgent && <Chip size="small" color="error" label={t('Urgent')} />}
                </Stack>
              </Box>
            </Box>
          </Card>

          {/* The prescription */}
          <Block
            title={`${t(restorationLabel(request.restoration_type))}${
              request.teeth?.length ? ` · ${request.teeth.join(', ')}` : ''
            }`}
            icon="solar:document-medicine-bold-duotone"
          >
            <LabRequestSummary request={request} />
          </Block>

          {/* Lab update */}
          <Block title={t('Lab update')} icon="solar:pen-new-square-bold-duotone">
            {closed ? (
              <Alert severity="info">
                {t('This case is')} {t(statusOf(request.status).label)}.{' '}
                {t('You can still send messages and photos.')}
              </Alert>
            ) : (
              <Stack spacing={2}>
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                  }}
                >
                  <TextField
                    select
                    label={t('Status')}
                    value={form.status}
                    onChange={(e) => setForm((prev) => ({ ...prev, status: e.target.value }))}
                  >
                    {statusOptions.map((value) => (
                      <MenuItem key={value} value={value}>
                        {t(statusOf(value).label)}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    type="date"
                    label={t('Expected delivery')}
                    value={form.lab_expected_delivery}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, lab_expected_delivery: e.target.value }))
                    }
                  />
                  <TextField
                    label={t('Technician')}
                    value={form.lab_technician}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, lab_technician: e.target.value }));
                      if (!author) setAuthor(e.target.value);
                    }}
                  />
                  <TextField
                    label={t('Lab case no.')}
                    value={form.lab_case_number}
                    onChange={(e) => setForm((prev) => ({ ...prev, lab_case_number: e.target.value }))}
                  />
                </Box>
                <Box>
                  <Button
                    variant="contained"
                    disabled={busy}
                    onClick={() =>
                      run(
                        () =>
                          updateSharedLabRequest(token, {
                            ...form,
                            status: form.status || undefined,
                            author_name: author || form.lab_technician,
                          }),
                        t('Saved')
                      )
                    }
                  >
                    {t('Save update')}
                  </Button>
                </Box>
              </Stack>
            )}
          </Block>

          {/* Images */}
          <Block
            title={t('Images & files')}
            icon="solar:gallery-bold-duotone"
            action={
              <Button
                component="label"
                variant="outlined"
                size="small"
                disabled={busy}
                startIcon={<Iconify icon="solar:camera-add-bold" />}
              >
                {t('Add photos')}
                <input
                  hidden
                  multiple
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    e.target.value = '';
                    if (files.length) {
                      run(
                        () =>
                          uploadSharedLabImages(token, files, {
                            author_name: author || form.lab_technician,
                          }),
                        t('Uploaded')
                      );
                    }
                  }}
                />
              </Button>
            }
          >
            <LabRequestGallery images={request.images} />
          </Block>

          {/* Messages */}
          <Block title={t('Messages with the clinic')} icon="solar:chat-round-dots-bold-duotone">
            <LabRequestThread messages={request.messages} />
            <Stack spacing={1.5} sx={{ mt: 2 }}>
              <TextField
                size="small"
                label={t('Your name')}
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                sx={{ maxWidth: 280 }}
              />
              <Stack direction="row" spacing={1}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={4}
                  size="small"
                  value={message}
                  placeholder={t('Write a message to the clinic…')}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <Button
                  variant="contained"
                  disabled={busy || !message.trim()}
                  onClick={() =>
                    run(async () => {
                      await addSharedLabMessage(token, {
                        text: message.trim(),
                        author_name: author || form.lab_technician,
                      });
                      setMessage('');
                    })
                  }
                >
                  {t('Send')}
                </Button>
              </Stack>
            </Stack>
          </Block>

          <Typography variant="caption" color="text.disabled" textAlign="center">
            {t('Shared securely via Hakeemna. Only this request is visible through this link.')}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}

SharedLabRequestView.propTypes = { token: PropTypes.string };
