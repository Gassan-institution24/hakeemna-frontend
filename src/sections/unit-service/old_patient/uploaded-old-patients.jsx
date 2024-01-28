import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import IconButton from '@mui/material/IconButton';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { MenuItem, TextField } from '@mui/material';
import Table from '@mui/material/Table';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import Iconify from 'src/components/iconify';
import axiosHandler from 'src/utils/axios-handler';

import {
  emptyRows,
  TableNoData,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { useAuthContext } from 'src/auth/hooks';
import { useBoolean } from 'src/hooks/use-boolean';
import { Upload, UploadBox } from 'src/components/upload';
import { useSettingsContext } from 'src/components/settings';

import { useGetCountries, useGetEmployeeTypes, useGetSpecialties } from 'src/api/tables';
import axios, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField, RHFUploadBox } from 'src/components/hook-form';

import ExistEmployeesRow from './exist-employees-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'code', label: 'Code' },
  { id: 'name', label: 'Name' },
  { id: 'identification_num', label: 'ID number' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'birth_date', label: 'Birth date' },
  { id: '', width: 88 },
];

// ----------------------------------------------------------------------

export default function TableNewEditForm() {
  const router = useRouter();

  const table = useTable({ defaultRowsPerPage: 10 });

  const settings = useSettingsContext();

  const { user } = useAuthContext();

  const [results, setResults] = useState([]);
  const [filters, setFilters] = useState({});

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const {
    dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    //
    selected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = table;
  return (
    <>
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
          numSelected={selected.length}
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
          {results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
            <ExistEmployeesRow
              key={row.id}
              row={row}
              // onEmploymentRow={() => handleEmployment(row._id)}
            />
          ))}

          <TableNoData
            notFound={results.length === 0}
            sx={{
              m: -2,
              borderRadius: 1.5,
              border: `dashed 1px ${theme.palette.divider}`,
            }}
          />
        </TableBody>
      </Table>
      <TablePaginationCustom
        count={results.length}
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
    </>
  );
}
