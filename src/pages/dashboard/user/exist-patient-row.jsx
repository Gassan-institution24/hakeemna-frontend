import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content/empty-content';
// import socket from 'src/socket';
// import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function ExistPatientRow({ row, selected }) {
  const {  identification_num, mobile_num1, first_name } = row;
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  const handleAddFamily = async () => {
    try {
      // await axios.patch(endpoints.patients.one(_id), {
      //   family_members: user?.patient?._id,
      // });
      // socket.emit('badge', {
      //   user,
      //   link: paths.dashboard.user.root,
      //   msg: `created an employee <strong>${row.first_name}</strong>`,
      // });
      enqueueSnackbar(t('Invitation sent successfully'));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
      console.error(error);
    }
  };
  const renderPrimary = (
    <TableRow selected={selected}>
      <TableCell lang="ar" align="center">
        {identification_num}
      </TableCell>
      <TableCell lang="ar" align="center">
        {first_name}
      </TableCell>
      {/* <TableCell lang="ar" align="center">
        {name_arabic}
      </TableCell> */}

      <TableCell lang="ar" align="center">
        {mobile_num1}
      </TableCell>
      <TableCell lang="ar" align="center">
        {/* <Button disabled variant="outlined">
          {t('Waiting acceptation')} &nbsp; <Iconify sx={{  display:{md:'block', xs:'none'} }} icon="icon-park:time" />
        </Button> */}
         <Button variant="outlined" onClick={() => handleAddFamily()}>
          {t('Request To Add')} &nbsp; <Iconify sx={{ mb: '5px', display:{md:'block', xs:'none'} }} icon="icon-park:add-user" />
        </Button> 
      </TableCell>
    </TableRow>
  );

  return row?.family_members.length === 0 && row?._id !== user?.patient?._id ? (
    renderPrimary
  ) : (
    <EmptyContent
      filled
      title={t('No Data')}
      sx={{
        py: 10,
        width: {
          sm: '250%',
          xs: '200%',
          md: '321.5%',
          lg: '321.5%',
          xl: '321.5%',
        }
      }}
    />
  );
  // return <> {renderPrimary} </>
}

ExistPatientRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
