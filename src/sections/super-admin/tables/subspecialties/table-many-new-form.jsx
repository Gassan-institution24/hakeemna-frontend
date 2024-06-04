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

import { useGetSpecialties } from 'src/api';

import { Upload } from 'src/components/upload';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { useTable, TableHeadCustom, TableSelectedAction } from 'src/components/table';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { label: 'specialty *', width: 'calc(100%/5)' },
  { label: 'name english *', width: 'calc(100%/5)' },
  { label: 'name arabic *', width: 'calc(100%/5)' },
  { label: 'description english', width: 'calc(100%/5)' },
  { label: 'description arabic', width: 'calc(100%/5)' },
];
export default function NewEditManyForm() {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  const { specialtiesData } = useGetSpecialties(); /// edit

  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);

  const handleArabicInputChange = (index, event) => {
    const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-()]*$/;

    if (arabicRegex.test(event.target.value)) {
      setData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [event.target.name]: event.target.value };
        return updated;
      });
    }
  };

  const handleEnglishInputChange = (index, event) => {
    const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/;

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

      table.selected.forEach((item) => {
        updated[item] = { ...updated[item], [event.target.name]: event.target.value };
      });

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
    const isFormValid = data.every((one) => one.name_english && one.name_arabic && one.specialty);

    if (!isFormValid) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const uploadRec = await axiosInstance.post(endpoints.upload_records.all, {
        type: 'subspecialities',
        mustUpload: data.length,
      });
      const insertedData = await axiosInstance.post(
        endpoints.subspecialities.many,
        data.map((one) => ({ ...one, upload_record: uploadRec.data._id }))
      );
      await axiosInstance.patch(endpoints.upload_records.one(uploadRec.data._id), {
        uploaded: insertedData.data,
      });
      router.push(paths.superadmin.tables.subspecialities.root); /// edit
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
                    <Typography sx={{ fontSize: 14, fontWeight: 600, pr: 1 }}>
                      Specialty:
                    </Typography>
                    <Select
                      variant="filled"
                      sx={{ width: '20%', border: '1px solid gray' }}
                      size="small"
                      name="specialty"
                      // label="specialty"
                      onChange={handleSelectMany}
                    >
                      {specialtiesData.map((specialty, idx) => (
                        <MenuItem lang="ar" key={idx} value={specialty._id}>
                          {specialty.name_english}
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
                        data.map((row, index) => index)
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
                            value={one.specialty || ''}
                            onChange={(e) => handleSelect(index, e)}
                            sx={{ width: '80%' }}
                            size="small"
                            name="specialty"
                          >
                            {specialtiesData.map((specialty, idx) => (
                              <MenuItem lang="ar" key={idx} value={specialty._id}>
                                {specialty.name_english}
                              </MenuItem>
                            ))}
                          </Select>
                        </TableCell>

                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.name_english}
                            name="name_english"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleArabicInputChange(index, e)}
                            value={one.name_arabic}
                            name="name_arabic"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.description}
                            name="description"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
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
      </Grid>
    </Grid>
  );
}
