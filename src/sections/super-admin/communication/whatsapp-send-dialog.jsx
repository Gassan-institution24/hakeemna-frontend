import { useState } from 'react';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';

import LoadingButton from '@mui/lab/LoadingButton';
import {
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
  const [to, setTo] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!to.trim()) {
      enqueueSnackbar('Please enter a recipient number', { variant: 'warning' });
      return;
    }
    try {
      setLoading(true);
      // If no text is typed, the backend falls back to the approved "hello_world" template.
      const res = await axiosInstance.post(endpoints.whatsapp.send, {
        to: to.trim(),
        text: text.trim() || undefined,
      });
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
            placeholder="962776088372"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            helperText="International format, digits only (country code + number)."
          />
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Message (optional)"
            placeholder="Leave empty to send the default hello_world template"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Typography variant="caption" color="text.secondary">
            Free-text messages only deliver inside the 24-hour customer-service window. Outside it,
            leave the message empty to send the approved template.
          </Typography>
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
