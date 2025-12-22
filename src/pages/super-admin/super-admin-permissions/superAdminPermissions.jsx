import { useNavigate } from 'react-router-dom';

import { Box, Card, Stack, Divider, Typography, CircularProgress } from '@mui/material';

import { paths } from 'src/routes/paths';

import { useGetSuperAdminsLevel2 } from 'src/api/user';

export default function SuperAdminPermissionsPage() {
  const navigate = useNavigate();
  const { data, loading, error, empty } = useGetSuperAdminsLevel2();

  return (
    <Card sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Super Admin Permissions
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Manage sidebar & access for level 2 super admins
      </Typography>

      {/* Loading */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Error */}
      {error && <Typography color="error">Failed to load super admins</Typography>}

      {/* Empty */}
      {empty && <Typography color="text.secondary">No level 2 super admins found</Typography>}

      {/* Data */}
      {!loading && !error && data?.length > 0 && (
        <Stack divider={<Divider />} spacing={2}>
          {data.map((admin) => (
            <Box
              key={admin._id}
              onClick={() => navigate(paths.superadmin.superAdminPermissions.edit(admin._id))}
              sx={{
                cursor: 'pointer',
                p: 2,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Typography fontWeight={600}>{admin.userName || '—'}</Typography>

              <Typography variant="body2" color="text.secondary" sx={{ textTransform: 'none' }}>
                {admin.email}
              </Typography>
            </Box>
          ))}
        </Stack>
      )}
    </Card>
  );
}
