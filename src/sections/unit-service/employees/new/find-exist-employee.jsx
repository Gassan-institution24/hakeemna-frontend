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
import { useSettingsContext } from 'src/components/settings';

import { useGetCountries, useGetEmployeeTypes, useGetSpecialties } from 'src/api/tables';
import axios, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import ExistEmployeesRow from './exist-employees-row';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'size', label: 'Size', width: 120 },
  { id: 'type', label: 'Type', width: 120 },
  { id: 'modifiedAt', label: 'Modified', width: 140 },
  { id: 'shared', label: 'Shared', align: 'right', width: 140 },
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

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }
  };

  useEffect(() => {
    async function getExistEmployees() {
      if(Object.keys(filters).length){
          const { data } = await axios.post(endpoints.tables.findEmployee, filters);
          setResults(data);
      }
    }
    getExistEmployees();
  }, [filters]);
  console.log('results',results)
  return (
    <Box>
      <Card sx={{ p: 3 }}>
        <Box
          rowGap={3}
          columnGap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(4, 1fr)',
          }}
        >
          <TextField
            lang="en"
            onChange={handleEnglishInputChange}
            name="first_name"
            label="First name"
          />
          <TextField
            lang="en"
            onChange={handleEnglishInputChange}
            name="second_name"
            label="Second name"
          />
          <TextField
            lang="en"
            onChange={handleEnglishInputChange}
            name="family_name"
            label="Family name"
          />
          <TextField onChange={handleEnglishInputChange} name="email" label="Email" />
          <TextField onChange={handleEnglishInputChange} name="phone" label="Phone" type="number" />
          <TextField
            onChange={handleEnglishInputChange}
            name="code"
            label="account code"
            type="number"
          />
          <TextField
            onChange={handleEnglishInputChange}
            name="identification_num"
            label="identification_num"
          />
          <TextField
            onChange={handleEnglishInputChange}
            name="profrssion_practice_num"
            label="profrssion_practice_num code"
          />
        </Box>
      </Card>

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
              // selected={selected.includes(row.id)}
              // onSelectRow={() => onSelectRow(row.id)}
              // onDeleteRow={() => onDeleteRow(row.id)}
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
    </Box>
  );
}
