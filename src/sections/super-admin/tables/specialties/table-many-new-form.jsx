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

import Scrollbar from 'src/components/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
import { Upload, UploadAvatar } from 'src/components/upload';
import { useTable, TableHeadCustom, TableSelectedAction } from 'src/components/table';

// ----------------------------------------------------------------------
const TABLE_HEAD = [
  { label: 'name english *', width: 'calc(100%/5)' },
  { label: 'name arabic *', width: 'calc(100%/5)' },
  { label: 'description english', width: 'calc(100%/5)' },
  { label: 'description arabic', width: 'calc(100%/5)' },
  { label: 'photo', width: 'calc(100%/5)' },
];
export default function NewEditManyForm() {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  // const { countriesData } = useGetCountries(); /// edit

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
  //     console.log(' table.selected', table.selected);
  //     table.selected.forEach((item) => {
  //       updated[item] = { ...updated[item], [event.target.name]: event.target.value };
  //     });
  //     console.log('updated', updated);
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

  console.log(data);

  const handleDropImg = useCallback((name, acceptedFiles, index) => {
    const file = acceptedFiles[0];
    const newFile = Object.assign(file, {
      preview: URL.createObjectURL(file),
    });

    if (file) {
      setData((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [name]: newFile };
        return updated;
      });
    }
  }, []);

  const handleCreate = async () => {
    const isFormValid = data.every((one) => one.name_english && one.name_arabic);

    if (!isFormValid) {
      alert('Please fill in all required fields.');
      return;
    }
    const formDataArray = data.map((obj) => {
      if (obj.specialitiesimge) {
        const formData = new FormData();
        Object.keys(obj).forEach((key) => {
          console.log('key', key);
          console.log('obj[key]', obj[key]);
          formData.set(key, obj[key]);
        });
        return formData;
      }
      return obj;
    });

    console.log('formDataArray', formDataArray);
    try {
      await axiosInstance.post(endpoints.specialities.many, formDataArray);
      router.push(paths.superadmin.tables.specialities.root); /// edit
    } catch (e) {
      console.log(e);
      enqueueSnackbar(e, { variant: 'error' });
    }
  };

  return (
    <form onSubmit={handleCreate} encType="multipart/form-data">
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
                      data.map((row, index) => index)
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
                  //       {countriesData.map((country) => (
                  //         <MenuItem key={country._id} value={country._id}>
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
                            {countriesData.map((country) => (
                              <MenuItem key={country._id} value={country._id}>
                                {country.name_english}
                              </MenuItem>
                            ))}
                            </Select>
                          </TableCell> */}

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
                          <TableCell>
                            <UploadAvatar
                              sx={{
                                mx: 'auto',
                                width: 90,
                                height: 90,
                              }}
                              name="specialitiesimge"
                              file={one.specialitiesimge}
                              value={one.specialitiesimge}
                              onDrop={(acceptedFiles) =>
                                handleDropImg(`specialitiesimge`, acceptedFiles, index)
                              }
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
                <LoadingButton type="submit" tabIndex={-1} variant="contained">
                  Create All
                </LoadingButton>
              </Stack>
            )}
          </Card>
        </Grid>
      </Grid>
    </form>
  );
}
