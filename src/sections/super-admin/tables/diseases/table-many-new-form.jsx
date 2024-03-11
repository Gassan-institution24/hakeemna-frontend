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
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetSymptoms, useGetCategories } from 'src/api';

import { Upload } from 'src/components/upload';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useTable, TableHeadCustom, TableSelectedAction } from 'src/components/table';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { label: 'name english *', width: 'calc(100%/6)' },
  { label: 'name arabic *', width: 'calc(100%/6)' },
  { label: 'category *', width: 'calc(100%/6)' },
  { label: 'symptoms *', width: 'calc(100%/6)' },
  { label: 'description english', width: 'calc(100%/6)' },
  { label: 'description arabic', width: 'calc(100%/6)' },
];
export default function NewEditManyForm() {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  const { categories } = useGetCategories(); /// edit
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

  console.log(data);
  const handleCreate = async () => {
    const isFormValid = data.every(
      (one) => one.name_english && one.name_arabic && one.category && one.symptoms.length
    );

    if (!isFormValid) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      await axiosInstance.post(endpoints.diseases.many, data);
      router.push(paths.superadmin.tables.diseases.root); /// edit
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
                <Typography sx={{ fontSize: 14, fontWeight: 600, pr: 1 }}>Category:</Typography>
                <Select
                  variant="filled"
                  sx={{ width: '20%', border: '1px solid gray' }}
                  size="small"
                  name="category"
                  // label="category"
                  onChange={handleSelectMany}
                >
                  {categories.map((category, idx) => (
                    <MenuItem key={idx} value={category._id}>
                      {category.name_english}
                    </MenuItem>
                  ))}
                </Select>
                <Typography sx={{ fontSize: 14, fontWeight: 600, pr: 1 }}>Symptoms:</Typography>
                <Select
                  many
                  variant="filled"
                  sx={{ width: '20%', border: '1px solid gray' }}
                  size="small"
                  name="symptoms"
                  // label="category"
                  onChange={handleSelectMany}
                >
                  {tableData.map((symptom, idx) => (
                    <MenuItem key={idx} value={symptom._id}>
                      {symptom.name_english}
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
                      <TextField
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleEnglishInputChange(index, e)}
                        value={one.name_english}
                        name="name_english"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleArabicInputChange(index, e)}
                        value={one.name_arabic}
                        name="name_arabic"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        variant="filled"
                        required
                        value={one.category || ''}
                        onChange={(e) => handleSelect(index, e)}
                        sx={{ width: '80%' }}
                        size="small"
                        name="category"
                      >
                        {categories.map((category, idx) => (
                          <MenuItem key={idx} value={category._id}>
                            {category.name_english}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell align="center">
                      <Select
                        multiple
                        variant="filled"
                        required
                        value={one.symptoms || []}
                        onChange={(e) => handleSelect(index, e)}
                        sx={{ width: '80%' }}
                        size="small"
                        name="symptoms"
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
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleEnglishInputChange(index, e)}
                        value={one.description}
                        name="description"
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        size="small"
                        variant="filled"
                        lang="ar"
                        onChange={(e) => handleArabicInputChange(index, e)}
                        value={one.description_arabic}
                        name="description_arabic"
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
