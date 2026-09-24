import PropTypes from 'prop-types';
import { useMemo, useState, useEffect } from 'react';

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

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUnitServiceRoles } from 'src/api/roles';

import { useSnackbar } from 'src/components/snackbar';

const idOf = (value) => String(value?._id || value || '');

const localName = (doc, curLangAr) =>
  (curLangAr ? doc?.name_arabic || doc?.name_english : doc?.name_english || doc?.name_arabic) || '';

function getExistingRoleIds(engagement) {
  if (!engagement) return [];
  if (engagement.roles?.length) {
    return engagement.roles.map((r) => idOf(r)).filter(Boolean);
  }
  if (engagement.role) {
    const id = idOf(engagement.role);
    return id ? [id] : [];
  }
  return [];
}

/**
 * The roles this employee may be given, bucketed by the work group each one belongs to.
 *
 * Roles are defined per work group and an employee may belong to several groups, so the offer is
 * the union across ALL of their groups. Two buckets exist beyond that, and both are deliberate:
 *
 *  - `unlinked` — roles with no work group at all (legacy rows, or a role whose link was lost).
 *    Hiding them is what makes a role look like it has vanished, so they are shown and labelled.
 *  - `outside` — roles the employee already holds that no longer belong to any of their groups,
 *    typically after being moved between groups. Without this bucket the checkbox for a live role
 *    is not rendered, so an admin can see neither that it is there nor any way to take it away.
 */
function buildRoleGroups({ allRoles, workGroups, assignedIds, curLangAr, t }) {
  const groupIds = new Set((workGroups || []).map((wg) => idOf(wg)));
  const assigned = new Set(assignedIds.map(String));

  const inMyGroups = [];
  const unlinked = [];
  const outside = [];

  allRoles.forEach((role) => {
    const wgId = idOf(role.work_group);
    if (wgId && groupIds.has(wgId)) inMyGroups.push(role);
    else if (!wgId) unlinked.push(role);
    else if (assigned.has(String(role._id))) outside.push(role);
  });

  const buckets = (workGroups || [])
    .map((wg) => ({
      key: idOf(wg),
      label: localName(wg, curLangAr),
      caption: t('work group'),
      roles: inMyGroups.filter((role) => idOf(role.work_group) === idOf(wg)),
    }))
    .filter((bucket) => bucket.roles.length > 0);

  if (unlinked.length) {
    buckets.push({
      key: '__unlinked__',
      label: t('Not linked to a work group'),
      caption: t('These roles are not tied to any work group'),
      roles: unlinked,
    });
  }

  if (outside.length) {
    buckets.push({
      key: '__outside__',
      label: t('Assigned from another work group'),
      caption: t('Already held, but the work group is no longer one of theirs'),
      roles: outside,
    });
  }

  return buckets;
}

function RoleCheckbox({ role, checked, onToggle, curLangAr }) {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={() => onToggle(role._id)} />}
      label={
        <Box>
          <Typography variant="subtitle2">{localName(role, curLangAr)}</Typography>
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
        borderColor: checked ? 'primary.main' : 'divider',
        borderRadius: 1,
        px: 1,
        py: 0.5,
        mb: 0.5,
        ml: 0,
        mr: 0,
        width: 1,
        bgcolor: checked ? 'primary.lighter' : 'transparent',
        alignItems: 'flex-start',
      }}
    />
  );
}

RoleCheckbox.propTypes = {
  role: PropTypes.object.isRequired,
  checked: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  curLangAr: PropTypes.bool,
};

export default function AssignRoleDialog({
  open,
  onClose,
  engagement,
  unitServiceId,
  workGroups,
  onSaved,
}) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const { initialize } = useAuthContext();
  const { roles: allRoles, loading, error } = useGetUnitServiceRoles(unitServiceId);

  const [selectedIds, setSelectedIds] = useState([]);
  const [saving, setSaving] = useState(false);

  const assignedIds = useMemo(() => getExistingRoleIds(engagement), [engagement]);

  const buckets = useMemo(
    () => buildRoleGroups({ allRoles, workGroups, assignedIds, curLangAr, t }),
    [allRoles, workGroups, assignedIds, curLangAr, t]
  );

  useEffect(() => {
    if (open) {
      setSelectedIds(assignedIds);
    }
  }, [open, assignedIds]);

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

  const employeeName = localName(engagement?.employee, curLangAr);
  const groupNames = (workGroups || []).map((wg) => localName(wg, curLangAr)).join('، ');

  // Each state gets its own message. They all used to render the same "No roles available.",
  // which made a 403 on the roles request indistinguishable from an employee who simply has no
  // roles to pick from — the single most confusing part of this screen.
  const renderBody = () => {
    if (loading) return <Typography variant="body2">{t('Loading...')}</Typography>;

    if (error) {
      // The axios interceptor rejects with the server's JSON body, so the reason the request was
      // refused is right there — usually "you don't have permission to do this action", i.e. the
      // account doing the assigning is itself missing `permissions:read`. Showing it beats the
      // old behaviour of rendering a failed request as an empty list.
      const reason = curLangAr
        ? error?.arabic_message || error?.message
        : error?.message || error?.arabic_message;
      return (
        <Alert severity="error">
          {t('Could not load the roles for this clinic')}
          {reason ? ` — ${reason}` : ''}
        </Alert>
      );
    }

    if (!workGroups?.length) {
      return (
        <Alert severity="warning">
          {t('This employee is not in any work group, and roles are defined per work group. Add them to a work group first.')}
        </Alert>
      );
    }

    if (buckets.length === 0) {
      return (
        <Alert severity="info">
          {t('No role is linked to this employee’s work groups yet')} ({groupNames}).{' '}
          {t('Create a role for one of these work groups, or link an existing role to it.')}
        </Alert>
      );
    }

    return buckets.map((bucket, index) => (
      <Box key={bucket.key} sx={{ mb: 2 }}>
        {index > 0 && <Divider sx={{ mb: 2 }} />}
        <Typography variant="overline" sx={{ display: 'block', color: 'text.secondary' }}>
          {bucket.label}
        </Typography>
        <Typography variant="caption" sx={{ display: 'block', color: 'text.disabled', mb: 1 }}>
          {bucket.caption}
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {bucket.roles.map((role) => (
            <RoleCheckbox
              key={role._id}
              role={role}
              checked={selectedIds.includes(role._id)}
              onToggle={toggleRole}
              curLangAr={curLangAr}
            />
          ))}
        </Box>
      </Box>
    ));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('Assign Roles')}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ mb: 0.5, color: 'text.secondary' }}>
          {employeeName}
        </Typography>
        {/* Naming the groups makes the scope of the list checkable at a glance — the old dialog
            silently filtered by one group and never said which. */}
        {!!workGroups?.length && (
          <Typography variant="caption" sx={{ display: 'block', mb: 2, color: 'text.disabled' }}>
            {t('work groups')}: {groupNames}
          </Typography>
        )}
        <Alert severity="info" sx={{ mb: 2 }}>
          {t('Select one or more roles. Permissions from all selected roles will be merged.')}
        </Alert>

        {renderBody()}
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
  // Every work group this engagement belongs to. Roles are offered from all of them.
  workGroups: PropTypes.array,
  onSaved: PropTypes.func,
};
