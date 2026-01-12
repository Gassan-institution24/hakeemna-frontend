import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import BusinessIcon from "@mui/icons-material/Business";
import {
    Box, Grid, Card, Stack, Dialog, Button,  TextField, Typography, CardContent, DialogTitle, DialogContent, DialogActions,
} from "@mui/material";

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useGetUnitservice, useGetInsuranceCos } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';



export default function ClaimHome() {
    const { insuranseCosData } = useGetInsuranceCos();
    const router = useRouter();
    const { user } = useAuthContext();
    const unitServiceId =
        user?.employee?.employee_engagements?.[
            user?.employee?.selected_engagement
        ]?.unit_service?._id;
    const { data, refetch } = useGetUnitservice(unitServiceId)

    const [openDialog, setOpenDialog] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    const claimUsername =
        data?.claim_username;
    const claimPassword =
        data?.claim_password;


    const handleSaveAndContinue = async () => {
        try {
            await axios.patch(
                endpoints.unit_services.one(unitServiceId),
                {
                    claim_username: username,
                    claim_password: password,
                    claim_registered: true,
                }
            );

            enqueueSnackbar('Claim credentials saved successfully', {
                variant: 'success',
            });

            setOpenDialog(false);


            navigate(paths.unitservice.accounting.claim.company(selectedCompany._id))

        } catch (error) {
            enqueueSnackbar(
                error?.message || 'Failed to save claim credentials',
                { variant: 'error' }
            );
        }
    };

    return (
        <Box
            sx={{
                bgcolor: "#fff",
                pt: 3,
                minHeight: "100%",
            }}

        >
            <Box sx={{ px: 3 }}>
                {/* Header */}
                <Stack spacing={1} mb={5}>
                    <Typography variant="h4" fontWeight={600}>
                        Select Insurance Company
                    </Typography>
                </Stack>

                {/* Companies */}
                <Grid container spacing={3}>
                    {insuranseCosData.map((company) => (
                        <Grid item xs={12} sm={6} md={4} key={company._id}>
                            <Card
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    borderRadius: 2,
                                    bgcolor:"#f4f6f8",
                                    border: "1px solid #e0e0e0",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                                    transition: "all 0.25s ease",
                                    "&:hover": {
                                        boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                                    },
                                }}
                                onClick={() => {
                                    if (!claimUsername || !claimPassword) {
                                        setSelectedCompany(company);
                                        setOpenDialog(true);
                                        refetch()
                                        return;
                                    }
                                    router.push(
                                        paths.unitservice.accounting.claim.company(company._id)
                                    );
                                }}

                            >
                                <CardContent sx={{ p: 3 }}>
                                    <Stack spacing={2} alignItems="center">
                                        {/* Icon */}
                                        <Box
                                            sx={{
                                                width: 56,
                                                height: 56,
                                                borderRadius: "50%",
                                                bgcolor: "primary.main",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <BusinessIcon sx={{ color: "#fff", fontSize: 28 }} />
                                        </Box>

                                        {/* Company Name */}
                                        <Typography variant="h6" fontWeight={600}>
                                            {company.name}
                                        </Typography>

                                        <Typography variant="body2" color="text.secondary">
                                            {company.name_english}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                fullWidth
                maxWidth="xs"
            >
                <DialogTitle>
                    Claim System Credentials
                </DialogTitle>

                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Claim Username"
                            fullWidth
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <TextField
                            label="Claim Password"
                            type="password"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Stack>
                </DialogContent>

                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveAndContinue}
                        disabled={!username || !password}
                    >
                        Continue
                    </Button>
                </DialogActions>
            </Dialog>


        </Box>
    );
}
