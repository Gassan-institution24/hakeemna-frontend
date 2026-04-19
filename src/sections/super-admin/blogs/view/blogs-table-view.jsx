import { useRef, useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { ListItemText } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TablePaginationCustom,
} from 'src/components/table'; /// edit
import { fDate } from 'src/utils/format-time';

import { useGetUserBlogs } from 'src/api';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import CustomPopover from 'src/components/custom-popover';

import TableDetailRow from '../table-details-row'; /// edit
import MobileRow from '../../mobile-row';
import TableDetailToolbar from '../table-details-toolbar';
import TableDetailFiltersResult from '../table-details-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
};

// ----------------------------------------------------------------------

export default function BlogsTableView() {
  const table = useTable({ defaultOrderBy: 'code' });

  const componentRef = useRef();

  const { t } = useTranslate();

  const TABLE_HEAD = [
    { id: 'code', label: t('code') },
    { id: 'title', label: t('title') },
    { id: 'category', label: t('category') },
    { id: '', width: 88 },
  ];

  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  const { user } = useAuthContext();

  const [filters, setFilters] = useState(defaultFilters);

  const { blogsData, length } = useGetUserBlogs(user?._id, {
    page: table.page,
    order: table.order,
    sortBy: table.sortBy,
    rowsPerPage: table.rowsPerPage,
    name: filters.name,
    populate: { path: 'category', select: 'name_english name_arabic' },
  });

  const canReset = !!filters?.name;

  const notFound = (!blogsData?.length && canReset) || !blogsData?.length;

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

  const handleEditRow = useCallback(
    (id) => {
      router.push(paths.superadmin.blogs.edit(id));
    },
    [router]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  // if (loading) {
  //   return <LoadingScreen />;
  // }

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading={t('my blogs')} /// edit
        links={[
          {
            name: t('dashboard'),
            href: paths.superadmin.root,
          },
          { name: t('my blogs') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.superadmin.blogs.new}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            {t('new blog')}
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card>
        <TableDetailToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          canReset={canReset}
          onResetFilters={handleResetFilters}
        />

        {canReset && (
          <TableDetailFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={blogsData?.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        {isMobile ? (
          <>
            {blogsData
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <MobileRow
                  key={row?._id}
                  title={row?.title}
                  fields={[
                    {
                      label: 'Code',
                      value: row?.code,
                    },
                    {
                      label: 'Category',
                      value: row?.category?.name_english,
                    },
                  ]}
                  actions={[
                    {
                      label: 'Edit',
                      icon: 'fluent:edit-32-filled',
                      onClick: () => handleEditRow(row._id),
                    },
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
          <TableContainer>
            <Scrollbar>
              <Table ref={componentRef} size={table.dense ? 'small' : 'medium'}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={blogsData?.length}
                  numSelected={table.selected?.length}
                  onSort={table.onSort}
                />

                <TableBody>
                  {blogsData
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    ?.map((row, idx) => (
                      <TableDetailRow
                        key={idx}
                        row={row}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                        onEditRow={() => handleEditRow(row._id)}
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
                  primary={fDate(ddlRow?.created_at, 'dd MMMMMMMM yyyy')}
                  secondary={fDate(ddlRow?.created_at, 'p')}
                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                  secondaryTypographyProps={{
                    component: 'span',
                    typography: 'caption',
                  }}
                />
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow?.user_creation?.email}</Box>

              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('created by IP')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow?.ip_address_user_creation}</Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editing time')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                <ListItemText
                  primary={fDate(ddlRow?.updated_at, 'dd MMMMMMMM yyyy')}
                  secondary={fDate(ddlRow?.updated_at, 'p')}
                  primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                  secondaryTypographyProps={{
                    component: 'span',
                    typography: 'caption',
                  }}
                />
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>{ddlRow?.user_modification?.email}</Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>{t('editor IP')}:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
                {ddlRow?.ip_address_user_modification}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>
                {t('modifications no')}: {ddlRow?.modifications_nums}
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
