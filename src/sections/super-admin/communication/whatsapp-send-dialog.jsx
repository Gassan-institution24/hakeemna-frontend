import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Tab,
  Tabs,
  Stack,
  Dialog,
  Button,
  TextField,
  Typography,
  DialogTitle,
  DialogActions,
  DialogContent,
} from '@mui/material';

import axiosInstance, { endpoints } from 'src/utils/axios';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function WhatsappSendDialog({ open, onClose }) {
  const [mode, setMode] = useState('text');
  const [to, setTo] = useState('');
  const [text, setText] = useState('');
  const [templateId, setTemplateId] = useState('');
  const [values, setValues] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!to.trim()) {
      enqueueSnackbar('Please enter a recipient number', { variant: 'warning' });
      return;
    }
    if (mode === 'text' && !text.trim()) {
      enqueueSnackbar('Please enter a message', { variant: 'warning' });
      return;
    }
    if (mode === 'template' && !templateId.trim()) {
      enqueueSnackbar('Please enter a template ID', { variant: 'warning' });
      return;
    }
    try {
      setLoading(true);
      const body =
        mode === 'text'
          ? { to: to.trim(), text: text.trim() }
          : {
              to: to.trim(),
              templateId: templateId.trim(),
              // one value per line -> {{1}}, {{2}}, ...
              values: values
                .split('\n')
                .map((v) => v.trim())
                .filter(Boolean),
            };
      const res = await axiosInstance.post(endpoints.whatsapp.send, body);
      enqueueSnackbar(`WhatsApp message ${res.data?.status || 'sent'} to ${res.data?.to}`, {
        variant: 'success',
      });
      setText('');
      onClose();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Failed to send WhatsApp message', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Iconify icon="ic:baseline-whatsapp" sx={{ color: '#25D366' }} width={26} />
        Send WhatsApp Message
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            fullWidth
            label="Recipient number"
            placeholder="0776088372 or 962776088372"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            helperText="Local numbers starting with 0 are sent as Jordan (962)."
          />

          <Tabs value={mode} onChange={(e, v) => setMode(v)}>
            <Tab value="text" label="Text" />
            <Tab value="template" label="Template" />
          </Tabs>

          {mode === 'text' ? (
            <>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Message"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <Typography variant="caption" color="text.secondary">
                Free-text messages only deliver inside the 24-hour customer-service window. Outside
                it, send an approved template.
              </Typography>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label="Template ID"
                placeholder="42"
                value={templateId}
                onChange={(e) => setTemplateId(e.target.value)}
                helperText="The Mazbot template_id of an approved template."
              />
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Variables (one per line)"
                placeholder={'Ahmad\nHakeemna Clinic'}
                value={values}
                onChange={(e) => setValues(e.target.value)}
                helperText="Line 1 fills {{1}}, line 2 fills {{2}}, ..."
              />
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button color="inherit" onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <LoadingButton
          variant="contained"
          color="success"
          loading={loading}
          onClick={handleSend}
          startIcon={<Iconify icon="ic:baseline-whatsapp" />}
        >
          Send
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

WhatsappSendDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};
