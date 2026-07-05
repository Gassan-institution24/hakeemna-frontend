import { useLocation } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { useTranslate } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';

import { NAV } from '../config-layout';
import { useNavData } from './config-employee-navigation';

// ----------------------------------------------------------------------

export default function NavMini() {
  const { t } = useTranslate();
  const location = useLocation();

  const navData = useNavData();
  const items = navData?.[0]?.items || [];

  return (
    <Box
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: NAV.W_MINI },
      }}
    >
      <Stack
        sx={{
          top: 168,
          right: 0,
          position: 'fixed',
          width: NAV.W_MINI,
          maxHeight: 'calc(100vh - 190px)',
          bgcolor: 'background.paper',
          borderRadius: '16px 0 0 16px',
          border: (theme) => `solid 1px ${theme.palette.divider}`,
          borderRight: 'none',
          boxShadow: (theme) => theme.customShadows?.z8,
          overflow: 'hidden',
        }}
      >
        <Typography
          variant="overline"
          sx={{
            pt: 2,
            pb: 1,
            px: 1,
            textAlign: 'center',
            color: 'text.secondary',
          }}
        >
          {t('employees')}
        </Typography>

        <Scrollbar sx={{ flexGrow: 1 }}>
          <Stack spacing={0.5} sx={{ px: 1, pb: 2 }}>
            {items.map((item, idx) => {
              const active = location.pathname === item.path;

              return (
                <Tooltip key={idx} title={item.title || ''} placement="left" arrow>
                  <ButtonBase
                    component={RouterLink}
                    href={item.path}
                    sx={{
                      py: 1,
                      width: 1,
                      borderRadius: 1.5,
                      flexDirection: 'column',
                      color: 'text.secondary',
                      transition: (theme) =>
                        theme.transitions.create(['background-color', 'color'], {
                          duration: theme.transitions.duration.shorter,
                        }),
                      '&:hover': {
                        bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                      },
                      ...(active && {
                        color: 'primary.main',
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                      }),
                    }}
                  >
                    <Avatar
                      src={item.picture}
                      alt={item.title}
                      sx={{
                        width: 44,
                        height: 44,
                        mb: 0.75,
                        ...(active && {
                          border: (theme) => `solid 2px ${theme.palette.primary.main}`,
                        }),
                      }}
                    >
                      {item.title?.charAt(0)?.toUpperCase()}
                    </Avatar>

                    <Typography
                      noWrap
                      variant="caption"
                      sx={{
                        px: 0.5,
                        maxWidth: 1,
                        color: 'inherit',
                        textAlign: 'center',
                        fontWeight: active ? 'fontWeightSemiBold' : 'fontWeightMedium',
                      }}
                    >
                      {item.title}
                    </Typography>
                  </ButtonBase>
                </Tooltip>
              );
            })}
          </Stack>
        </Scrollbar>
      </Stack>
    </Box>
  );
}
