import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BusinessIcon from '@mui/icons-material/Business';
import {
  Box,
  Grid,
  Card,
  Stack,
  Dialog,
  Button,
  TextField,
  Typography,
  CardContent,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetUnitservice, useGetInsuranceCos } from 'src/api';

import { useSnackbar } from 'src/components/snackbar';

export default function ClaimHome() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();
  const { user } = useAuthContext();

  const unitServiceId =
    user?.employee?.employee_engagements?.[user?.employee?.selected_engagement]?.unit_service?._id;

  const { data, refetch } = useGetUnitservice(unitServiceId);

  const { insuranseCosData } = useGetInsuranceCos();

  const unitInsuranceCompanies = data?.insurance || [];

  const filteredInsuranceCos = insuranseCosData.filter((company) =>
    unitInsuranceCompanies.some((info) => info._id === company._id)
  );

  const [openDialog, setOpenDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const claimUsername = data?.claim_username;
  const claimPassword = data?.claim_password;

  const handleSaveAndContinue = async () => {
    try {
      await axios.patch(endpoints.unit_services.one(unitServiceId), {
        claim_username: username,
        claim_password: password,
        claim_registered: true,
      });

      enqueueSnackbar(t('claim Save Success'), { variant: 'success' });

      setOpenDialog(false);
      navigate(paths.unitservice.accounting.claim.company(selectedCompany._id));
    } catch (error) {
      enqueueSnackbar(error?.message || t('claim Save Error'), {
        variant: 'error',
      });
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        pt: 3,
        minHeight: '100%',
      }}
    >
      <Box sx={{ px: 3 }}>
        {/* Header */}
        <Stack spacing={1} mb={5}>
          <Typography variant="h4" fontWeight={600}>
            {t('select Insurance Company')}
          </Typography>
        </Stack>

        {/* Companies */}
        <Grid container spacing={3}>
          {/* Companies */}
          {filteredInsuranceCos.length === 0 ? (
            <Box
              sx={{
                py: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography color="text.secondary" variant="h6">
                {t('no Insurance Companies')}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredInsuranceCos.map((company) => (
                <Grid item xs={12} sm={6} md={4} key={company._id}>
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: 2,
                      bgcolor: '#f4f6f8',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      transition: 'all 0.25s ease',
                      '&:hover': {
                        boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                      },
                    }}
                    onClick={() => {
                      if (!claimUsername || !claimPassword) {
                        setSelectedCompany(company);
                        setOpenDialog(true);
                        setUsername(data?.claim_username || '');
                        setPassword('');
                        refetch();
                        return;
                      }
                      router.push(paths.unitservice.accounting.claim.company(company._id));
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack spacing={2} alignItems="center">
                        <Box
                          sx={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <BusinessIcon sx={{ color: '#fff', fontSize: 28 }} />
                        </Box>

                        <Typography variant="h6" fontWeight={600}>
                          {curLangAr ? company.name_arabic : company.name_english}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
        <DialogTitle>{t('claim System Credentials')}</DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label={t('claim Username')}
              fullWidth
              value={username}
              autoComplete="new-username"
              onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
              label={t('claim Password')}
              type="password"
              fullWidth
              value={password}
              autoComplete="new-password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>{t('Cancel')}</Button>
          <Button
            variant="contained"
            onClick={handleSaveAndContinue}
            disabled={!username || !password}
          >
            {t('continue')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
