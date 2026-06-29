import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useGetUnitServiceRoles } from 'src/api/roles';

import { useSnackbar } from 'src/components/snackbar';

function getExistingRoleIds(engagement) {
  if (!engagement) return [];
  if (engagement.roles?.length) {
    return engagement.roles.map((r) => r?._id || r).filter(Boolean);
  }
  if (engagement.role) {
    const id = engagement.role?._id || engagement.role;
    return id ? [id] : [];
  }
  return [];
}

function RoleCheckboxList({ roles, selectedIds, onToggle, curLangAr }) {
  if (roles.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        No roles available.
      </Typography>
    );
  }
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      {roles.map((role) => {
        const isChecked = selectedIds.includes(role._id);
        const label = curLangAr ? role.name_arabic : role.name_english;
        return (
          <FormControlLabel
            key={role._id}
            control={<Checkbox checked={isChecked} onChange={() => onToggle(role._id)} />}
            label={
              <Box>
                <Typography variant="subtitle2">{label}</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                  {role.permissions?.slice(0, 4).map((p) => (
                    <Chip key={p} label={p} size="small" sx={{ fontSize: '10px', height: 18 }} />
                  ))}
                  {role.permissions?.length > 4 && (
                    <Chip
                      label={`+${role.permissions.length - 4} more`}
                      size="small"
                      sx={{ fontSize: '10px', height: 18 }}
                    />
                  )}
                </Box>
              </Box>
            }
            sx={{
              border: '1px solid',
              borderColor: isChecked ? 'primary.main' : 'divider',
              borderRadius: 1,
              px: 1,
              py: 0.5,
              mb: 0.5,
              bgcolor: isChecked ? 'primary.lighter' : 'transparent',
              alignItems: 'flex-start',
            }}
          />
        );
      })}
    </Box>
  );
}

RoleCheckboxList.propTypes = {
  roles: PropTypes.array.isRequired,
  selectedIds: PropTypes.array.isRequired,
  onToggle: PropTypes.func.isRequired,
  curLangAr: PropTypes.bool,
};

export default function AssignRoleDialog({ open, onClose, engagement, unitServiceId, workGroupId, onSaved }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const { initialize } = useAuthContext();
  const { roles: allRoles, loading } = useGetUnitServiceRoles(unitServiceId);

  const roles = workGroupId
    ? allRoles.filter((r) => (r.work_group?._id || r.work_group) === workGroupId)
    : allRoles;

  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedIds(getExistingRoleIds(engagement));
    }
  }, [open, engagement]);

  const toggleRole = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleAssign = async () => {
    if (selectedIds.length === 0) {
      enqueueSnackbar(t('Please select at least one role'), { variant: 'error' });
      return;
    }
    setSaving(true);
    try {
      await axiosInstance.patch(endpoints.roles.assign, {
        engagement_id: engagement._id,
        role_ids: selectedIds,
      });

      enqueueSnackbar(t('Role assigned successfully'));
      await initialize();
      onSaved();
      onClose();
    } catch (err) {
      enqueueSnackbar(err.message || t('Error assigning role'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const employeeName = curLangAr
    ? engagement?.employee?.name_arabic
    : engagement?.employee?.name_english;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('Assign Roles')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
          {employeeName}
        </Typography>
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('Select one or more roles. Permissions from all selected roles will be merged.')}
        </Alert>

        {loading ? (
          <Typography variant="body2">{t('Loading...')}</Typography>
        ) : (
          <RoleCheckboxList
            roles={roles}
            selectedIds={selectedIds}
            onToggle={toggleRole}
            curLangAr={curLangAr}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('Cancel')}
        </Button>
        <LoadingButton variant="contained" loading={saving} onClick={handleAssign}>
          {t('Assign')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

AssignRoleDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  engagement: PropTypes.object,
  unitServiceId: PropTypes.string,
  workGroupId: PropTypes.string,
  onSaved: PropTypes.func,
};
