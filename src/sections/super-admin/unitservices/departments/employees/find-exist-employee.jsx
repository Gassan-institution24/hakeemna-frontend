import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import { tableCellClasses } from '@mui/material/TableCell';
import { tablePaginationClasses } from '@mui/material/TablePagination';

import { paths } from 'src/routes/paths';
import { useParams } from 'src/routes/hooks';

import axios, { endpoints } from 'src/utils/axios';

import socket from 'src/socket';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import { useSnackbar } from 'src/components/snackbar';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import ExistEmployeesRow from './exist-employees-row';

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function TableNewEditForm({ departmentData }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { id } = useParams();

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'name', label: t('name') },
    { id: 'identification_num', label: t('ID number') },
    { id: 'email', label: t('email') },
    { id: 'phone', label: t('phone') },
    { id: 'birth_date', label: t('birth date') },
    { id: '', width: 88 },
  ];

  const table = useTable({ defaultRowsPerPage: 10 });

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

  const handleEmployment = async (row) => {
    try {
      await axios.post(endpoints.employee_engagements.ones, {
        unit_service: id,
        department: departmentData._id,
        employee: row._id,
      });
      socket.emit('updated', {
        user,
        link: paths.superadmin.unitservices.departments.employees.root(id, departmentData._id),
        msg: `employed an employee <strong>[ ${row.name_english} ]</strong> in department <strong>${departmentData.name_english}</strong>`,
      });
      enqueueSnackbar(t('employment successfully!'));
    } catch (error) {
      socket.emit('error', { error, user, location: window.location.pathname });
      enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
      console.error(error);
    }
  };

  useEffect(() => {
    async function getExistEmployees() {
      if (Object.keys(filters).length) {
        const { data } = await axios.post(endpoints.employees.find, {
          unit_service: id,
          filters,
        });
        setResults(data);
      }
    }
    getExistEmployees();
  }, [filters, id]);
  // console.log('results', results);
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
            label={t('email')}
          />
          <TextField
            onChange={handleEnglishInputChange}
            name="identification_num"
            label={t('ID number')}
          />
          <TextField
            onChange={handleEnglishInputChange}
            name="code"
            label={t('account code')}
            type="number"
          />
          <TextField
            onChange={handleEnglishInputChange}
            name="phone"
            label={t('phone')}
            type="number"
          />
          <TextField
            onChange={handleEnglishInputChange}
            name="profrssion_practice_num"
            label={t('profrssion practice number')}
          />
          <TextField
            lang="en"
            onChange={handleEnglishInputChange}
            name="name_english"
            label={t('Full name in English')}
          />
          <TextField
            lang="en"
            onChange={handleArabicInputChange}
            name="name_arabic"
            label={t('Full name in Arabic')}
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
          {results.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, idx) => (
            <ExistEmployeesRow key={idx} row={row} onEmploymentRow={() => handleEmployment(row)} />
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
