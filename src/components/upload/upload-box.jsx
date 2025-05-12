import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { Button, Stack, Typography } from '@mui/material';

import { useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function UploadBox({
  placeholder,
  label,
  error,
  showOnDocument,
  disabled,
  files,
  sx,
  ...other
}) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    disabled,
    files,
    ...other,
  });

  const { t } = useTranslate();
  const hasError = isDragReject || error;
  const handleView = () => {
    const a = document.createElement('a');
    a.href = files;
    a.target = '_blank';
    a.click();
  };
  const handleViewOnDoc = () => {
    const docWindow = window.open('', '_blank');
    if (docWindow) {
      docWindow.document.write(`
      <html lang="ar" dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>عرض الختم</title>
          <style>
            @media print {
              body, html {
                margin: 0;
                padding: 0;
              }
              .a4 {
                box-shadow: none;
                margin: 0;
              }
            }

            body {
              background: #f0f0f0;
              padding: 30px;
              margin: 0;
              font-family: 'Arial', sans-serif;
              text-align: right;
            }

            .a4 {
              background: white;
              width: 21cm;
              height: 29.7cm;
              padding: 2cm;
              margin: auto;
              box-shadow: 0 0 5px rgba(0,0,0,0.1);
              box-sizing: border-box;
              direction: rtl;
            }

            .note {
              font-size: 16px;
              line-height: 1.6;
              margin-bottom: 20px;
              white-space: pre-line;
            }

            .image {
              max-width: 100%;
              height: auto;
              padding: 10px;
              margin-top: 10px;
              width: 170px;
            }
          </style>
        </head>
        <body>
          <div class="a4">
            <div class="note">
              <strong>ملاحظة هامة**</strong><br>
              عند رفع كلاًّ من التوقيع والختم، يجب مراعاة أن تكون خلفياتهم بلون أبيض ومع الانتباه الى عرض وطول الصورة وذلك لغايات ظهور الختم والتوقيع في المستندات بجودة عالية و واضحة.<br><br>
            </div>
            <img class="image" src="${files}" alt="ختم" />
          </div>
        </body>
      </html>
    `);
      docWindow.document.close();
    }
  };

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

        {placeholder || (
          <img
            style={{ paddingBottom: 10 }}
            src="/assets/illustrations/upload-image.svg"
            alt="upload"
          />
        )}
      </Box>
      <Stack direction="row">
        {files && (
          <Button
            onClick={handleView}
            variant="contained"
            color="primary"
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{
              flex: 1,
              p: 0.5,
              borderRadius: showOnDocument ? '0px 0px 0px 5px' : '0px 0px 5px 5px',
            }}
          >
            {t('View')}
          </Button>
        )}
        {showOnDocument && files && (
          <Button
            onClick={handleViewOnDoc}
            variant="contained"
            color="secondary"
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ flex: 1, p: 0.5, borderRadius: files ? '0px 0px 5px 0px' : '0px 0px 5px 5px' }}
          >
            {t('View on document')}
          </Button>
        )}
      </Stack>
      <Typography
        variant="subtitle2"
        sx={{ position: 'absolute', top: -17, p: 0.5, left: 10, backgroundColor: '#fff' }}
      >
        {t(label)}
      </Typography>
    </Box>
  );
}

UploadBox.propTypes = {
  disabled: PropTypes.object,
  error: PropTypes.bool,
  showOnDocument: PropTypes.bool,
  placeholder: PropTypes.object,
  files: PropTypes.any,
  label: PropTypes.string,
  sx: PropTypes.object,
};
