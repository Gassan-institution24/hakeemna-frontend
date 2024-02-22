import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import CardHeader from '@mui/material/CardHeader';

import { useParams } from 'src/routes/hooks';

import { fNumber } from 'src/utils/format-number';

import { useGetEmployee, useGetEmployeeAppointments } from 'src/api';

import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function Doctorpage() {
  const params = useParams();
  const { id } = params;
  const { appointmentsData } = useGetEmployeeAppointments(id);

  const { data } = useGetEmployee(id);

  console.log(appointmentsData);

  const renderHead = (
    appointmentsData?.map((employee,index)=>(
      employee?.work_group?.employees?.map((sd)=>(
        <CardHeader
        key={index}
      disableTypography
      avatar={<Avatar src={data?.picture} alt="sdf" />}
      title={
        <Link color="inherit" variant="subtitle1">
          {sd?.code} {data?.middle_name} {data?.family_name}
        </Link>
      }
      subheader={
        <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
          {data?.speciality?.name_english}
        </Box>
      }
    />
      ))
    ))
  
  );
  const renderFollows = (
    <Card sx={{ py: 3, textAlign: 'center', typography: 'h4' }}>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem sx={{ borderStyle: 'dashed' }} />}
      >
        <Stack width={1}>{fNumber('sdsdds')}</Stack>

        <Stack width={1}>{fNumber('info.totalFollowing')}</Stack>
      </Stack>
    </Card>
  );

  const renderAbout = (
    <Card>
      <CardHeader title="About" />

      <Stack spacing={2} sx={{ p: 3 }}>
        <Box sx={{ typography: 'body2' }}>dfgdfg</Box>

        <Stack direction="row" spacing={2}>
          <Iconify icon="mingcute:location-fill" width={24} />

          <Box sx={{ typography: 'body2' }}>
            {`Live at `}
            <Link variant="subtitle2" color="inherit">
              country
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" sx={{ typography: 'body2' }}>
          <Iconify icon="fluent:mail-24-filled" width={24} sx={{ mr: 2 }} />
          dfdfghh
        </Stack>

        <Stack direction="row" spacing={2}>
          <Iconify icon="ic:round-business-center" width={24} />

          <Box sx={{ typography: 'body2' }}>
            dfgfdgddfg
            <Link variant="subtitle2" color="inherit">
              dgdfg
            </Link>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2}>
          {data?.online === false ? (
            <Iconify icon="fxemoji:noentrysign" width={24} />
          ) : (
            <Iconify icon="icon-park:correct" width={24} />
          )}

          <Box sx={{ typography: 'body2' }}>Available online</Box>
        </Stack>
      </Stack>
    </Card>
  );

  const renderPostInput = <Card sx={{ p: 3 }}>kmkdfk</Card>;

  const renderSocials = (
    <Card>
      <CardHeader title="Social" />
      <Stack spacing={2} sx={{ p: 3 }}>
        {/* <Iconify icon="pepicons-print:internet" /> */}
        <Link href={data?.web_page} target="_blank" rel="noopener noreferrer">
          {data?.web_page}
        </Link>
      </Stack>
    </Card>
  );

  return (
    <Grid container spacing={3}>
      <Grid xs={12} md={4}>
        <Stack spacing={3}>
          {renderHead}
          {renderFollows}

          {renderAbout}
          {data?.web_page?.length > 1 ? renderSocials : ''}
        </Stack>
      </Grid>

      <Grid xs={12} md={8}>
        <Stack spacing={3}>{renderPostInput}</Stack>
      </Grid>
    </Grid>
  );
}
