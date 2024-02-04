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
import { useLocales, useTranslate } from 'src/locales';
import { useSettingsContext } from 'src/components/settings';

import { useGetCountries, useGetEmployeeTypes, useGetSpecialties } from 'src/api/tables';
import axios, { endpoints } from 'src/utils/axios';

import { useSnackbar } from 'src/components/snackbar';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

import ExistEmployeesRow from './exist-employees-row';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function TableNewEditForm({ departmentData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'name', label: t('name') },
    { id: 'identification_num', label: t('ID number') },
    { id: 'email', label: t('email') },
    { id: 'phone', label: t('phone') },
    { id: 'birth_date', label: t('birth date') },
    { id: '', width: 88 },
  ];

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

  const handleEmployment = async (id) => {
    try {
      await axios.post(endpoints.tables.employeeEngagements, {
        unit_service:
          user?.employee.employee_engagements[user?.employee.selected_engagement]?.unit_service._id,
        department: departmentData._id,
        employee: id,
      });
      enqueueSnackbar(t('employment successfully!'));
    } catch (e) {
      console.log(e);
      enqueueSnackbar(t('failed to employment!'), { variant: 'error' });
    }
  };

  useEffect(() => {
    async function getExistEmployees() {
      if (Object.keys(filters).length) {
        const { data } = await axios.post(endpoints.tables.findEmployee, {
          unit_service:
            user?.employee.employee_engagements[user?.employee.selected_engagement]?.unit_service
              ._id,
          filters,
        });
        setResults(data);
      }
    }
    getExistEmployees();
  }, [filters, user?.employee]);
  console.log('results', results);
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
            onChange={(event) =>
              setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }))
            }
            type="email"
            name="email"
            label={t("email")}
          />
          <TextField
            onChange={handleEnglishInputChange}
            name="identification_num"
            label={t("ID number")}
          />
          <TextField
            onChange={handleEnglishInputChange}
            name="code"
            label={t("account code")}
            type="number"
          />
          <TextField onChange={handleEnglishInputChange} name="phone" label={t("phone")} type="number" />
          <TextField
            onChange={handleEnglishInputChange}
            name="profrssion_practice_num"
            label={t("profrssion practice number")}
          />
          <TextField
            lang="en"
            onChange={handleEnglishInputChange}
            name="first_name"
            label={t("first name")}
          />
          <TextField
            lang="en"
            onChange={handleEnglishInputChange}
            name="middle_name"
            label={t("middle name")}
          />
          <TextField
            lang="en"
            onChange={handleEnglishInputChange}
            name="family_name"
            label={t("family name")}
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
              onEmploymentRow={() => handleEmployment(row._id)}
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
    </Box>
  );
}
TableNewEditForm.propTypes = {
  departmentData: PropTypes.object,
};
