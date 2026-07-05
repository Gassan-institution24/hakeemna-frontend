import { useRef } from 'react';
import PropTypes from 'prop-types';
import SignatureCanvas from 'react-signature-canvas';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

function dataURLtoBlob(dataURL) {
  const [header, base64] = dataURL.split(',');
  const mime = header.match(/:(.*?);/)[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
}

// ----------------------------------------------------------------------

export default function SignaturePad({ open, onClose, onSave, saving = false }) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const padRef = useRef(null);

  const handleClear = () => padRef.current?.clear();

  const handleSave = () => {
    const pad = padRef.current;
    if (!pad || pad.isEmpty()) {
      enqueueSnackbar(t('Please provide a signature first'), { variant: 'warning' });
      return;
    }
    // Prefer a trimmed (whitespace-cropped) PNG, but fall back to the raw canvas
    // if trimming is unavailable so saving never silently fails.
    let dataURL;
    try {
      dataURL = pad.getTrimmedCanvas().toDataURL('image/png');
    } catch (err) {
      dataURL = pad.toDataURL('image/png');
    }
    onSave(dataURLtoBlob(dataURL), dataURL);
  };

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('Sign here')}</DialogTitle>

      <DialogContent>
        <Box
          sx={{
            mt: 1,
            p: 1,
            display: 'flex',
            justifyContent: 'center',
            borderRadius: 1,
            overflow: 'auto',
            border: (theme) => `dashed 1.5px ${theme.palette.divider}`,
            bgcolor: 'common.white',
          }}
        >
          {/* Fixed pixel canvas keeps pointer coordinates aligned with strokes */}
          <SignatureCanvas
            ref={padRef}
            penColor="#1f2c5b"
            canvasProps={{ width: 500, height: 220, style: { touchAction: 'none' } }}
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          color="inherit"
          onClick={handleClear}
          disabled={saving}
          startIcon={<Iconify icon="solar:eraser-bold" />}
        >
          {t('Clear')}
        </Button>
        <Button color="inherit" onClick={onClose} disabled={saving}>
          {t('Cancel')}
        </Button>
        <LoadingButton
          variant="contained"
          loading={saving}
          onClick={handleSave}
          startIcon={<Iconify icon="solar:pen-new-square-bold" />}
        >
          {t('Save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

SignaturePad.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  saving: PropTypes.bool,
};
