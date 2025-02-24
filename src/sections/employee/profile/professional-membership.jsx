import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function ProfessionalMembership() {
  const { t } = useTranslate();

  const { control, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'memberships',
  });

  const values = watch();

  const handleAdd = () => {
    append({
      name: '',
      institution: '',
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
        {t('memberships')}:
      </Typography>

      <Stack
        sx={{ mt: 3 }}
        divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
        spacing={2}
      >
        {fields.map((item, index) => (
          <Stack key={index} alignItems="flex-start" spacing={1.5} sx={{ width: '100%' }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
              <RHFTextField
                // size="small"
                name={`memberships[${index}].name`}
                label={t('name')}
                sx={{ flex: 0.6 }}
              />
              <RHFTextField
                // size="small"
                name={`memberships[${index}].institution`}
                label={t('institution')}
                sx={{ flex: 0.4 }}
              />
              {/* <RHFDatePicker
                size="small"
                label={t('year')}
                placeholder={t('year')}
                name={`memberships[${index}].year`}
                views={['year']}
                sx={{ flex: 0.2 }}
              /> */}
              <Box sx={{ flex: 0.1 }}>
                {values.memberships.length !== 1 && (
                  <IconButton
                    // sx={{ justifySelf: 'flex-end', alignSelf: 'flex-end', width: 35 }}
                    // size="small"
                    color="error"
                    onClick={() => handleRemove(index)}
                  >
                    <Iconify icon="tdesign:minus" />
                  </IconButton>
                )}
                {index === values.memberships.length - 1 && (
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

      {/* <Divider sx={{ mt: 3, mb: 1, borderStyle: 'dashed' }} />

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
          {t('add membership')}
        </Button>
      </Stack> */}
      <Divider flexItem sx={{ borderStyle: 'solid', pt: 2 }} />
    </Box>
    // </>
  );
}
