import PropTypes from 'prop-types';

import Stack from '@mui/material/Stack';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';

// ----------------------------------------------------------------------

export default function TableSelectedAction({
  dense,
  action,
  rowCount,
  numSelected,
  onSelectAllRows,
  sx,
  color,
  ...other
}) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  if (!numSelected) {
    return null;
  }

  return (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        pl: 1,
        pr: 2,
        top: 0,
        left: 0,
        width: 1,
        zIndex: 9,
        height: 58,
        position: 'absolute',

        bgcolor: `${color}.lighter`,
        ...(dense && {
          height: 38,
        }),
        ...sx,
      }}
      {...other}
    >
      <Checkbox
        indeterminate={!!numSelected && numSelected < rowCount}
        checked={!!rowCount && numSelected === rowCount}
        onChange={(event) => onSelectAllRows(event.target.checked)}
      />

      <Typography
        variant="subtitle2"
        sx={{
          ml: 2,
          flexGrow: 1,
          color: `${color}.main`,
          ...(dense && {
            ml: 3,
          }),
        }}
      >
        {numSelected} {t('selected')}
      </Typography>

      {action && action}
    </Stack>
  );
}

TableSelectedAction.propTypes = {
  action: PropTypes.node,
  dense: PropTypes.bool,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  rowCount: PropTypes.number,
  sx: PropTypes.object,
  color: PropTypes.string,
};
