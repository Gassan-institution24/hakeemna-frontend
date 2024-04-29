import { useState } from 'react';
import PropTypes from 'prop-types';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { Button, Dialog, MenuItem, DialogTitle, DialogActions, DialogContent } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import EmptyContent from 'src/components/empty-content/empty-content';
// import socket from 'src/socket';
// import { paths } from 'src/routes/paths';
import { useBoolean } from 'src/hooks/use-boolean';

import axios, { endpoints } from 'src/utils/axios';
import { useGetFamilyTypes } from 'src/api';

// ----------------------------------------------------------------------

export default function ExistPatientRow({ row, selected }) {
  const { identification_num, name_english, name_arabic } = row;
  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();
  const dialog = useBoolean(false);
  // const [RelativeRelation, setRelativeRelation] = useState();
  const { Family } = useGetFamilyTypes();
  const curLangAr = currentLang.value === 'ar';
  const { t } = useTranslate();
  const [clicked, setClicked] = useState(0);


  const renderIdentificationNum = (identificationNum) => {
    // Check if the identificationNum has at least 3 characters
    if (identificationNum.length >= 3) {
      const lastThreeChars = identificationNum.slice(-3); // Get the last 3 characters
      const firstChars = identificationNum.slice(0, -3); // Get all characters except the last 3
      const maskedChars = lastThreeChars.replace(/./g, '*'); // Replace each character with *

      return `${firstChars}${maskedChars}`;
    }
    // If the identificationNum has less than 3 characters, just return it as is
    return identificationNum;
  };
  const handleAddFamily = async (members) => {
    const defaultValues = {
      sender: user?.patient?._id,
      patient: row?._id,
      title: `${user?.patient?.name_english} want to add you as a family member`,
      title_arabic: `${user?.patient?.name_arabic} يريد اظافتك كفرد عائلة`,
      photo_URL: 'https://cdn-icons-png.flaticon.com/512/6193/6193226.png',
      category: 'invite',
      type: 'invite',
      members
    };
  
    try {
      await axios.post(`${endpoints.notifications.all}/invite`, defaultValues);
      setClicked((prevClicked) => prevClicked + 1);
      enqueueSnackbar(t('An invitation to join the family has been sent successfully'));
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
      console.error(error);
    }
  };

  const renderPrimary = (
    <>
      <Dialog open={dialog.value} onClose={dialog.onTrue}>
        <DialogTitle>{t('Select The Relative Relation')}</DialogTitle>
        <DialogActions sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
          {Family.map((members, i) => (
            <MenuItem
              key={i}
              onClick={() => handleAddFamily(members?._id)}
              sx={{ border: '#00A76F 1px solid', p: 1, m: 1 }}
              lang="ar"
            >
              {members?.name_english}
            </MenuItem>
          ))}
        </DialogActions>
        <DialogContent>
          <Button variant="contained" sx={{ mb: 2, float: 'right' }} onClick={dialog.onFalse}>
            {t('BACK')} &nbsp;
            <Iconify icon="lets-icons:back" />{' '}
          </Button>
        </DialogContent>
      </Dialog>
      <TableRow selected={selected}>
        <TableCell align="center">{renderIdentificationNum(identification_num)}</TableCell>
        <TableCell align="center">{name_english}</TableCell>
        <TableCell align="center">{name_arabic}</TableCell>

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
            <Button variant="outlined" onClick={dialog.onTrue}>
              {t('Request To Add')} &nbsp;{' '}
              <Iconify
                sx={{ mb: '5px', display: { md: 'block', xs: 'none' } }}
                icon="icon-park:add-user"
              />
            </Button>
          )}
        </TableCell>
      </TableRow>
    </>
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
