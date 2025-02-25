import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { MenuItem } from '@mui/material';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function Others() {
  const { t } = useTranslate();

  const { control, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'other',
  });

  const values = watch();

  const handleAdd = () => {
    append({
      kind: '',
      name: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    // <>
    <Box sx={{ pb: 3 }}>
      {/* <Divider flexItem sx={{ borderStyle: 'solid' }} /> */}
      <Typography
        variant="body2"
        sx={{ color: 'text.secondary', my: 2, fontWeight: '700', textTransform: 'capitalize' }}
      >
        {t('other (researchs, books, and conferences)')}:
      </Typography>

      <Stack
        sx={{ mt: 3 }}
        divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
        spacing={2}
      >
        {fields.map((item, index) => (
          <Stack key={index} alignItems="flex-start" spacing={1.5} sx={{ width: '100%' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center" spacing={2} sx={{ width: '100%' }}>
              <RHFSelect
                // size="small"
                name={`other[${index}].kind`}
                label={t('type')}
                sx={{ flex: 0.4 }}
              >
                <MenuItem value="authored books">{t('authored books')}</MenuItem>
                <MenuItem value="conferences">{t('conferences')}</MenuItem>
                <MenuItem value="published research">{t('published research')}</MenuItem>
              </RHFSelect>
              <RHFTextField
                // size="small"
                name={`other[${index}].name`}
                label={t('name')}
                sx={{ flex: 0.6 }}
              />
              <Box sx={{ flex: 0.1 }}>
                {values.other.length !== 1 && (
                  <IconButton
                    //  size="small"
                    color="error"
                    onClick={() => handleRemove(index)}
                  >
                    <Iconify icon="tdesign:minus" />
                  </IconButton>
                )}
                {(index === values.other.length - 1 || values.other.length <= 1) && (
                  <IconButton
                    //  size="small"
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
    </Box>
    // </>
  );
}
