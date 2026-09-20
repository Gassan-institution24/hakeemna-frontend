
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';

import { Card, Alert, Stack, Skeleton, Container } from '@mui/material';

import { useTranslate } from 'src/locales';
import { useGetPatientHistoryDataForUs } from 'src/api';

import { ProfilePaneHeader } from 'src/sections/shared/patient-profile/profile-pane';

import HistoryList from './history-list';
import HistorySummary from './history-summary';
import HistoryFilters from './history-filters';
import HistoryDetailsDialog from './history-details-dialog';

function PatientHistory({ patient }) {
  const { t } = useTranslate();
  const { historyDataForPatient, loading, error } = useGetPatientHistoryDataForUs(patient?._id);

  const [selectedData, setSelectedData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });

  const itemsPerPage = 10;


  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };


  const filteredHistory = useMemo(() => {
    if (!historyDataForPatient?.data?.history) return [];

    let filtered = [...historyDataForPatient.data.history];


    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.recordType === filterType);
    }


    if (searchTerm) {
      filtered = filtered.filter(record =>
      (record.work_group?.name_english?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.work_group?.name_arabic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.service_unit?.name_english?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.service_unit?.name_arabic?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.visitLabel?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }


    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [historyDataForPatient, filterType, searchTerm, sortConfig]);


  const paginatedHistory = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredHistory.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredHistory, currentPage]);

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);

  const handleView = (item) => {
    setSelectedData(item);
    setOpenDialog(true);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const header = (
    <ProfilePaneHeader
      icon="solar:history-bold-duotone"
      title={t('Visit History')}
      count={historyDataForPatient?.data?.history?.length}
    />
  );

  // A bare progress bar over a centred "Loading..." line told you nothing about
  // the shape of what was coming. Skeletons in the real layout do.
  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {header}
        <Stack gap={2}>
          <Skeleton variant="rounded" height={96} />
          <Skeleton variant="rounded" height={72} />
          {[0, 1, 2].map((row) => (
            <Card key={row} sx={{ p: 2 }}>
              <Skeleton variant="text" width={200} height={28} />
              <Skeleton variant="text" width="80%" />
            </Card>
          ))}
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl" sx={{ py: 3 }}>
        {header}
        <Alert severity="error">
          {t('Error loading patient history')}: {error.message}
        </Alert>
      </Container>
    );
  }

  const historyData = historyDataForPatient?.data;

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {header}

      <HistorySummary summary={historyData?.summary} history={historyData?.history} />
      <HistoryFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterType={filterType}
        setFilterType={setFilterType}
        sortConfig={sortConfig}
        requestSort={requestSort}
      />
      <HistoryList
        history={paginatedHistory}
        onView={handleView}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <HistoryDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        data={selectedData}
      />
    </Container>
  );
}

PatientHistory.propTypes = {
  patient: PropTypes.object,
};

export default PatientHistory;