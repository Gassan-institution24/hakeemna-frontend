import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import { Stack } from '@mui/material';
import Table from '@mui/material/Table';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import ExistEmployeesRow from './old-patients-row';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function UploadedOldPatients({ reset, selected, oldPatients }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'name_english', label: t('name in english') },
    { id: 'name_arabic', label: t('name in arabic') },
    { id: 'mobile_num1', label: t('mobile number') },
    { id: 'mobile_num2', label: t('alternative mobile number') },
    { id: 'email', label: t('email') },
    { id: 'identification_num', label: t('ID number') },
    { id: 'nationality', label: t('nationality') },
    { id: 'birth_date', label: t('birth date') },
    { id: 'book', width: 88 },
    // { id: 'files', label: t('files number') },
    // { id: '', width: 88 },
  ];

  const router = useRouter();

  const { enqueueSnackbar } = useSnackbar();

  const table = useTable({ defaultRowsPerPage: 10 });

  const theme = useTheme();

  const handleEmployment = async (row) => {
    try {
      await axiosInstance.patch(endpoints.appointments.book(selected), {
        patient: row._id,
      });
      enqueueSnackbar(t('booked successfully!'));
      reset();
      router.back();
    } catch (error) {
      // error emitted in backend
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
  };
  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    // selected,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = table;
  return (
    <Stack>
      <Table
        size={dense ? 'small' : 'medium'}
        sx={{
          minWidth: 960,
          borderCollapse: 'separate',
          borderSpacing: '0 16px',
        }}
      >
        <TableHeadCustom
          order={order}
          orderBy={orderBy}
          headLabel={TABLE_HEAD}
          //   rowCount={tableData.length}
          // numSelected={selected.length}
          onSort={onSort}
          sx={{
            [`& .${tableCellClasses.head}`]: {
              '&:first-of-type': {
                borderTopLeftRadius: 12,
                borderBottomLeftRadius: 12,
              },
              '&:last-of-type': {
                borderTopRightRadius: 12,
                borderBottomRightRadius: 12,
              },
            },
          }}
        />

        <TableBody>
          {oldPatients
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index, idx) => (
              <ExistEmployeesRow
                key={idx}
                row={row}
                onEmploymentRow={() => handleEmployment(row)}
              />
            ))}

          <TableNoData
            notFound={oldPatients.length === 0}
            sx={{
              m: -2,
              borderRadius: 1.5,
              border: `dashed 1px ${theme.palette.divider}`,
            }}
          />
        </TableBody>
      </Table>
      <TablePaginationCustom
        count={oldPatients.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onChangePage}
        onRowsPerPageChange={onChangeRowsPerPage}
        //
        dense={dense}
        onChangeDense={onChangeDense}
        sx={{
          [`& .${tablePaginationClasses.toolbar}`]: {
            borderTopColor: 'transparent',
          },
        }}
      />
    </Stack>
  );
}
UploadedOldPatients.propTypes = {
  oldPatients: PropTypes.array,
  reset: PropTypes.func,
  selected: PropTypes.string,
};
