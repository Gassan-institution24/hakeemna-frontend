import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { RHFTextField, RHFDatePicker } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function Certifications() {
  const { t } = useTranslate();

  const { control, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'certifications',
  });

  const values = watch();

  const handleAdd = () => {
    append({
      name: '',
      institution: '',
      year: null,
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    // <>
    <Box sx={{ pt: 3 }}>
      <Divider flexItem sx={{ borderStyle: 'solid' }} />
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', my: 2, fontWeight: '700', textTransform: 'capitalize' }}
      >
        {t('certifications')}:
      </Typography>

      <Stack
        sx={{ mt: 3 }}
        divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
        spacing={2}
        alignItems="center"
      >
        {fields.map((item, index) => (
          <Stack key={index} alignItems="center" spacing={1.5} sx={{ width: '100%' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={2} sx={{ width: '100%' }}>
              <RHFTextField
                // size="small"
                name={`certifications[${index}].name`}
                label={t('cetificate')}
                sx={{ flex: 5 }}
              />
              <RHFTextField
                // size="small"
                name={`certifications[${index}].institution`}
                label={t('institution')}
                sx={{ flex: 3 }}
              />
              <RHFDatePicker
                // size="small"
                label={t('year')}
                placeholder={t('year')}
                name={`certifications[${index}].year`}
                views={['year']}
                sx={{ maxWidth: 180 }}
              />
              <Box sx={{ flex: 1 }}>
                {values.certifications.length !== 1 && (
                  <IconButton
                    // sx={{ justifySelf: 'flex-end', alignSelf: 'flex-end', width: 35 }}
                    // size="small"
                    color="error"
                    onClick={() => handleRemove(index)}
                  >
                    <Iconify icon="tdesign:minus" />
                  </IconButton>
                )}
                {index === values.certifications.length - 1 && (
                  <IconButton
                    // sx={{ justifySelf: 'flex-end', alignSelf: 'flex-end', width: 35 }}
                    // size="small"
                    color="primary"
                    onClick={handleAdd}
                  >
                    <Iconify icon="tdesign:plus" />
                  </IconButton>
                )}
              </Box>
            </Stack>
          </Stack>
        ))}
      </Stack>
      {/* 
      <Divider sx={{ mt: 3, mb: 1, borderStyle: 'dashed' }} />

      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="tdesign:plus" />}
          sx={{ padding: 1 }}
          onClick={handleAdd}
        >
          {t('add certificate')}
        </Button>
      </Stack> */}
      <Divider flexItem sx={{ borderStyle: 'solid', pt: 2 }} />
    </Box>
    // </>
  );
}
