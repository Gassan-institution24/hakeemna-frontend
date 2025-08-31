import PropTypes from 'prop-types';


import {
  Button,
  Card,
  CardContent,
  Grid,
  InputAdornment,
  Tab,
  Tabs,
  TextField,
  Box,
} from '@mui/material';


import {
  Search,
  FilterList,
  ArrowDownward,
  ArrowUpward,
  History,
  EventBusy,
  Assignment,
  Receipt,
  CalendarToday,
} from '@mui/icons-material';

import { useTranslate } from 'src/locales';

const getSortIcon = (sortConfig) => {
  if (sortConfig.key === 'created_at') {
    if (sortConfig.direction === 'asc') {
      return <ArrowUpward />;
    }
    return <ArrowDownward />;
  }
  return <ArrowDownward />;
};

const HistoryFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  sortConfig,
  requestSort
}) => {
  const { t } = useTranslate();

  return (
    <>
      <Card sx={{ mb: 3, borderRadius: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={8}>
              <TextField
                fullWidth
                placeholder={t('Search history by service, unit, or visit...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                sx={{ borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilterType('all')}
                sx={{
                  height: '100%',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                {t('Clear Filters')}
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Tabs
              value={filterType}
              onChange={(e, value) => setFilterType(value)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 3,
                  borderRadius: 3
                }
              }}
            >
              <Tab
                value="all"
                label={t('All Records')}
                icon={<History sx={{ fontSize: 18 }} />}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab
                value="sick_leave"
                label={t('Sick Leave')}
                icon={<EventBusy sx={{ fontSize: 18 }} />}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab
                value="medical_report"
                label={t('Medical Reports')}
                icon={<Assignment sx={{ fontSize: 18 }} />}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab
                value="prescription"
                label={t('Prescriptions')}
                icon={<Receipt sx={{ fontSize: 18 }} />}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
              <Tab
                value="appointment"
                label={t('Appointments')}
                icon={<CalendarToday sx={{ fontSize: 18 }} />}
                iconPosition="start"
                sx={{ minHeight: 48 }}
              />
            </Tabs>
            <Button
              size="small"
              variant="outlined"
              onClick={() => requestSort('created_at')}
              endIcon={getSortIcon(sortConfig)}
              sx={{ borderRadius: 2, textTransform: 'none', mt: 2 }}
            >
              {t('Sort by Date')}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </>
  );
};


HistoryFilters.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  setSearchTerm: PropTypes.func.isRequired,
  filterType: PropTypes.string.isRequired,
  setFilterType: PropTypes.func.isRequired,
  sortConfig: PropTypes.shape({
    key: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired,
  }).isRequired,
  requestSort: PropTypes.func.isRequired,
};

export default HistoryFilters;