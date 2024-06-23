import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function ProductFiltersResult({
  filters,
  onFilters,
  //
  canReset,
  onResetFilters,
  //
  results,
  ...other
}) {
  const { t } = useTranslate();

  const handleRemoveStatus = (e) => {
    onFilters('status', '');
  };
  const handleRemoveCategory = (e) => {
    onFilters('categry', '');
  };
  const handleRemoveName = (e) => {
    onFilters('name', '');
  };

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          {t('results found')}
        </Box>
      </Box>

      <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
        {filters.status !== '' && (
          <Block label={`${t('status')}:`}>
            <Chip size="small" label={t(filters.status)} onDelete={handleRemoveStatus} />
          </Block>
        )}
        {filters.category !== '' && (
          <Block label={`${t('category')}:`}>
            <Chip size="small" label={t(filters.category)} onDelete={handleRemoveCategory} />
          </Block>
        )}
        {filters.name !== '' && (
          <Block label={`${t('search')}:`}>
            <Chip size="small" label={t("search")} onDelete={handleRemoveName} />
          </Block>
        )}

        {canReset && (
          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
          >
            {t('clear')}
          </Button>
        )}
      </Stack>
    </Stack>
  );
}

ProductFiltersResult.propTypes = {
  canReset: PropTypes.bool,
  filters: PropTypes.object,
  onFilters: PropTypes.func,
  results: PropTypes.number,
  onResetFilters: PropTypes.func,
};

// ----------------------------------------------------------------------

function Block({ label, children, sx, ...other }) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
        ...sx,
      }}
      {...other}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}

Block.propTypes = {
  children: PropTypes.node,
  label: PropTypes.string,
  sx: PropTypes.object,
};
