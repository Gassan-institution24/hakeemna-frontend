import { useState } from 'react';
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
import axios, { endpoints } from 'src/utils/axios';

// ----------------------------------------------------------------------

export default function ExistPatientRow({ row, selected }) {
  const { identification_num, mobile_num1, name_english, name_arabic } = row;
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();
  const [clicked, setClicked] = useState(0);
  console.log(clicked, 'clicked');
  const defaultValues = {
    sender: user?.patient?._id,
    patient: row?._id,
    title: `${user?.patient?.name_english} want to add you as a family member`,
    title_arabic: `${user?.patient?.name_arabic} يريد اظافتك كفرد عائلة`,
    photo_URL: 'https://cdn-icons-png.flaticon.com/512/6193/6193226.png',
    category: 'invite',
    type: 'invite',
  };

  const handleAddFamily = async () => {
    // const { enqueueSnackbar } = useSnackbar();

    try {
      await axios.post(`${endpoints.notifications.all}/invite`, defaultValues);
      setClicked((prevClicked) => prevClicked + 1);
      enqueueSnackbar(t('An invitation to join the family has been sent successfully'));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
  };

  const renderPrimary = (
    <TableRow selected={selected}>
      <TableCell align="center">{identification_num}</TableCell>
      <TableCell align="center">{name_english}</TableCell>
      <TableCell align="center">{name_arabic}</TableCell>

      {/* <TableCell align="center">{mobile_num1}</TableCell> */}
      <TableCell align="center">
        {clicked > 0 ? (
          <Button disabled variant="outlined">
            {t('Waiting acceptation')} &nbsp;{' '}
            <Iconify
              sx={{ display: { md: 'block', xs: 'none' }, color: 'info.main' }}
              icon="eos-icons:loading"
            />
          </Button>
        ) : (
          <Button variant="outlined" onClick={() => handleAddFamily()}>
            {t('Request To Add')} &nbsp;{' '}
            <Iconify
              sx={{ mb: '5px', display: { md: 'block', xs: 'none' } }}
              icon="icon-park:add-user"
            />
          </Button>
        )}
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
          md: '300%',
          lg: '300%',
          xl: '300%',
        },
      }}
    />
  );
  // return <> {renderPrimary} </>
}

ExistPatientRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
