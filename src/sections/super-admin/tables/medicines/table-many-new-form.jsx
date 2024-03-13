import * as XLSX from 'xlsx';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Chip,
  Table,
  Select,
  Checkbox,
  MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  Typography,
  Autocomplete,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetSymptoms, useGetCountries, useGetMedFamilies } from 'src/api';

import { Upload } from 'src/components/upload';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useTable, TableHeadCustom, TableSelectedAction } from 'src/components/table';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { label: 'country*', width: 'calc(100%/10)' },
  { label: 'family', width: 'calc(100%/10)' },
  { label: 'trade name*', width: 'calc(100%/10)' },
  { label: 'scientific name*', width: 'calc(100%/10)' },
  { label: 'concentrations*', width: 'calc(100%/10)' },
  { label: 'side effects', width: 'calc(100%/10)' },
  { label: 'price', width: 'calc(100%/10)' },
  { label: 'ATCCODE', width: 'calc(100%/10)' },
  { label: 'barcode', width: 'calc(100%/10)' },
  { label: 'packaging', width: 'calc(100%/10)' },
];
const DefaultDoses = ['5 mg', '10 mg', '50 mg'];
export default function NewEditManyForm() {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  const { countriesData } = useGetCountries(); /// edit
  const { families } = useGetMedFamilies(); /// edit
  const { tableData } = useGetSymptoms(); /// edit

  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);

  const handleArabicInputChange = (index, event) => {
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_-]*$/;

    if (arabicRegex.test(event.target.value)) {
      setData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [event.target.name]: event.target.value };
        return updated;
      });
    }
  };
  console.log(data);
  const handleEnglishInputChange = (index, event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%]*$/;

    if (englishRegex.test(event.target.value)) {
      setData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [event.target.name]: event.target.value };
        return updated;
      });
    }
  };

  const handleSelect = (index, event) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [event.target.name]: event.target.value };
      return updated;
    });
  };

  const handleSelectConcentrations = (index, event) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], concentrations: event };
      return updated;
    });
  };

  const handleSelectMany = (event) => {
    setData((prev) => {
      const updated = [...prev];
      console.log(' table.selected', table.selected);
      table.selected.forEach((item) => {
        updated[item] = { ...updated[item], [event.target.name]: event.target.value };
      });
      console.log('updated', updated);
      return updated;
    });
  };

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const results = e.target.result;
        const workbook = XLSX.read(results, { type: 'binary' });

        const workSheets = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json(workSheets);
        setData(jsonData);
      };
      reader.readAsBinaryString(file);
    }
  }, []);

  const handleCreate = async () => {
    const isFormValid = data.every((one) => one.name_english && one.name_arabic);

    if (!isFormValid) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      await axiosInstance.post(endpoints.analyses.many, data);
      router.push(paths.superadmin.tables.analysis.root); /// edit
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e, { variant: 'error' });
    }
  };

  return (
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
          onDrop={(info) => handleDrop(info)}
        />
      </Box>
      {data.length > 0 && (
        <TableContainer>
          <TableSelectedAction
            numSelected={table.selected.length}
            rowCount={data.length}
            onSelectAllRows={(checked) =>
              table.onSelectAllRows(
                checked,
                data.map((row, index, idx) => index)
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
                    <MenuItem key={idx} value={country._id}>
                      {country.name_english}
                    </MenuItem>
                  ))}
                </Select>
                <Typography sx={{ fontSize: 14, fontWeight: 600, pr: 1 }}>drug family:</Typography>
                <Select
                  variant="filled"
                  sx={{ width: '20%', border: '1px solid gray' }}
                  size="small"
                  name="family"
                  label="family"
                  onChange={handleSelectMany}
                >
                  {families.map((family, idx) => (
                    <MenuItem key={idx} value={family._id}>
                      {family.name_english}
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
                rowCount={data.length}
                numSelected={table.selected.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    data.map((row, index, idx) => index)
                  )
                }
              />

              <TableBody>
                {data.map((one, index) => (
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
                        value={one.country || ''}
                        onChange={(e) => handleSelect(index, e)}
                        sx={{ width: '100%' }}
                        size="small"
                        name="country"
                      >
                        {countriesData.map((country, idx) => (
                          <MenuItem key={idx} value={country._id}>
                            {country.name_english}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>

                    <TableCell align="center">
                      <Select
                        variant="filled"
                        required
                        value={one.family || ''}
                        onChange={(e) => handleSelect(index, e)}
                        sx={{ width: '100%' }}
                        size="small"
                        name="family"
                      >
                        {families.map((family, idx) => (
                          <MenuItem key={idx} value={family._id}>
                            {family.name_english}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>

                    <TableCell align="center">
                      <TextField
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleEnglishInputChange(index, e)}
                        value={one.trade_name}
                        name="trade_name"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleEnglishInputChange(index, e)}
                        value={one.scientific_name}
                        name="scientific_name"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Autocomplete
                        freeSolo
                        multiple
                        options={DefaultDoses.map((option, idx) => option)}
                        value={one.concentrations || []}
                        onChange={(e, newValue) => handleSelectConcentrations(index, newValue)}
                        renderInput={(params) => (
                          <TextField {...params} name="concentrations" variant="filled" />
                        )}
                        size="small"
                        name="concentrations"
                        renderTags={(value, getTagProps) =>
                          value.map((option, idx) => (
                            <Chip
                              {...getTagProps({ idx })}
                              key={idx}
                              label={option}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                          ))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        multiple
                        variant="filled"
                        required
                        value={one.side_effects || []}
                        onChange={(e) => handleSelect(index, e)}
                        sx={{ width: '100%' }}
                        size="small"
                        name="side_effects"
                        renderValue={(selected) => (
                          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                            {selected.map((value, idx) => {
                              const symptom = tableData.find((item) => item._id === value);
                              return (
                                <Chip
                                  key={idx}
                                  label={symptom.name_english}
                                  style={{ margin: 2 }}
                                />
                              );
                            })}
                          </div>
                        )}
                      >
                        {tableData.map((symptom, idx) => (
                          <MenuItem key={idx} value={symptom._id}>
                            {/* <Checkbox
                                  checked={one?.symptoms?.includes(symptom._id)}
                                  size="small"
                                  disableRipple
                                /> */}
                            {symptom.name_english}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleArabicInputChange(index, e)}
                        value={one.price}
                        name="price"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleArabicInputChange(index, e)}
                        value={one.ATCCODE}
                        name="ATCCODE"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleArabicInputChange(index, e)}
                        value={one.barcode}
                        name="barcode"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleArabicInputChange(index, e)}
                        value={one.packaging}
                        name="packaging"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>
      )}

      {data.length > 0 && (
        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
          <LoadingButton onClick={handleCreate} tabIndex={-1} variant="contained">
            Create All
          </LoadingButton>
        </Stack>
      )}
    </Card>
  );
}
