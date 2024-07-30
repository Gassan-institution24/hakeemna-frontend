import * as XLSX from 'xlsx';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Table,
  // Select,
  Checkbox,
  // MenuItem,
  TableRow,
  TableBody,
  TableCell,
  TextField,
  // Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

// import { useGetCountries } from 'src/api';

import { Upload } from 'src/components/upload';
import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import {
  useTable,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { label: 'name english *', width: 'calc(100%/4)' },
  { label: 'name arabic *', width: 'calc(100%/4)' },
  { label: 'description english', width: 'calc(100%/4)' },
  { label: 'description arabic', width: 'calc(100%/4)' },
];
export default function NewEditManyForm() {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  // const { countriesData } = useGetCountries(); /// edit

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

  // const handleSelect = (index, event) => {
  //   setData((prev) => {
  //     const updated = [...prev];
  //     updated[index] = { ...updated[index], [event.target.name]: event.target.value };
  //     return updated;
  //   });
  // };

  // const handleSelectMany = (event) => {
  //   setData((prev) => {
  //     const updated = [...prev];
  //
  //     table.selected.forEach((item) => {
  //       updated[item] = { ...updated[item], [event.target.name]: event.target.value };
  //     });
  //
  //     return updated;
  //   });
  // };

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
      const uploadRec = await axiosInstance.post(endpoints.upload_records.all, {
        type: 'symptoms',
        mustUpload: data.length,
      });
      const insertedData = await axiosInstance.post(
        endpoints.symptoms.many,
        data.map((one) => ({ ...one, upload_record: uploadRec.data._id }))
      );
      await axiosInstance.patch(endpoints.upload_records.one(uploadRec.data._id), {
        uploaded: insertedData.data,
      });
      router.push(paths.superadmin.tables.symptoms.root); /// edit
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
                // action={
                //   <>
                //     <Typography sx={{ fontSize: 14, fontWeight: 600, pr: 1 }}>Country:</Typography>
                //     <Select
                //       variant="filled"
                //       sx={{ width: '20%', border: '1px solid gray' }}
                //       size="small"
                //       name="country"
                //       label="country"
                //       onChange={handleSelectMany}
                //     >
                //       {countriesData.map((country, idx)  => (
                //         <MenuItem lang="ar"  key={idx} value={country._id}>
                //           {country.name_english}
                //         </MenuItem>
                //       ))}
                //     </Select>
                //   </>
                // }
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
                    {data
                      .slice(
                        table.page * table.rowsPerPage,
                        table.page * table.rowsPerPage + table.rowsPerPage
                      )
                      .map((one, index, idx) => (
                        <TableRow key={idx} hover selected={table.selected.includes(index)}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={table.selected.includes(index)}
                              onClick={() => table.onSelectRow(index)}
                            />
                          </TableCell>

                          {/* <TableCell align="center">
                          <Select
                            variant="filled"
                            required
                            value={one.country || ''}
                            onChange={(e) => handleSelect(index, e)}
                            sx={{ width: '80%' }}
                            size="small"
                            name="country"
                          >
                            {countriesData.map((country, idx)  => (
                              <MenuItem lang="ar"  key={idx} value={country._id}>
                                {country.name_english}
                              </MenuItem>
                            ))}
                            </Select>
                          </TableCell> */}

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
                <TablePaginationCustom
                  count={data.length}
                  page={table.page}
                  rowsPerPage={table.rowsPerPage}
                  onPageChange={table.onChangePage}
                  onRowsPerPageChange={table.onChangeRowsPerPage}
                  //
                  dense={table.dense}
                  onChangeDense={table.onChangeDense}
                />
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
