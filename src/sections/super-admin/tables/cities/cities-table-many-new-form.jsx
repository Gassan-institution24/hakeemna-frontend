import * as XLSX from 'xlsx';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Table,
  Select,
  Checkbox,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetCountries } from 'src/api';

import { Upload } from 'src/components/upload';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useTable, TableHeadCustom, TableSelectedAction } from 'src/components/table';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { label: 'country', width: 'calc(100%/4)' },
  { label: 'name english', width: 'calc(100%/4)' },
  { label: 'name arabic', width: 'calc(100%/4)' },
  { label: 'state', width: 'calc(100%/4)' },
  // { id: '', width: 88 },
];
export default function CitiesNewEditForm() {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  const { countriesData } = useGetCountries();

  const { enqueueSnackbar } = useSnackbar();

  const [cities, setCities] = useState([]);

  const handleArabicInputChange = (index, event) => {
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/;

    if (arabicRegex.test(event.target.value)) {
      setCities((prevCities) => {
        const updatedCities = [...prevCities];
        updatedCities[index] = { ...updatedCities[index], [event.target.name]: event.target.value };
        return updatedCities;
      });
    }
  };

  const handleEnglishInputChange = (index, event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/;

    if (englishRegex.test(event.target.value)) {
      setCities((prevCities) => {
        const updatedCities = [...prevCities];
        updatedCities[index] = { ...updatedCities[index], [event.target.name]: event.target.value };
        return updatedCities;
      });
    }
  };
  const handleSelect = (index, event) => {
    setCities((prevCities) => {
      const updatedCities = [...prevCities];
      updatedCities[index] = { ...updatedCities[index], country: event.target.value };
      return updatedCities;
    });
  };
  const handleSelectMany = (event) => {
    setCities((prevCities) => {
      const updatedCities = [...prevCities];

      table.selected.forEach((item) => {
        updatedCities[item] = { ...updatedCities[item], country: event.target.value };
      });

      return updatedCities;
    });
  };

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        const workSheets = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json(workSheets);
        setCities(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  }, []);

  const handleCreate = async () => {
    try {
      await axiosInstance.post(endpoints.cities.many, cities);
      router.push(paths.superadmin.tables.cities.root);
    } catch (e) {
      enqueueSnackbar(e, { variant: 'error' });
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid xs={12} maxWidth="md">
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              px: 5,
              pb: 2,
            }}
          >
            <Upload
              name="excel"
              accept=".xlsx, .xls"
              label="upload excel"
              onDrop={(data) => handleDrop(data)}
            />
          </Box>
          {cities.length > 0 && (
            <TableContainer>
              <TableSelectedAction
                numSelected={table.selected.length}
                rowCount={cities.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    cities.map((row, index, idx) => index)
                  )
                }
                action={
                  <>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, pr: 1 }}>Country:</Typography>
                    <Select
                      variant="filled"
                      sx={{ width: '20%', border: '1px solid gray' }}
                      size="small"
                      name="country"
                      label="country"
                      onChange={handleSelectMany}
                    >
                      {countriesData.map((country, idx) => (
                        <MenuItem lang="ar" key={idx} value={country._id}>
                          {country.name_english}
                        </MenuItem>
                      ))}
                    </Select>
                  </>
                }
                color="primary"
              />

              <Scrollbar>
                <Table size="medium">
                  <TableHeadCustom
                    headLabel={TABLE_HEAD}
                    rowCount={cities.length}
                    numSelected={table.selected.length}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        cities.map((row, index) => index)
                      )
                    }
                  />

                  <TableBody>
                    {cities.map((city, index) => (
                      <TableRow key={index} hover selected={table.selected.includes(index)}>
                        <TableCell padding="checkbox">
                          <Checkbox
                            checked={table.selected.includes(index)}
                            onClick={() => table.onSelectRow(index)}
                          />
                        </TableCell>

                        <TableCell align="center">
                          <Select
                            variant="filled"
                            required
                            value={city.country || ''}
                            onChange={(e) => handleSelect(index, e)}
                            sx={{ width: '80%' }}
                            size="small"
                            name="country"
                          >
                            {countriesData.map((country, idx) => (
                              <MenuItem lang="ar" key={idx} value={country._id}>
                                {country.name_english}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>

                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={city.name_english}
                            name="name_english"
                          />
                        </TableCell>

                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleArabicInputChange(index, e)}
                            value={city.name_arabic}
                            name="name_arabic"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={city.state}
                            name="state"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          )}

          {cities.length > 0 && (
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton onClick={handleCreate} tabIndex={-1} variant="contained">
                Create All
              </LoadingButton>
            </Stack>
          )}
        </Card>
      </Grid>
    </Grid>
  );
}
