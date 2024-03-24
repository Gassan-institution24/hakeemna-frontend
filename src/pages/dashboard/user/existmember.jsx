
import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import { tableCellClasses } from '@mui/material/TableCell';

// import socket from 'src/socket';
import {  useFindPatients } from 'src/api';
import {  useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import { useSnackbar } from 'src/components/snackbar';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
} from 'src/components/table';

import ExistPatientRow from './exist-patient-row'; 

// ----------------------------------------------------------------------

export default function Exist() {

  const { t } = useTranslate();
  // const { currentLang } = useLocales();
  // const curLangAr = currentLang.value === 'ar';

  const TABLE_HEAD = [
    // { id: 'name', label: t('name') },
    { id: 'identification_num', label: t('ID number') },
    { id: 'first_name', label: t('First Name') },
    // { id: 'name_arabic', label: t('Name Arabic') },
    { id: 'mobile_num1', label: t('Phone') },
  ];

  const { user } = useAuthContext();

  const table = useTable({ defaultRowsPerPage: 10 });

  const patientID = user?.patient?._id;

  const [filters, setFilters] = useState({});

  const theme = useTheme();

  const { enqueueSnackbar } = useSnackbar();

  const {
    page,
    rowsPerPage,
    //
    selected,
    //
    onSort,
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

  // const handleEmployment = async (row) => {
  //   try {
  //     await axios.post(endpoints.employee_engagements.all, {
  //       patient: patientID,
  //       employee: row._id,
  //     });
  //     // socket.emit('created', {
  //     //   user,
  //     //   link: paths.unitservice.employees.root,
  //     //   msg: `created an employee <strong>${row.first_name}</strong>`,
  //     // });
  //     enqueueSnackbar(t('employment successfully!'));
  //   } catch (error) {
  //     // error emitted in backend
  //     enqueueSnackbar(curLangAr ? error.arabic_message : error.message, { variant: 'error' });
  //     console.error(error);
  //   }
  // };
  const { existPatient } = useFindPatients({
    identification_num: filters.identification_num || null,
    phone: filters.identification_num,
    first_name: filters.first_name,
    // name_arabic: filters.name_arabic,
  });

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
            onChange={handleEnglishInputChange}
            name="identification_num"
            label={t('ID number')}
          />
  
          <TextField
            onChange={handleEnglishInputChange}
            name="mobile_num1"
            label={t('phone')}
            type="number"
          />
          <TextField
            lang="en"
            onChange={handleEnglishInputChange}
            name="first_name"
            label={t('name in English')}
          />
          {/* <TextField
            lang="en"
            onChange={handleArabicInputChange}
            name="name_arabic"
            label={t('name in Arabic')}
          /> */}
        </Box>
      </Card>

      <Table
        sx={{
          minWidth: 960,
          borderCollapse: 'separate',
          borderSpacing: '0 16px',
        }}
      >
        <TableHeadCustom
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
          {existPatient
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, idx) => (
              <ExistPatientRow
                key={idx}
                row={row}
                // onEmploymentRow={() => handleEmployment(row)}
              />
            ))}

          <TableNoData
            notFound={existPatient.length === 0}
            sx={{
              m: -2,
              borderRadius: 1.5,
              border: `dashed 1px ${theme.palette.divider}`,
            }}
          />
        </TableBody>
      </Table>
     
    </Box>
  )
      
    
 
}
