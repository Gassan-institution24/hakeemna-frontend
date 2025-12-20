import { Card, Typography } from '@mui/material';

export default function SuperAdminPermissionsPage() {
    return (
        <Card sx={{ p: 3 }}>
            <Typography variant="h4">
                Super Admin Permissions
            </Typography>

            <Typography variant="body2" color="text.secondary">
                Manage sidebar & access for level 2 super admins
            </Typography>
        </Card>
    );
}
