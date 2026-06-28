import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControlLabel from '@mui/material/FormControlLabel';

import axiosInstance, { endpoints } from 'src/utils/axios';
import { useGetPermissionsList } from 'src/api/roles';

import { useSnackbar } from 'src/components/snackbar';
import { useTranslate } from 'src/locales';

// Group permission strings by resource prefix
function groupPermissions(permList) {
  const groups = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const perm of permList) {
    const [resource] = perm.split(':');
    if (!groups[resource]) groups[resource] = [];
    groups[resource].push(perm);
  }
  return groups;
}

export default function RoleFormDialog({ open, onClose, role, unitServiceId, onSaved }) {
  const { t } = useTranslate();
  const { enqueueSnackbar } = useSnackbar();
  const { permissions: allPermissions, loading: permsLoading } = useGetPermissionsList();

  const [nameEn, setNameEn] = useState('');
  const [nameAr, setNameAr] = useState('');
  const [selected, setSelected] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setNameEn(role?.name_english || '');
      setNameAr(role?.name_arabic || '');
      setSelected(role?.permissions || []);
    }
  }, [open, role]);

  const togglePermission = (perm) => {
    setSelected((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const toggleGroup = (groupPerms) => {
    const allSelected = groupPerms.every((p) => selected.includes(p));
    if (allSelected) {
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
    setSaving(true);
    try {
      if (role?._id) {
        await axiosInstance.patch(endpoints.roles.one(role._id), {
          name_english: nameEn,
          name_arabic: nameAr,
          permissions: selected,
        });
        enqueueSnackbar(t('Role updated'));
      } else {
        await axiosInstance.post(endpoints.roles.all, {
          name_english: nameEn,
          name_arabic: nameAr,
          permissions: selected,
          unit_service: unitServiceId,
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

  const groups = groupPermissions(allPermissions);

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
        </Box>

        <Typography variant="subtitle2" sx={{ mb: 1.5, color: 'text.secondary' }}>
          {t('Permissions')}
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
                  sx={{
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 1.5,
                  }}
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
