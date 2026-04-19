import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import { ListItemText } from '@mui/material';
import Container from '@mui/material/Container';
import TableBody from '@mui/material/TableBody';
import { alpha, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TableContainer from '@mui/material/TableContainer';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { useGetTickets } from 'src/api';
import { useGetUnreadMsgs } from 'src/api/chat';
import { useAuthContext } from 'src/auth/hooks';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover from 'src/components/custom-popover';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import {
  useTable,
  TableNoData,
  TableHeadCustom,
  TableSelectedAction,
  TablePaginationCustom,
} from 'src/components/table';

import MobileRow from '../../mobile-row';
import AppointmentsRow from '../ticket-row';
import TicketsToolbar from '../tickets-toolbar';
import HistoryFiltersResult from '../ticket-filters-result';

// ----------------------------------------------------------------------

const defaultFilters = {
  name: '',
  status: 'pending',
  assigned_to: null,
  priority: null,
  category: null,
};

const TABLE_HEAD = [
  { id: 'code', label: 'code' },
  { id: 'subject', label: 'subject' },
  { id: 'priority', label: 'priority' },
  { id: 'category', label: 'category' },
  { id: 'assigned_to', label: 'assigned to' },
  { id: 'status', label: 'status' },
  { id: 'user', label: 'user' },
  { id: 'updated_at', label: 'last updated' },
  { id: 'created_at', label: 'created at' },
  { id: '' },
];

// ----------------------------------------------------------------------

export default function AppointmentsView() {
  const theme = useTheme();

  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [ddlAnchorEl, setDdlAnchorEl] = useState(null);
  const [ddlRow, setDdlRow] = useState(null);

  const ddlOpen = Boolean(ddlAnchorEl);
  const table = useTable({ defaultOrderBy: 'code' });

  const [filters, setFilters] = useState(defaultFilters);

  const { user } = useAuthContext();

  const { messages } = useGetUnreadMsgs(user._id);

  const {
    ticketsData,
    length,
    pendingLength,
    proccessingLength,
    waitingLength,
    completedLength,
    closedLength,
    refetch,
  } = useGetTickets({
    page: table.page || 0,
    sortBy: table.orderBy || 'code',
    rowsPerPage: table.rowsPerPage || 10,
    order: table.order || 'asc',
    name: filters.name || null,
    status: filters.status || null,
    priority: filters.priority || null,
    category: filters.category || null,
    assigned_to: filters.assigned_to || null,
    populate: 'category assigned_to user_creation user_modification',
  });

  const dateError =
    filters.startDate && filters.endDate
      ? filters.startDate.getTime() > filters.endDate.getTime()
      : false;

  const canReset =
    filters.priority !== defaultFilters.priority ||
    filters.category !== defaultFilters.category ||
    filters.assigned_to !== defaultFilters.assigned_to;

  const notFound = (!ticketsData.length && canReset) || !ticketsData.length;

  const TABS = [
    {
      value: 'pending',
      label: 'pending',
      color: 'warning',
      count: pendingLength,
    },
    {
      value: 'waiting',
      label: 'waiting',
      color: 'secondary',
      count: waitingLength,
    },
    {
      value: 'processing',
      label: 'processing',
      color: 'info',
      count: proccessingLength,
    },
    {
      value: 'completed',
      label: 'completed',
      color: 'success',
      count: completedLength,
    },
    {
      value: 'closed',
      label: 'closed',
      color: 'error',
      count: closedLength,
    },
  ];

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
  const handleFilterStatus = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters]
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  const handleViewTicket = useCallback(
    (id) => {
      router.push(paths.superadmin.communication.info(id));
    },
    [router]
  );

  return (
    <Container maxWidth="xl">
      <CustomBreadcrumbs
        heading="tickets"
        links={[{ name: 'dashboard', href: paths.dashboard.root }, { name: 'tickets' }]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterStatus}
          sx={{
            px: 2.5,
            boxShadow: `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TABS.map((tab, idx) => (
            <Tab
              key={idx}
              value={tab.value}
              label={tab.label}
              iconPosition="end"
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={tab.color}
                >
                  {tab.count}
                </Label>
              }
            />
          ))}
        </Tabs>

        <TicketsToolbar
          filters={filters}
          onFilters={handleFilters}
          //
          dateError={dateError}
        />

        {canReset && (
          <HistoryFiltersResult
            filters={filters}
            onFilters={handleFilters}
            //
            onResetFilters={handleResetFilters}
            //
            results={ticketsData.length}
            sx={{ p: 2.5, pt: 0 }}
          />
        )}

        {isMobile ? (
          <>
            {ticketsData
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row) => (
                <MobileRow
                  key={row?._id}
                  fields={[
                    {
                      label: 'Code',
                      value: row?.code,
                    },
                    {
                      label: 'Subject',
                      value: row?.subject,
                    },
                    { label: 'Priority', value: row?.priority },
                    { label: 'Category', value: row?.category?.name_english },
                    { label: 'Assigned to', value: row?.assigned_to?.email },
                    {
                      label: 'Status',
                      value: (
                        <Label
                          variant="soft"
                          color={
                            (row.status === 'pending' && 'warning') ||
                            (row.status === 'waiting' && 'secondary') ||
                            (row.status === 'processing' && 'info') ||
                            (row.status === 'completed' && 'success') ||
                            (row.status === 'closed' && 'error') ||
                            'default'
                          }
                        >
                          {row.status}
                        </Label>
                      ),
                    },
                    { label: 'User', value: row?.user_creation?.email },
                    {
                      label: 'Last Updated',
                      value: (
                        <ListItemText
                          primary={fDate(row?.updated_at, 'dd MMMMMMMM yyyy')}
                          secondary={fDate(row?.updated_at, 'p')}
                          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                          secondaryTypographyProps={{
                            component: 'span',
                            typography: 'caption',
                          }}
                        />
                      ),
                    },
                    {
                      label: 'Created at',
                      value: (
                        <ListItemText
                          primary={fDate(row?.created_at, 'dd MMMMMMMM yyyy')}
                          secondary={fDate(row?.created_at, 'p')}
                          primaryTypographyProps={{ typography: 'body2', noWrap: true }}
                          secondaryTypographyProps={{
                            component: 'span',
                            typography: 'caption',
                          }}
                        />
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
            <TableSelectedAction
              dense={table.dense}
              numSelected={table.selected.length}
              rowCount={ticketsData.length}
            />
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
                  {ticketsData?.map((row, idx) => {
                    const unreadCount = messages.find((one) => one._id === row.chat);
                    return (
                      <AppointmentsRow
                        refetch={refetch}
                        key={idx}
                        row={row}
                        unread={unreadCount?.messages?.length}
                        onViewRow={() => handleViewTicket(row._id)}
                        selected={table.selected.includes(row._id)}
                        onSelectRow={() => table.onSelectRow(row._id)}
                      />
                    );
                  })}

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
              <Box sx={{ fontWeight: 600 }}>creation time:</Box>
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
              <Box sx={{ pt: 1, fontWeight: 600 }}>created by:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.user_creation?.email}
              </Box>

              <Box sx={{ pt: 1, fontWeight: 600 }}>created by IP:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.ip_address_user_creation}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>editing time:</Box>
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
              <Box sx={{ pt: 1, fontWeight: 600 }}>editor:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray' }}>
                {ddlRow.user_modification?.email}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>editor IP:</Box>
              <Box sx={{ pb: 1, borderBottom: '1px solid gray', fontWeight: '400' }}>
                {ddlRow.ip_address_user_modification}
              </Box>
              <Box sx={{ pt: 1, fontWeight: 600 }}>
                modifications no: {ddlRow.modifications_nums}
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
