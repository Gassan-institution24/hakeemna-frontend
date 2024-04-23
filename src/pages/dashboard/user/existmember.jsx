import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { TextField } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';

import { useFindPatients } from 'src/api';
import { useTranslate } from 'src/locales';

import { useTable, TableNoData, TableHeadCustom } from 'src/components/table';

import ExistPatientRow from './exist-patient-row';

// ----------------------------------------------------------------------

export default function Exist() {
  const { t } = useTranslate();
  // const { user} = useAuthContext()
  const TABLE_HEAD = [
    { id: 'identification_num', label: t('ID number') },
    { id: 'name_english', label: t('Name in english') },
    { id: 'name_arabic', label: t('Name Arabic') },
    // { id: 'mobile_num1', label: t('Phone') },
    { id: 'options', label: t('options') },
  ];

  const table = useTable({ defaultRowsPerPage: 10 });

  const [filters, setFilters] = useState({});

  // const handlePhoneInputChange = (event) => {
  //   if (event.target.value) {
  //     setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  //   }
  // };

  const theme = useTheme();

  const { page, rowsPerPage, selected } = table;

  const handleArabicInputChange = (event) => {
    // Validate the input based on Arabic language rules
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-()]*$/; // Range for Arabic characters

    if (arabicRegex.test(event.target.value)) {
      setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }
  };

  const handleEnglishInputChange = (event) => {
    // Validate the input based on English language rules
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/; // Only allow letters and spaces

    if (englishRegex.test(event.target.value)) {
      setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
    }
  };

  const { existPatient } = useFindPatients({
    identification_num: filters.identification_num || null,
    // mobile_num1: filters.mobile_num1,
    name_english: filters.name_english,
    name_arabic: filters?.name_arabic,
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
            lang="en"
            onChange={handleEnglishInputChange}
            name="name_english"
            label={t('Name in english')}
          />
          <TextField
            lang="en"
            onChange={handleArabicInputChange}
            name="name_arabic"
            label={t('name in Arabic')}
          />
         {/* <TextField
          name="mobile_num1"
          label={t('phone')}
          onChange={handlePhoneInputChange}
          type='number'
        /> */}
        </Box>
      </Card>

      <Table
        sx={{
          borderCollapse: 'separate',
          borderSpacing: '0 16px',
        }}
      >
        <TableHeadCustom
          headLabel={TABLE_HEAD}
          //   rowCount={tableData.length}
          numSelected={selected.length}
        />

        <TableBody>
          {existPatient
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            ?.map((row, idx) => (
              <ExistPatientRow key={idx} row={row} />
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
  );
}
