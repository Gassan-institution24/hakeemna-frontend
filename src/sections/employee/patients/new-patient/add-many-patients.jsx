import * as XLSX from 'xlsx';
import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Link,
  Table,
  Select,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  TextField,
  Typography,
  TableContainer,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetEmployeeActiveWorkGroups } from 'src/api';

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
  { label: 'name english', width: 'calc(100%/8)' },
  { label: 'name arabic', width: 'calc(100%/8)' },
  { label: 'mobile number', width: 'calc(100%/8)' },
  { label: 'email', width: 'calc(100%/8)' },
  { label: 'gender', width: 'calc(100%/8)' },
  { label: 'birth date', width: 'calc(100%/8)' },
  { label: 'marital status', width: 'calc(100%/8)' },
  { label: 'file code', width: 'calc(100%/8)' },
];
export default function NewEditManyForm() {
  const router = useRouter();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const table = useTable({ defaultOrderBy: 'code' });

  const { user } = useAuthContext();
  const employee = user?.employee?.employee_engagements?.[user.employee.selected_engagement];

  const { enqueueSnackbar } = useSnackbar();

  const [data, setData] = useState([]);
  const [work_group, setWorkGroup] = useState();
  const [loading, setLoading] = useState(false);

  const { workGroupsData } = useGetEmployeeActiveWorkGroups(employee?._id);

  const handleChange = useCallback((index, event) => {
    setData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [event.target.name]: event.target.value };
      return updated;
    });
  }, []);

  const handleDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const results = e.target.result;
        const workbook = XLSX.read(results, { type: 'binary' });

        const workSheets = workbook.Sheets[workbook.SheetNames[0]];

        const jsonData = XLSX.utils.sheet_to_json(workSheets);
        const chunkSize = 10;

        for (let i = 0; i < jsonData.length; i += chunkSize) {
          setData((prev) => [...prev, ...jsonData.slice(i, i + chunkSize)]);
        }
      };
      reader.readAsBinaryString(file);
    }
  }, []);

  const handleCreate = async () => {
    try {
      setLoading(true);
      const uploadRec = await axiosInstance.post(endpoints.upload_records.all, {
        type: 'unit_service_patient',
        mustUpload: data.length,
      });
      const chunkSize = 50;
      const totalChunks = Math.ceil(data.length / chunkSize);

      const promises = Array.from({ length: totalChunks }, (_, index) => {
        const startIndex = index * chunkSize;
        const endIndex = Math.min(startIndex + chunkSize, data.length);
        const chunkData = data.slice(startIndex, endIndex);

        const insertedDataPromise = axiosInstance.post(
          endpoints.usPatients.many,
          chunkData.map((one) => ({
            ...one,
            upload_record: uploadRec.data._id,
            unit_service: employee?.unit_service?._id,
            employee: employee?._id,
            work_group,
            birth_date: new Date(one?.birth_date),
          }))
        );
        return insertedDataPromise.then((insertedData) =>
          axiosInstance.patch(endpoints.upload_records.one(uploadRec.data._id), {
            uploaded: insertedData.data,
          })
        );
      });

      await Promise.all(promises);

      router.push(paths.employee.patients.all);
    } catch (e) {
      enqueueSnackbar(e, { variant: 'error' });
    }
  };

  return (
    <Grid xs={12} maxWidth="xl">
      <Card sx={{ p: 3 }}>
        <Box
          sx={{
            px: 5,
            pb: 2,
          }}
        >
          <Typography mb={1} variant="subtitle2">
            {t('work group')}:
          </Typography>
          <Select
            sx={{ minWidth: 200 }}
            name="work_group"
            error={!work_group}
            onChange={(e) => setWorkGroup(e.target.value)}
          >
            {workGroupsData?.map((one, idx) => (
              <MenuItem key={idx} value={one._id}>
                {curLangAr ? one?.name_arabic : one?.name_english}
              </MenuItem>
            ))}
          </Select>
          <Typography my={2} variant="subtitle2">
            {t('the uploaded file should be in this shap to be able to read')} -{' '}
            <Link href="/assets/patients.xlsx">{t('download')}</Link>
          </Typography>

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
              color="primary"
            />

            <Scrollbar>
              <Table size="medium">
                <TableHeadCustom
                  headLabel={TABLE_HEAD}
                  rowCount={data.length}
                  numSelected={table.selected.length}
                />

                <TableBody>
                  {data
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((one, index, idx) => (
                      <TableRow key={idx} hover selected={table.selected.includes(index)}>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            onChange={(e) => handleChange(index, e)}
                            value={one.name_english}
                            name="name_english"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            onChange={(e) => handleChange(index, e)}
                            value={one.name_arabic}
                            name="name_arabic"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            onChange={(e) => handleChange(index, e)}
                            value={one.mobile_num1}
                            name="mobile_num1"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            onChange={(e) => handleChange(index, e)}
                            value={one.email}
                            name="email"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            onChange={(e) => handleChange(index, e)}
                            value={one.gender}
                            name="gender"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            onChange={(e) => handleChange(index, e)}
                            value={one.birth_date}
                            name="birth_date"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            onChange={(e) => handleChange(index, e)}
                            value={one.marital_status}
                            name="marital_status"
                          />
                        </TableCell>
                        <TableCell align="center">
                          <TextField
                            size="small"
                            onChange={(e) => handleChange(index, e)}
                            value={one.file_code}
                            name="file_code"
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
            <LoadingButton
              onClick={handleCreate}
              tabIndex={-1}
              disabled={!work_group}
              loading={loading}
              variant="contained"
            >
              {t('create all')}
            </LoadingButton>
          </Stack>
        )}
      </Card>
      {/* </Grid> */}
    </Grid>
  );
}
