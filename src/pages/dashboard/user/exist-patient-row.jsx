import PropTypes from 'prop-types';

import { Button } from '@mui/material';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';


// ----------------------------------------------------------------------

export default function ExistPatientRow({ row, selected }) {
  const {_id, identification_num, mobile_num1, first_name, name_arabic } = row;
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();

  const handleEmployment = async () => {
    try {
      await axios.patch(endpoints.patients.one(_id), {
        family_members: user?.patient?.id,
      });
      // socket.emit('created', {
      //   user,
      //   link: paths.unitservice.employees.root,
      //   msg: `created an employee <strong>${row.first_name}</strong>`,
      // });
      enqueueSnackbar(t('employment successfully!'));
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
      <TableCell lang="ar" align="center">
        {name_arabic}
      </TableCell>

      <TableCell lang="ar" align="center">
        {mobile_num1}
      </TableCell>
      <TableCell lang="ar" align="center">
        <Button variant="outlined" onClick={() => handleEmployment()}>
          {t('Request To Add')} &nbsp; <Iconify sx={{ mb: '5px' }} icon="icon-park:add-user" />
        </Button>
      </TableCell>
    </TableRow>
  );

  return <>{renderPrimary}</>;
}

ExistPatientRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
