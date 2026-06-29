import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
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
  const { user } = useAuthContext();

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const { roles, loading, refetch } = useGetUnitServiceRoles(unitServiceId);

  const [formOpen, setFormOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteBlockedBy, setDeleteBlockedBy] = useState(null);
  const [deleting, setDeleting] = useState(false);

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
      setDeleteTarget(null);
    } catch (err) {
      if (err.employees?.length) {
        setDeleteBlockedBy(err.employees);
      } else {
        enqueueSnackbar(err.message || t('Cannot delete role'), { variant: 'error' });
        setDeleteTarget(null);
      }
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, enqueueSnackbar, t, refetch]);

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
        open={!!deleteTarget && !deleteBlockedBy}
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

      <ConfirmDialog
        open={!!deleteBlockedBy}
        onClose={() => { setDeleteBlockedBy(null); setDeleteTarget(null); }}
        title={t('Cannot Delete Role')}
        content={
          <Box>
            <Typography variant="body2" sx={{ mb: 1.5 }}>
              {t('This role is still assigned to the following employees. Remove it from their permissions first:')}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {deleteBlockedBy?.map((emp, i) => (
                <Typography key={i} variant="subtitle2">
                  {curLangAr ? emp.name_arabic : emp.name_english}
                  {emp.email && (
                    <Typography component="span" variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                      {emp.email}
                    </Typography>
                  )}
                </Typography>
              ))}
            </Box>
          </Box>
        }
        action={
          <Button variant="contained" onClick={() => { setDeleteBlockedBy(null); setDeleteTarget(null); }}>
            {t('OK')}
          </Button>
        }
      />
    </>
  );
}
