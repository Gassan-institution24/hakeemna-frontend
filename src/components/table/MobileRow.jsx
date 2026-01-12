import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function MobileRow({ title, fields, actions, sx }) {
  const popover = usePopover();

  const visibleActions = actions?.filter((a) => a.show !== false) || [];

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 2.5,
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        color: sx?.color,
        ...sx,
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { paddingBottom: 0 } }}>
        {/* Header */}
        <Box
          sx={{
            p: 2,
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e9ecef',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>

          {visibleActions.length > 0 && (
            <IconButton onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          )}
        </Box>

        {/* Body → هنا الماب المهم */}
        <Box>
          {fields.map((field, index) => (
            <RowBox key={index} label={field.label} value={field.value} />
          ))}
        </Box>
      </CardContent>

      {/* Actions */}
      {visibleActions.length > 0 && (
        <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
          {visibleActions.map((action, index) => (
            <MenuItem
              key={index}
              onClick={(event) => {
                action.onClick?.(event);
                popover.onClose();
              }}
              sx={{ color: action.color }}
            >
              {action.icon && <Iconify icon={action.icon} sx={{ mr: 1 }} width={18} />}
              {action.label}
            </MenuItem>
          ))}
        </CustomPopover>
      )}
    </Card>
  );
}
export function RowBox({ label, value }) {
  return (
    <Box
      sx={{
        display: 'flex',
        borderBottom: '1px solid #e9ecef',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: '#f8f9fa',
        },
      }}
    >
      <Box
        sx={{
          width: '40%',
          p: 1.5,
          fontWeight: 600,
          textAlign: 'left',
          borderRight: '1px solid #e9ecef',
          backgroundColor: '#f8f9fa',
          color: '#495057',
          fontSize: '0.875rem',
        }}
      >
        {label}
      </Box>

      <Box
        sx={{
          width: '60%',
          p: 1.5,
          textAlign: 'left',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
          color: 'inherit',
        }}
      >
        {typeof value === 'function' ? value() : (value ?? '-')}
      </Box>
    </Box>
  );
}
MobileRow.propTypes = {
  title: PropTypes.node.isRequired,
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.any,
    })
  ).isRequired,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      onClick: PropTypes.func,
      show: PropTypes.bool,
      icon: PropTypes.string,
      color: PropTypes.string,
    })
  ),
  sx: PropTypes.object,
};

RowBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};
