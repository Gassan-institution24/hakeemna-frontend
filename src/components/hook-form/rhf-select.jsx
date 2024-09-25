import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Divider, Typography } from '@mui/material';
import FormHelperText from '@mui/material/FormHelperText';

import { useNewScreen } from 'src/hooks/use-new-screen';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from '../iconify';

// ----------------------------------------------------------------------

export function RHFSelect({
  name,
  native,
  maxHeight = 220,
  helperText,
  children,
  PaperPropsSx,
  ...other
}) {
  const { t } = useTranslate()
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          select
          fullWidth
          InputLabelProps={{ shrink: true }}
          SelectProps={{
            native,
            MenuProps: {
              PaperProps: {
                sx: {
                  ...(!native && {
                    maxHeight: typeof maxHeight === 'number' ? maxHeight : 'unset',
                  }),
                  ...PaperPropsSx,
                },
              },
            },
            sx: { textTransform: 'capitalize' },
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          {...other}
        >
          {field.value &&
            <MenuItem value={null}>
              {t('clear')}
            </MenuItem>}
          {field.value &&
            < Divider />
          }
          {children}
        </TextField>
      )}
    />
  );
}

RHFSelect.propTypes = {
  PaperPropsSx: PropTypes.object,
  children: PropTypes.node,
  helperText: PropTypes.object,
  maxHeight: PropTypes.number,
  name: PropTypes.string,
  native: PropTypes.bool,
};

// ----------------------------------------------------------------------

export function RHFMultiSelect({
  name,
  path,
  chip,
  label,
  options,
  checkbox,
  placeholder,
  helperText,
  ...other
}) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { control } = useFormContext();

  const { handleAddNew } = useNewScreen();

  const renderValues = (selectedIds) => {
    const selectedItems = options.filter((item) => selectedIds?.includes(item._id));

    if (!selectedItems.length && placeholder) {
      return <Box sx={{ color: 'text.disabled' }}>{placeholder}</Box>;
    }

    if (chip) {
      return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {selectedItems.map((item, index, idx) => (
            <Chip key={idx} size="small" label={curLangAr ? item.name_arabic : item.name_english} />
          ))}
        </Box>
      );
    }

    return selectedItems
      .map((item, idx) => (curLangAr ? item.name_arabic : item.name_english))
      .join(', ');
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={!!error} {...other}>
          {label && <InputLabel id={name}> {label} </InputLabel>}

          <Select
            {...field}
            multiple
            displayEmpty={!!placeholder}
            id={`multiple-${name}`}
            labelId={name}
            label={label}
            renderValue={renderValues}
          >
            {options?.map((option, idx) => {
              const selected = field?.value?.includes(option._id);

              return (
                <MenuItem lang="ar" key={idx} value={option._id}>
                  {checkbox && <Checkbox size="small" disableRipple checked={selected} />}

                  {curLangAr ? option.name_arabic : option.name_english}
                </MenuItem>
              );
            })}
            {path && <Divider />}
            {path && (
              <MenuItem
                lang="ar"
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: 1,
                  fontWeight: 600,
                  // color: 'error.main',
                }}
                onClick={() => handleAddNew(path)}
              >
                <Typography variant="body2" sx={{ color: 'info.main' }}>
                  {t('Add new')}
                </Typography>
                <Iconify icon="material-symbols:new-window-sharp" />
              </MenuItem>
            )}
          </Select>

          {(!!error || helperText) && (
            <FormHelperText error={!!error}>{error ? error?.message : helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
}

RHFMultiSelect.propTypes = {
  checkbox: PropTypes.bool,
  chip: PropTypes.bool,
  path: PropTypes.string,
  helperText: PropTypes.object,
  label: PropTypes.string,
  name: PropTypes.string,
  options: PropTypes.array,
  placeholder: PropTypes.string,
};
