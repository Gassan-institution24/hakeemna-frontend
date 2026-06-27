import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
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
import { useGetwgroupEmployeeEngs } from 'src/api/work_groups';

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

function getWgExistingRoleIds(wgEng) {
  if (!wgEng) return [];
  if (wgEng.roles?.length) {
    return wgEng.roles.map((r) => r?._id || r).filter(Boolean);
  }
  if (wgEng.role) {
    const id = wgEng.role?._id || wgEng.role;
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

export default function AssignRoleDialog({ open, onClose, engagement, unitServiceId, onSaved }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const { initialize } = useAuthContext();
  const { roles, loading } = useGetUnitServiceRoles(unitServiceId);

  // Overall (engagement-level) role selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Work group engagement role selections: { [wgEngId]: string[] }
  const [wgRoleSelections, setWgRoleSelections] = useState({});

  const [saving, setSaving] = useState(false);

  // Load work group engagements for this employee engagement
  const { data: wgEngagements, loading: wgLoading } = useGetwgroupEmployeeEngs(engagement?._id);

  useEffect(() => {
    if (open) {
      setSelectedIds(getExistingRoleIds(engagement));
      // Initialize WG role selections from existing data
      if (Array.isArray(wgEngagements)) {
        const initial = {};
        wgEngagements.forEach((wge) => {
          initial[wge._id] = getWgExistingRoleIds(wge);
        });
        setWgRoleSelections(initial);
      }
    }
  }, [open, engagement, wgEngagements]);

  const toggleRole = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const toggleWgRole = (wgEngId, roleId) => {
    setWgRoleSelections((prev) => {
      const current = prev[wgEngId] || [];
      const updated = current.includes(roleId)
        ? current.filter((r) => r !== roleId)
        : [...current, roleId];
      return { ...prev, [wgEngId]: updated };
    });
  };

  const handleAssign = async () => {
    const hasWgRoles = Object.values(wgRoleSelections).some((ids) => ids.length > 0);
    if (selectedIds.length === 0 && !hasWgRoles) {
      enqueueSnackbar(t('Please select at least one role'), { variant: 'error' });
      return;
    }
    setSaving(true);
    try {
      // 1. Assign overall engagement roles (allowed to be empty — clears overall role)
      await axiosInstance.patch(endpoints.roles.assign, {
        engagement_id: engagement._id,
        role_ids: selectedIds,
      });

      // 2. Assign work group engagement roles (for each WGE that exists)
      if (Array.isArray(wgEngagements) && wgEngagements.length > 0) {
        await Promise.all(
          wgEngagements.map(async (wge) => {
            const roleIds = wgRoleSelections[wge._id] || [];
            await axiosInstance.patch(endpoints.roles.assignWorkGroupRole, {
              workgroup_engagement_id: wge._id,
              role_ids: roleIds,
            });
          })
        );
      }

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

  function renderOverallSection() {
    if (loading) {
      return <Typography variant="body2">{t('Loading...')}</Typography>;
    }
    return (
      <RoleCheckboxList
        roles={roles}
        selectedIds={selectedIds}
        onToggle={toggleRole}
        curLangAr={curLangAr}
      />
    );
  }

  function renderWorkGroupSection() {
    if (wgLoading) {
      return <Typography variant="body2">{t('Loading...')}</Typography>;
    }
    if (!Array.isArray(wgEngagements) || wgEngagements.length === 0) {
      return (
        <Typography variant="body2" color="text.secondary">
          {t('No work group memberships.')}
        </Typography>
      );
    }
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {wgEngagements.map((wge) => {
          const wgName = curLangAr
            ? wge.work_group?.name_arabic
            : wge.work_group?.name_english;
          const currentSelections = wgRoleSelections[wge._id] || [];
          return (
            <Box key={wge._id}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
                {wgName || wge._id}
              </Typography>
              {loading ? (
                <Typography variant="body2">{t('Loading...')}</Typography>
              ) : (
                <RoleCheckboxList
                  roles={roles}
                  selectedIds={currentSelections}
                  onToggle={(roleId) => toggleWgRole(wge._id, roleId)}
                  curLangAr={curLangAr}
                />
              )}
            </Box>
          );
        })}
      </Box>
    );
  }

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

        {/* Section 1: Overall Role */}
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
          {t('Overall Role')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('Applies to the employee across the unit service (used when no work group is assigned).')}
        </Typography>
        {renderOverallSection()}

        {/* Section 2: Work Group Roles */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 700 }}>
          {t('Work Group Roles')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {t('Assign roles per work group membership. These permissions are merged with the overall role.')}
        </Typography>
        {renderWorkGroupSection()}
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
  onSaved: PropTypes.func,
};
