import * as XLSX from 'xlsx';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Table,
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
  // { label: 'code', width: 'calc(100%/14)' },
  { label: 'unit_service_type', width: 'calc(100%/14)' },
  { label: 'country', width: 'calc(100%/14)' },
  { label: 'city', width: 'calc(100%/14)' },
  { label: 'sector', width: 'calc(100%/14)' },
  { label: 'commercial_name', width: 'calc(100%/14)' },
  { label: 'province', width: 'calc(100%/14)' },
  { label: 'address', width: 'calc(100%/14)' },
  { label: 'phone_number_1', width: 'calc(100%/14)' },
  { label: 'Phone_number_2', width: 'calc(100%/14)' },
  { label: 'work_shift', width: 'calc(100%/14)' },
  { label: 'constitution_objective', width: 'calc(100%/14)' },
  { label: 'type_of_specialty_1', width: 'calc(100%/14)' },
  { label: 'type_of_specialty_2', width: 'calc(100%/14)' },
  { label: 'info', width: 'calc(100%/14)' },
  { label: 'email', width: 'calc(100%/14)' },
  { label: 'insurance', width: 'calc(100%/14)' },
  { label: 'subscribe to', width: 'calc(100%/14)' },
  { label: 'social network', width: 'calc(100%/14)' },
  { label: 'notes', width: 'calc(100%/14)' },
  { label: 'communication', width: 'calc(100%/14)' },
];
export default function NewEditManyForm() {
  const router = useRouter();

  const table = useTable({ defaultOrderBy: 'code' });

  // const { countriesData } = useGetCountries(); /// edit

  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  // const handleArabicInputChange = (index, event) => {
  //   const arabicRegex = /^[\u0600-\u06FF0-9\s!@#$%^&*_\-()]*$/;

  //   if (arabicRegex.test(event.target.value)) {
  //     setData((prev) => {
  //       const updated = [...prev];
  //       updated[index] = { ...updated[index], [event.target.name]: event.target.value };
  //       return updated;
  //     });
  //   }
  // };

  const handleEnglishInputChange = useCallback((index, event) => {
    // const englishRegex = /^[a-zA-Z0-9\s,@#$!*_\-&^%.()]*$/;

    // if (englishRegex.test(event.target.value)) {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [event.target.name]: event.target.value };
      return updated;
    });
    // }
  }, []);

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
    // setExcelFile(file)
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const results = e.target.result;
        const workbook = XLSX.read(results, { type: 'binary' });

        const workSheets = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json(workSheets);
        const chunkSize = 10; // You can adjust this value based on performance testing
        // const chunks = [];

        for (let i = 0; i < jsonData.length; i += chunkSize) {
          setData((prev) => [...prev, ...jsonData.slice(i, i + chunkSize)]);
        }

        // Process each chunk asynchronously
        // setData(jsonData.slice(0, 5));
      };
      reader.readAsBinaryString(file);
    }
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const uploadRec = await axiosInstance.post(endpoints.upload_records.all, {
        type: 'companies',
        mustUpload: data.length,
      });
      const chunkSize = 50;
      const totalChunks = Math.ceil(data.length / chunkSize);

      const promises = Array.from({ length: totalChunks }, (_, index) => {
        const startIndex = index * chunkSize;
        const endIndex = Math.min(startIndex + chunkSize, data.length);
        const chunkData = data.slice(startIndex, endIndex);

        const insertedDataPromise = axiosInstance.post(
          endpoints.companies.many,
          chunkData.map((one) => ({ ...one, upload_record: uploadRec.data._id }))
        );
        return insertedDataPromise.then((insertedData) =>
          axiosInstance.patch(endpoints.upload_records.one(uploadRec.data._id), {
            uploaded: insertedData.data,
          })
        );
      });

      await Promise.all(promises);

      router.push(paths.superadmin.tables.companies.root);
    } catch (e) {
      enqueueSnackbar(e, { variant: 'error' });
    }
  };

  return (
    // <Grid container spacing={3}>
    <Grid xs={12} maxWidth="xl">
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
              // onSelectAllRows={(checked) =>
              //   table.onSelectAllRows(
              //     checked,
              //     data.map((row, index, idx) => index)
              //   )
              // }
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
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     data.map((row, index, idx) => index)
                //   )
                // }
                />

                <TableBody>
                  {data
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((one, index, idx) => (
                      <TableRow key={idx} hover selected={table.selected.includes(index)}>
                        {/* <TableCell padding="checkbox">
                          <Checkbox
                            checked={table.selected.includes(index)}
                            onClick={() => table.onSelectRow(index)}
                          />
                        </TableCell> */}

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
                            value={one.unit_service_type}
                            name="unit_service_type"
                          />
                          {/* {one.unit_service_type} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.country}
                            name="country"
                          />
                          {/* {one.country} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.city}
                            name="city"
                          />
                          {/* {one.city} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.sector}
                            name="sector"
                          />
                          {/* {one.sector} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.commercial_name}
                            name="commercial_name"
                          />
                          {/* {one.commercial_name} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.province}
                            name="province"
                          />
                          {/* {one.province} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.address}
                            name="address"
                          />
                          {/* {one.address} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.phone_number_1}
                            name="phone_number_1"
                          />
                          {/* {one.phone_number_1} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.Phone_number_2}
                            name="Phone_number_2"
                          />
                          {/* {one.Phone_number_2} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.work_shift}
                            name="work_shift"
                          />
                          {/* {one.work_shift} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.constitution_objective}
                            name="constitution_objective"
                          />
                          {/* {one.constitution_objective} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.type_of_specialty_1}
                            name="type_of_specialty_1"
                          />
                          {/* {one.type_of_specialty_1} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.type_of_specialty_2}
                            name="type_of_specialty_2"
                          />
                          {/* {one.type_of_specialty_2} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.info}
                            name="info"
                          />
                          {/* {one.info} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.email}
                            name="email"
                          />
                          {/* {one.email} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.insurance}
                            name="insurance"
                          />
                          {/* {one.insurance} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.subscribe_to}
                            name="subscribe_to"
                          />
                          {/* {one.subscribe_to} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.social_network}
                            name="social_network"
                          />
                          {/* {one.subscribe_to} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.notes}
                            name="notes"
                          />
                          {/* {one.subscribe_to} */}
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            variant="filled"
                            onChange={(e) => handleEnglishInputChange(index, e)}
                            value={one.communication}
                            name="communication"
                          />
                          {/* {one.communication} */}
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
            <LoadingButton
              onClick={handleCreate}
              tabIndex={-1}
              loading={loading}
              variant="contained"
            >
              Create All
            </LoadingButton>
          </Stack>
        )}
      </Card>
      {/* </Grid> */}
    </Grid>
  );
}
