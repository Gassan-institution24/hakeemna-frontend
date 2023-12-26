import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import { fDate } from 'src/utils/format-time';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

export default function ProfileHome() {
  const { user } = useAuthContext();
  const renderContent = (
    <Stack component={Card} spacing={3} sx={{ p: 3 }}>
      <Typography variant="h4">
        {user.patient.first_name} {user.patient.last_name}
      </Typography>

      {user.patient.drug_allergies.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Drug Allergies
          </Typography>
          <Stack spacing={1}>
            {user.patient.drug_allergies?.map((drug) => (
              <li key={drug?._id}>{drug.trade_name}</li>
            ))}
          </Stack>
        </Stack>
      )}
      {user.patient.diseases?.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Diseases
          </Typography>
          <Stack spacing={1}>
            {user.patient.diseases?.map((disease) => (
              <li key={disease._id}>{disease.name_english}</li>
            ))}
          </Stack>
        </Stack>
      )}
      {user.patient.surgeries.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Surgeries
          </Typography>
          <Stack spacing={1}>
            {user.patient.surgeries.map((surgery) => (
              <li key={surgery._id}>{surgery.name}</li>
            ))}
          </Stack>
        </Stack>
      )}
      {user.patient.medicines.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Medicines
          </Typography>
          <Stack spacing={1}>
            {user.patient.medicines?.map((data) => (
              <li key={data._id}>{data?.frequently}</li>
            ))}
          </Stack>
        </Stack>
      )}
      {user.patient.insurance.length > 0 && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Insurance
          </Typography>
          <Stack spacing={1}>
            {user.patient.insurance.map((company) => (
              <li key={company._id}>{company?.name_english}</li>
            ))}
          </Stack>
        </Stack>
      )}

      {user.patient.sport_exercises && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Sport Exercises
          </Typography>
          <li>{user.patient.sport_exercises}</li>
        </Stack>
      )}
      {user.patient.eating_diet && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Eating Diet
          </Typography>
          <li>{user.patient.eating_diet?.name_english}</li>
        </Stack>
      )}
      {user.patient.alcohol_consumption && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Alcohol Consumption
          </Typography>
          <li>{user.patient.alcohol_consumption}</li>
        </Stack>
      )}
      {user.patient.smoking && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Smoking
          </Typography>
          <li>{user.patient.smoking}</li>
        </Stack>
      )}
      {user.patient.other_medication_notes && (
        <Stack spacing={2}>
          <Typography style={{ fontWeight: 600 }} variant="h6">
            Other Medication Notes
          </Typography>
          <li>{user.patient.other_medication_notes}</li>
        </Stack>
      )}
    </Stack>
  );

  const renderOverview = (
    <Stack component={Card} spacing={2} sx={{ p: 3 }}>
      {[
        // {
        //   label: 'Patient Father',
        //   value: patient_father?.userName,
        //   icon: <Iconify icon="solar:calendar-date-bold" />,
        // },
        {
          label: 'Gender',
          value: user.patient.gender,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        // {
        //   label: 'Birth Place',
        //   value: nationality?.name_english,
        //   icon: <Iconify icon="solar:calendar-date-bold" />,
        // },
        {
          label: 'Birth Date',
          value: fDate(user.patient.birth_date),
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Identification Number',
          value: user.patient.identification_num,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Blood Type',
          value: user.patient.blood_type,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Pregnant',
          value: user.patient.pregnant ? 'Yes' : 'No',
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Height',
          value: user.patient.height,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Weight',
          value: user.patient.weight,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Marital Status',
          value: user.patient.marital_status,
          icon: <Iconify icon="solar:calendar-date-bold" />,
        },
        {
          label: 'Address',
          value: user.patient.address,
          icon: <Iconify icon="solar:clock-circle-bold" />,
        },
        // {
        //   label: 'Email',
        //   value: email,
        //   icon: <Iconify icon="solar:wad-of-money-bold" />,
        // },
        {
          label: 'Mobile Number',
          value: user.patient.mobile_num1,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
        {
          label: 'Second Mobile Number',
          value: user.patient.mobile_num2,
          icon: <Iconify icon="carbon:skill-level-basic" />,
        },
      ].map((item) => (
        <>
          {item.value && (
            <Stack key={item.label} spacing={1.5}>
              {/* {item.icon} */}
              <ListItemText
                primary={item.label}
                secondary={item.value}
                primaryTypographyProps={{
                  typography: 'body2',
                  color: 'text.secondary',
                  mb: 0.5,
                }}
                secondaryTypographyProps={{
                  typography: 'subtitle2',
                  color: 'text.primary',
                  component: 'span',
                }}
              />
            </Stack>
          )}
        </>
      ))}
    </Stack>
  );
  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={8}>
        {renderContent}
      </Grid>

      <Grid xs={12} md={4}>
        {renderOverview}
      </Grid>
    </Grid>
  );
}
