import isEqual from 'lodash/isEqual';
import { useSnackbar } from 'notistack';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Select from '@mui/material/Select';
import { ListItemText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useSearchParams } from 'src/routes/hooks';

import { useBoolean } from 'src/hooks/use-boolean';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetTrainings } from 'src/api';
import { useTranslate } from 'src/locales';

import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table';

import MobileRow from '../../mobile-row';
import TrainingRow from '../training-row';
import TrainingToolbar from '../training-toolbar';
import TrainingFiltersResult from '../training-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: '',
  // category: '',
};

// ----------------------------------------------------------------------

export default function TrainingsView() {
  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'full_name', label: t('name') },
    { id: 'topic', label: t('topic') },
    { id: 'email', label: t('email') },
    { id: 'mobile_num1', label: t('mobile number') },
    { id: 'status', label: t('status') },
    { id: '' },
  ];

  const { enqueueSnackbar } = useSnackbar();

  const searchParams = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  const search = searchParams.get('name');

  const table = useTable({ defaultOrderBy: 'code' });

  const addModal = useBoolean();

  const [filters, setFilters] = useState(defaultFilters);

  const { trainingData, length, refetch } = useGetTrainings({
    page: table.page || 0,
    sortBy: table.orderBy || 'code',
    rowsPerPage: table.rowsPerPage || 10,
    order: table.order || 'asc',
    populate: 'stakeholder',
    ...filters,
  });

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const dataFiltered = trainingData;

  const canReset = !isEqual(filters, defaultFilters);

  const notFound = (!dataFiltered?.length && canReset) || !dataFiltered?.length;

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleChangeStatus = useCallback(
    async (id, status) => {
      try {
        await axiosInstance.patch(endpoints.training.one(id), { status });
        enqueueSnackbar('changed successfully');
        refetch();
      } catch (e) {
        enqueueSnackbar(e.message, { variant: 'error' });
      }
    },
    [enqueueSnackbar, refetch]
  );

  useEffect(() => {
    if (search) {
      setFilters((prev) => ({ ...prev, name: search }));
    }
  }, [search]);

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('training')}
        links={[{ name: t('dashboard'), href: paths.dashboard.root }, { name: t('training') }]}
        // action={
        //   <Button
        //     component={RouterLink}
        //     href={paths.stakeholder.products.new}
        //     variant="contained"
        //     startIcon={<Iconify icon="mingcute:add-line" />}
        //   >
        //     {t('new product')}
        //   </Button>
        // }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <TrainingToolbar
          filters={filters}
          onFilters={handleFilters}
          onAdd={() => addModal.onTrue()}
          //
          dateError={dateError}
        />

        {canReset && (
          <TrainingFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={dataFiltered?.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        {isMobile ? (
          <>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <MobileRow
                  key={row?._id}
                  title={row?.full_name}
                  fields={[
                    {
                      label: 'Code',
                      value: row?.code,
                    },
                    {
                      label: 'Topic',
                      value: row?.topic,
                    },
                    { label: 'Email', value: row?.email },
                    { label: 'Mobile Number', value: row?.mobile_num1 },
                    {
                      label: 'Status',
                      value: (
                        <Select
                          size="small"
                          fullWidth
                          value={row.status}
                          onChange={(e) => handleChangeStatus(row._id, e.target.value)}
                          MenuProps={{
                            PaperProps: { sx: { maxHeight: 240 } },
                          }}
                          sx={{
                            backgroundColor:
                              (row.status === 'underreview' && 'warning.lighter') ||
                              (row.status === 'accepted' && 'info.lighter') ||
                              (row.status === 'processing' && 'secondary.lighter') ||
                              (row.status === 'finished' && 'success.lighter') ||
                              (row.status === 'rejected' && 'error.lighter') ||
                              'transparent',
                            color:
                              (row.status === 'underreview' && 'warning.dark') ||
                              (row.status === 'accepted' && 'info.dark') ||
                              (row.status === 'processing' && 'secondary.dark') ||
                              (row.status === 'finished' && 'success.dark') ||
                              (row.status === 'rejected' && 'error.dark') ||
                              'inherit',
                          }}
                        >
                          <MenuItem sx={{ color: 'warning.dark' }} value="underreview">
                            {t('underreview')}
                          </MenuItem>
                          <MenuItem sx={{ color: 'info.dark' }} value="accepted">
                            {t('accepted')}
                          </MenuItem>
                          <MenuItem sx={{ color: 'secondary.dark' }} value="processing">
                            {t('processing')}
                          </MenuItem>
                          <MenuItem sx={{ color: 'success.dark' }} value="finished">
                            {t('finished')}
                          </MenuItem>
                          <MenuItem sx={{ color: 'error.dark' }} value="rejected">
                            {t('rejected')}
                          </MenuItem>
                        </Select>
                      ),
                    },
                  ]}
                  actions={[
                    {
                      label: 'DDL',
                      icon: 'carbon:data-quality-definition',
                      onClick: (event) => {
                        setDdlRow(row);
                        setDdlAnchorEl(event.currentTarget);
                      },
                    },
                  ]}
                />
              ))}
          </>
        ) : (
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={length}
                  numSelected={table.selected.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {dataFiltered?.map((row, idx) => (
                    <TrainingRow
                      refetch={refetch}
                      key={idx}
                      row={row}
                      selected={table.selected.includes(row._id)}
                      onSelectRow={() => table.onSelectRow(row._id)}
                      onChangeStatus={handleChangeStatus}
                    />
                  ))}

                  <TableNoData notFound={notFound} />
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}
        <CustomPopover
          open={ddlOpen}
          onClose={() => setDdlAnchorEl(null)}
          anchorEl={ddlAnchorEl}
          arrow="right-top"
          sx={{
            padding: 2,
            fontSize: '14px',
            minWidth: 260,
          }}
        >
          {ddlRow && (
            <>
              <Box sx={{ fontWeight: 600 }}>{t('creation time')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                <ListItemText
                  primary={fDate(ddlRow.created_at, 'dd MMMMMMMM yyyy')}
                  secondary={fDate(ddlRow.created_at, 'p')}
                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                  secondaryTypographyProps={{
                    component: 'span',
                    typography: 'caption',
                  }}
                />
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.user_creation?.email}
              </Box>

              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by IP')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.ip_address_user_creation}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editing time')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                <ListItemText
                  primary={fDate(ddlRow.updated_at, 'dd MMMMMMMM yyyy')}
                  secondary={fDate(ddlRow.updated_at, 'p')}
                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                  secondaryTypographyProps={{
                    component: 'span',
                    typography: 'caption',
                  }}
                />
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.user_modification?.email}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor IP')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
                {ddlRow.ip_address_user_modification}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>
                {t('modifications no')}: {ddlRow.modifications_nums}
              </Box>
            </>
          )}
        </CustomPopover>
        <TablePaginationCustom
          count={length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
          onChangeDense={table.onChangeDense}
        />
      </Card>
    </Container>
  );
}
