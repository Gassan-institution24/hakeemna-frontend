import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import { Card, Table, TableRow, TableBody, TableCell, TableHead, TableContainer, Tooltip } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useLocales,useTranslate } from 'src/locales';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useGetUnitServiceRoles } from 'src/api/roles';
import { useAuthContext } from 'src/auth/hooks'; 

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { LoadingScreen } from 'src/components/loading-screen';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import RoleFormDialog from '../role-form-dialog';

export default function RolesListView() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();
  const { user, initialize } = useAuthContext();

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const currentEngagement =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement];
  const alreadyOwner = currentEngagement?.is_owner === true;

  const { roles, loading, refetch } = useGetUnitServiceRoles(unitServiceId);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [migrating, setMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);
  const [markingOwners, setMarkingOwners] = useState(false);

  const handleNew = () => {
    setEditingRole(null);
    setFormOpen(true);
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormOpen(true);
  };

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(endpoints.roles.one(deleteTarget._id));
      enqueueSnackbar(t('Role deleted'));
      refetch();
    } catch (err) {
      enqueueSnackbar(err.message || t('Cannot delete role'), { variant: 'error' });
    } finally {
      setDeleting(false);
      setDeleteTarget(null);
    }
  }, [deleteTarget, enqueueSnackbar, t, refetch]);

  const handleMarkOwners = async () => {
    setMarkingOwners(true);
    try {
      const res = await axiosInstance.post(endpoints.roles.markOwners);
      enqueueSnackbar(t('Owners marked: {{count}}', { count: res.data.marked }));
      await initialize(); // refresh session so alreadyOwner flips to true and button disappears
    } catch (err) {
      enqueueSnackbar(err.message || t('Failed to mark owners'), { variant: 'error' });
    } finally {
      setMarkingOwners(false);
    }
  };

  const handleMigrate = async () => {
    setMigrating(true);
    setMigrationResult(null);
    try {
      const res = await axiosInstance.post(endpoints.roles.migrate(unitServiceId));
      setMigrationResult(res.data);
      enqueueSnackbar(t('Migration complete'));
      refetch();
    } catch (err) {
      enqueueSnackbar(err.message || t('Migration failed'), { variant: 'error' });
    } finally {
      setMigrating(false);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Container maxWidth="xl">
        <CustomBreadcrumbs
          heading={t('Roles')}
          links={[
            { name: t('dashboard'), href: paths.unitservice.root },
            { name: t('permissions'), href: paths.unitservice.acl.root },
            { name: t('Roles') },
          ]}
          action={
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleNew}
            >
              {t('New Role')}
            </Button>
          }
          sx={{ mb: { xs: 3, md: 5 }, mt: { xs: 3, md: 5 } }}
        />

        <Alert
          severity="info"
          sx={{ mb: 3 }}
          action={
            <Box sx={{ display: 'flex', gap: 1 }}>
              {user?.role === 'admin' && !alreadyOwner && (
                <LoadingButton
                  size="small"
                  loading={markingOwners}
                  variant="outlined"
                  color="warning"
                  onClick={handleMarkOwners}
                >
                  {t('Mark Owners')}
                </LoadingButton>
              )}
              <LoadingButton
                size="small"
                loading={migrating}
                variant="outlined"
                color="inherit"
                onClick={handleMigrate}
              >
                {t('Migrate ACL → Roles')}
              </LoadingButton>
            </Box>
          }
        >
          {t('Run "Mark Owners" once to lock the admin user with permanent full access. Then use "Migrate ACL → Roles" to convert existing employee permissions.')}
        </Alert>

        {migrationResult && (
          <Alert severity="success" sx={{ mb: 3 }} onClose={() => setMigrationResult(null)}>
            {t('Migration complete')}: {migrationResult.migrated} {t('migrated')},{' '}
            {migrationResult.skipped} {t('skipped')}.
            {migrationResult.errors?.length > 0 && ` ${migrationResult.errors.length} errors.`}
          </Alert>
        )}

        <Card>
          <TableContainer>
            <Scrollbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('Name')}</TableCell>
                    <TableCell>{t('Permissions')}</TableCell>
                    <TableCell align="right">{t('Actions')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {roles.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        <Typography variant="body2" sx={{ py: 3, color: 'text.secondary' }}>
                          {t('No roles yet. Click "New Role" to create one.')}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                  {roles.map((role) => (
                    <TableRow key={role._id} hover>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {curLangAr ? role.name_arabic : role.name_english}
                        </Typography>
                        {role.unit_service === null && (
                          <Typography variant="caption" color="text.secondary">
                            {t('System template')}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {role.permissions?.slice(0, 5).map((p) => (
                            <Chip key={p} label={p} size="small" variant="soft" />
                          ))}
                          {role.permissions?.length > 5 && (
                            <Chip
                              label={`+${role.permissions.length - 5}`}
                              size="small"
                              variant="soft"
                              color="default"
                            />
                          )}
                          {!role.permissions?.length && (
                            <Typography variant="caption" color="text.secondary">
                              {t('No permissions')}
                            </Typography>
                          )}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('Edit')}>
                          <IconButton size="small" onClick={() => handleEdit(role)}>
                            <Iconify icon="solar:pen-bold" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('Delete')}>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteTarget(role)}
                          >
                            <Iconify icon="solar:trash-bin-trash-bold" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        </Card>
      </Container>

      <RoleFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        role={editingRole}
        unitServiceId={unitServiceId}
        onSaved={refetch}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={t('Delete Role')}
        content={
          <>
            {t('Are you sure you want to delete')}{' '}
            <strong>
              {curLangAr ? deleteTarget?.name_arabic : deleteTarget?.name_english}
            </strong>
            ?
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={deleting}
            onClick={handleDelete}
          >
            {t('Delete')}
          </LoadingButton>
        }
      />
    </>
  );
}
