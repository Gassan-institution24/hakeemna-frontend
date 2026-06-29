import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import axiosInstance, { endpoints } from 'src/utils/axios';
import { useGetPermissionsList } from 'src/api/roles';
import { useGetUSActiveWorkGroups } from 'src/api/work_groups';
import { useSubscriptionGuard } from 'src/auth/guard/subscription-guard';

import { useSnackbar } from 'src/components/snackbar';
import { useLocales, useTranslate } from 'src/locales';

const PERMISSION_ALIASES = {
  'old_patient:read': 'institution_patients:read',
  'old_patient:create': 'institution_patients:create',
  'old_patient:update': 'institution_patients:update',
  'old_patient:delete': 'institution_patients:delete',
};

// Permission resources that require a subscription feature to be available.
// Resources NOT listed here are always available regardless of subscription.
const RESOURCE_FEATURE_MAP = {
  appointments: 'appointments',
  appointment_configs: 'appointments',
  accounting: 'accounting',
  claims: 'claims',
  hr: 'hr',
  quality_control: 'quality_control',
  offers: 'products',
};

function normalizePermissions(perms) {
  return (perms || []).map((p) => PERMISSION_ALIASES[p] || p);
}

function groupPermissions(permList) {
  return permList.reduce((groups, perm) => {
    const [resource] = perm.split(':');
    if (!groups[resource]) groups[resource] = [];
    groups[resource].push(perm);
    return groups;
  }, {});
}

export default function RoleFormDialog({ open, onClose, role, unitServiceId, onSaved }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const { permissions: allPermissions, loading: permsLoading } = useGetPermissionsList();
  const { workGroupsData } = useGetUSActiveWorkGroups(unitServiceId);
  const { hasFeature } = useSubscriptionGuard();

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [workGroupId, setWorkGroupId] = useState('');
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setNameEn(role?.name_english || '');
      setNameAr(role?.name_arabic || '');
      setWorkGroupId(role?.work_group?._id || role?.work_group || '');
      setSelected(normalizePermissions(role?.permissions));
    }
  }, [open, role]);

  const togglePermission = (perm) => {
    setSelected((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleGroup = (groupPerms) => {
    const allSel = groupPerms.every((p) => selected.includes(p));
    if (allSel) {
      setSelected((prev) => prev.filter((p) => !groupPerms.includes(p)));
    } else {
      setSelected((prev) => [...new Set([...prev, ...groupPerms])]);
    }
  };

  const handleSave = async () => {
    if (!nameEn.trim()) {
      enqueueSnackbar(t('Name (English) is required'), { variant: 'error' });
      return;
    }
    if (!workGroupId) {
      enqueueSnackbar(t('Work group is required'), { variant: 'error' });
      return;
    }
    setSaving(true);
    try {
      if (role?._id) {
        await axiosInstance.patch(endpoints.roles.one(role._id), {
          name_english: nameEn,
          name_arabic: nameAr,
          permissions: selected,
          work_group: workGroupId,
        });
        enqueueSnackbar(t('Role updated'));
      } else {
        await axiosInstance.post(endpoints.roles.all, {
          name_english: nameEn,
          name_arabic: nameAr,
          permissions: selected,
          unit_service: unitServiceId,
          work_group: workGroupId,
        });
        enqueueSnackbar(t('Role created'));
      }
      onSaved();
      onClose();
    } catch (err) {
      enqueueSnackbar(err.message || t('Error saving role'), { variant: 'error' });
    } finally {
      setSaving(false);
    }
  };

  // Only show permission groups whose feature is included in the subscription.
  // Resources not mapped to a feature are always available. Permissions the role
  // already has stay visible so existing roles are never affected.
  const availablePermissions = allPermissions.filter((perm) => {
    if (selected.includes(perm)) return true;
    const [resource] = perm.split(':');
    const feature = RESOURCE_FEATURE_MAP[resource];
    return !feature || hasFeature(feature);
  });

  const groups = groupPermissions(availablePermissions);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{role?._id ? t('Edit Role') : t('New Role')}</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <TextField
            label={t('Name (English)')}
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label={t('Name (Arabic)')}
            value={nameAr}
            onChange={(e) => setNameAr(e.target.value)}
            fullWidth
            dir="rtl"
          />
          <TextField
            select
            label={`${t('work group')} *`}
            value={workGroupId}
            onChange={(e) => setWorkGroupId(e.target.value)}
            fullWidth
          >
            <MenuItem value="" disabled>
              {t('select work group')}
            </MenuItem>
            {workGroupsData.map((wg) => (
              <MenuItem key={wg._id} value={wg._id}>
                {curLangAr ? wg.name_arabic : wg.name_english}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: 'block' }}>
          {selected.length} {t('permissions selected')}
        </Typography>

        {permsLoading ? (
          <Typography variant="body2">{t('Loading...')}</Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 2,
            }}
          >
            {Object.entries(groups).map(([resource, perms]) => {
              const allChecked = perms.every((p) => selected.includes(p));
              const someChecked = perms.some((p) => selected.includes(p)) && !allChecked;
              return (
                <Box
                  key={resource}
                  sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1.5 }}
                >
                  <FormControlLabel
                    label={
                      <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                        {resource.replace(/_/g, ' ')}
                      </Typography>
                    }
                    control={
                      <Checkbox
                        checked={allChecked}
                        indeterminate={someChecked}
                        onChange={() => toggleGroup(perms)}
                        size="small"
                      />
                    }
                  />
                  <Box sx={{ pl: 2 }}>
                    {perms.map((perm) => {
                      const action = perm.split(':')[1];
                      return (
                        <FormControlLabel
                          key={perm}
                          label={<Typography variant="body2">{action}</Typography>}
                          control={
                            <Checkbox
                              checked={selected.includes(perm)}
                              onChange={() => togglePermission(perm)}
                              size="small"
                            />
                          }
                          sx={{ display: 'flex', ml: 0 }}
                        />
                      );
                    })}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          {t('Cancel')}
        </Button>
        <LoadingButton variant="contained" loading={saving} onClick={handleSave}>
          {t('Save')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}

RoleFormDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  role: PropTypes.object,
  unitServiceId: PropTypes.string,
  onSaved: PropTypes.func,
};
