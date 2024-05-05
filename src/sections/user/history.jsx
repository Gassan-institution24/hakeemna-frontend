// import React, { useState } from 'react';
// import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import Table from '@mui/material/Table';
import { Container } from '@mui/system';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import { Card, Divider, TableBody, CardHeader, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fMonth } from 'src/utils/format-time';
import axios, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useGetHistoryData } from 'src/api/history';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

export default function HistoryHead() {
  const { historyData, refetch } = useGetHistoryData();
  const { t } = useTranslate();
  const router = useRouter();

  const { user } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const deletehistoryfeild = async (id) => {
    try {
      await axios.patch(endpoints.history.one(id));

      refetch();
      enqueueSnackbar('Deleted successfully', { variant: 'success' });
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(
        curLangAr ? `${error.arabic_message}` || `${error.message}` : `${error.message}`,
        {
          variant: 'error',
        }
      );
    }
  };
  const handleView = async (id) => {
    console.log(id);
    router.push(paths.dashboard.user.historyinfo(id));
  };

  return (
    <Container sx={{ backgroundImage: 'linear-gradient(to bottom, #2788EF, white)', p: 2 }}>
      <Card sx={{ borderRadius: 0 }}>
        {curLangAr ? (
          <CardHeader sx={{ mb: 4 }} title={`سجل ${user?.patient?.name_arabic}`} />
        ) : (
          <CardHeader sx={{ mb: 4 }} title={`${user?.patient?.name_english} ${t('History')}`} />
        )}

        {historyData?.map((data, i) => (
          <>
            {data?.status === 'active' ? (
              <TableContainer key={i} sx={{ mt: 3, mb: 2 }}>
                <Scrollbar>
                  <Table sx={{ minWidth: 400 }}>
                    <TableHead>
                      <TableRow>
                        <TableCell>{t('Date')}</TableCell>
                        <TableCell>{t('Subject')}</TableCell>
                        <TableCell>{t('Info')}</TableCell>
                        <TableCell>
                          {curLangAr ? (
                            <Iconify sx={{ color: '#2788EF' }} icon="icon-park-outline:left" />
                          ) : (
                            <Iconify sx={{ color: '#2788EF' }} icon="mingcute:right-fill" />
                          )}
                        </TableCell>
                        <TableCell align="center">{t('Actions')}</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      <TableRow>
                        <TableCell>{fMonth(data?.created_at)}</TableCell>
                        <TableCell>{curLangAr ? data?.name_arabic : data?.name_english}</TableCell>
                        <TableCell>{curLangAr ? data?.sub_arabic : data?.sub_english}</TableCell>

                        <TableCell>
                          {' '}
                          {curLangAr ? (
                            <Iconify sx={{ color: '#2788EF' }} icon="icon-park-outline:left" />
                          ) : (
                            <Iconify sx={{ color: '#2788EF' }} icon="mingcute:right-fill" />
                          )}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton   onClick={() => handleView(data?._id)}>
                            <Iconify
                              sx={{ cursor: 'pointer', color: '#2788EF' }}
                              icon="carbon:view"
                            />
                          </IconButton>
                          <IconButton onClick={() => deletehistoryfeild(data?._id)}>
                            <Iconify
                              sx={{ cursor: 'pointer', color: 'error.main' }}
                              icon="solar:trash-bin-trash-bold"
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Scrollbar>
              </TableContainer>
            ) : (
              ''
            )}

            <Divider />
          </>
        ))}
      </Card>
    </Container>
  );
}
