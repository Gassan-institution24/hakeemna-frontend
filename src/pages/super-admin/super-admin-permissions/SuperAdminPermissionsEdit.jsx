import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import {
  Box,
  Grid,
  Card,
  Stack,
  Button,
  Divider,
  Checkbox,
  Typography,
  FormControlLabel,
  CircularProgress,
} from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetSuperAdminById, updateSuperAdminPermissions } from 'src/api/user';

import { useSnackbar } from 'src/components/snackbar';

const SUPER_ADMIN_PERMISSIONS = [
  'confirming',
  'calendar',
  'unit_services',
  'patients',
  'stakeholders',
  'users',
  'video_calls',
  'employees',
  'accounting',
  'subscriptions',
  'quality_control',
  'tables',
  'statistics',
  'acl',
  'customers_training',
  'team_training',
  'adjustable_services',
  'blogs',
  'permissions',
];

export default function SuperAdminPermissionsEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: user, loading } = useGetSuperAdminById(id);
  const { enqueueSnackbar } = useSnackbar();

  const [permissions, setPermissions] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.permissions) {
      setPermissions(user.permissions);
    }
  }, [user]);

  const togglePermission = (key) => {
    setPermissions((prev) => (prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]));
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await updateSuperAdminPermissions(id, permissions);

      enqueueSnackbar('Permissions updated successfully', {
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Failed to update permissions', {
        variant: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSelectAll = () => {
    setPermissions(SUPER_ADMIN_PERMISSIONS);
  };

  const handleDeselectAll = () => {
    setPermissions([]);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card sx={{ p: 3 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h4">Edit Super Admin Permissions</Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.userName || '—'} — {user?.email}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button size="small" variant="outlined" onClick={handleSelectAll} disabled={saving}>
            Select All
          </Button>

          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={handleDeselectAll}
            disabled={saving}
          >
            Deselect All
          </Button>
        </Stack>

        <Divider />

        <Grid container spacing={2}>
          {SUPER_ADMIN_PERMISSIONS.map((key) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={permissions.includes(key)}
                    onChange={() => togglePermission(key)}
                  />
                }
                label={key}
              />
            </Grid>
          ))}
        </Grid>

        <Divider />

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={() => navigate(paths.superadmin.superAdminPermissions.root)}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
