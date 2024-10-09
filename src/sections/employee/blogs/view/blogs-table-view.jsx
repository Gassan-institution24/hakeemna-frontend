import { useRef, useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
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
import { useGetUserBlogs } from 'src/api';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import TableDetailRow from '../table-details-row'; /// edit
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

  const { user } = useAuthContext();

  const [filters, setFilters] = useState(defaultFilters);

  const { blogsData, length } = useGetUserBlogs(user?._id, {
    page: table.page,
    order: table.order,
    sortBy: table.sortBy,
    rowsPerPage: table.rowsPerPage,
    name: filters.name,
    populate: { path: 'category', select: 'name_english name_arabic' }
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
      router.push(paths.employee.documents.blogs.edit(id));
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
            href: paths.employee.root,
          },
          { name: t('my blogs') },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.employee.documents.blogs.new}
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

                {/* <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, blogsData?.length)}
                /> */}

                <TableNoData notFound={notFound} />
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

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