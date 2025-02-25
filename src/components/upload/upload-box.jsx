import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { Button, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function UploadBox({ placeholder, label, error, disabled, files, sx, ...other }) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    files,
    ...other,
  });

  const { t } = useTranslate()
  const hasError = isDragReject || error;
  const handleView = () => {
    const a = document.createElement('a');
    a.href = files;
    a.target = '_blank';
    a.click();
  }
  return (
    <Box
      {...getRootProps()}
      sx={{
        m: 0.5,
        width: 280,
        height: 200,
        flexShrink: 0,
        borderRadius: 3,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        color: 'text.disabled',
        bgcolor: '#fff',
        border: (theme) => `solid 2px ${alpha(theme.palette.grey[500], 0.16)}`,
        ...(isDragActive && {
          opacity: 0.72,
        }),
        ...(disabled && {
          opacity: 0.48,
          pointerEvents: 'none',
        }),
        ...(hasError && {
          color: 'error.main',
          borderColor: 'error.main',
          bgcolor: (theme) => alpha(theme.palette.error.main, 0.08),
        }),
        ...sx,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          '&:hover': {
            opacity: 0.72,
          },
        }}
      >
        <input {...getInputProps()} />

        {placeholder || <img style={{ paddingBottom: 10 }} src="/assets/illustrations/upload-image.svg" alt="upload" />}
      </Box>
      {files && <Button onClick={handleView} variant='contained' color='primary' direction='row' justifyContent='center' alignItems='center'
        sx={{ p: 0.5, borderRadius: '0px 0px 5px 5px' }}>
        {t('View')}
      </Button>}
      <Typography variant='subtitle2' sx={{ position: 'absolute', top: -17, p: 0.5, left: 10, backgroundColor: '#fff' }}>{t(label)}</Typography>
    </Box>
  );
}

UploadBox.propTypes = {
  disabled: PropTypes.object,
  error: PropTypes.bool,
  placeholder: PropTypes.object,
  files: PropTypes.any,
  label: PropTypes.string,
  sx: PropTypes.object,
};
