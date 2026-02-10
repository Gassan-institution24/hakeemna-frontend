import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import ListItemText from '@mui/material/ListItemText';

import { fDate, fTime, fHourMin } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

export default function MyAttendenceMobile({ attendence, onDelete, refetch, onViewTask }) {
  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', p: 1 }}>
      {attendence.map((row, index) => (
        <MobileRow
          key={index}
          row={row}
          onDelete={onDelete}
          refetch={refetch}
          onViewTask={onViewTask}
        />
      ))}
    </Box>
  );
}

MyAttendenceMobile.propTypes = {
  attendence: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  onViewTask: PropTypes.func.isRequired,
};

function MobileRow({ row, onDelete, refetch, onViewTask }) {
  const { t } = useTranslate();

  const popover = usePopover();
  const DDL = usePopover();

  const {
    date,
    check_in_time,
    check_out_time,
    leave,
    work_type,
    note,
    leaveTime,
    workTime,
    created_at,
    user_creation,
    ip_address_user_creation,
    updated_at,
    user_modification,
    ip_address_user_modification,
    modifications_nums,
    tasks,
    task,
  } = row;

  const normalizedTasks =
    // eslint-disable-next-line no-nested-ternary
    Array.isArray(tasks) && tasks.length
      ? tasks
      : task
        ? [{ activity: task, hours: row.time_doing_the_task }]
        : [];
  const hasActivities =
    Array.isArray(normalizedTasks) &&
    normalizedTasks.some(
      // eslint-disable-next-line no-shadow
      (task) => typeof task?.activity === 'string' && task.activity.trim() !== ''
    );

  return (
    <>
      <Card
        sx={{
          mb: 2,
          borderRadius: 2.5,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}
      >
        <CardContent sx={{ p: 0, '&:last-child': { paddingBottom: 0 } }}>
          <Box
            sx={{
              p: 2,
              backgroundColor: '#f8f9fa',
              borderBottom: '1px solid #e9ecef',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #e9ecef',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#212529', flex: 1 }}>
              {fDate(date, 'EEEE, dd/MM/yyyy')}
            </Typography>

            <IconButton
              color={popover.open ? 'primary' : 'default'}
              onClick={popover.onOpen}
              sx={{
                transition: 'all 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  transform: 'scale(1.1)',
                },
              }}
            >
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          </Box>

          {/* Body */}
          <Box sx={{ p: 0, m: 0 }}>
            <Box
              sx={{
                overflow: 'hidden',
                width: '100%',
                border: '1px solid #e9ecef',
              }}
            >
              <RowBox label={t('check in')} value={fTime(check_in_time)} />
              <RowBox label={t('check out')} value={fTime(check_out_time)} />
              <RowBox label={t('leave time')} value={fHourMin(leaveTime)} />
              <RowBox label={t('work time')} value={fHourMin(workTime)} />
              <RowBox label={t('work type')} value={t(work_type)} />
              <RowBox label={t('leave')} value={t(leave)} />
              <RowBox label={t('note')} value={note} />
              <RowBox
                label={t('Activity')}
                value={
                  hasActivities ? (
                    <Typography component="span" variant="body2">
                      {normalizedTasks[0]?.activity !== '' && normalizedTasks.length ? (
                        <Typography variant="body2">
                          {normalizedTasks[0]?.activity.slice(0, 10)}
                          {normalizedTasks[0]?.activity.length > 10 ? '...' : ''}
                        </Typography>
                        
                      ) : (
                        t('No Data')
                      )}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="text.secondary">
                      {t('No Data')}
                    </Typography>
                  )
                }
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} arrow="right-top">
        <MenuItem lang="ar" onClick={DDL.onOpen}>
          <Iconify icon="carbon:data-quality-definition" />
          {t('DDL')}
        </MenuItem>
        <MenuItem lang="ar" onClick={() => onViewTask(normalizedTasks, row._id)}>
          <Iconify icon="carbon:edit" />
          {t('edit activities')}
        </MenuItem>
      </CustomPopover>

      <CustomPopover
        open={DDL.open}
        onClose={DDL.onClose}
        arrow="right-top"
        sx={{
          padding: 2,
          fontSize: '14px',
        }}
      >
        <Box sx={{ fontWeight: 600 }}>{t('creation time')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={fDate(created_at, 'dd MMMMMMMM yyyy')}
            secondary={fDate(created_at, 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_creation?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by IP')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ip_address_user_creation}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editing time')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
          <ListItemText
            primary={fDate(updated_at, 'dd MMMMMMMM yyyy')}
            secondary={fDate(updated_at, 'p')}
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              component: 'span',
              typography: 'caption',
            }}
          />
        </Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{user_modification?.email}</Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor IP')}:</Box>
        <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
          {ip_address_user_modification}
        </Box>

        <Box sx={{ pt: 1, fontWeight: 600 }}>
          {t('modifications no')}: {modifications_nums}
        </Box>
      </CustomPopover>
    </>
  );
}

MobileRow.propTypes = {
  row: PropTypes.object.isRequired,
  onDelete: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
  onViewTask: PropTypes.func.isRequired,
};
function RowBox({ label, value, clickable, onClick }) {
  return (
    <Box
      onClick={clickable ? onClick : undefined}
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
          color: '#212529',
          fontSize: '0.875rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {value}
      </Box>
    </Box>
  );
}

RowBox.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
};
