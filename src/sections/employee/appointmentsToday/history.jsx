import { useState } from 'react';

import {
  Box,
  Card,
  Paper,
  Table,
  Button,
  Switch,
  Select,
  TableRow,
  MenuItem,
  TableCell,
  TableBody,
  TableHead,
  Typography,
  TableContainer,
} from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { fDateTime, fTimeText } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatientHistoryData,
  useGetOneEntranceManagement,
  useGetPatientHistoryDataInSu,
} from 'src/api';

// ----------------------------------------------------------------------

export default function History() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { historyDataForPatient } = useGetPatientHistoryData(Entrance?.patient?._id, Entrance?.unit_service_patient);
  const { historyData } = useGetPatientHistoryDataInSu(
    Entrance?.patient?._id,
    Entrance?.unit_service_patient,
    Entrance?.service_unit?._id
  );
  const Title = ['appointment', 'medical report', 'prescription'];
  const [switchh, setSwitch] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(2);
  const [selectedTitle, setSelectedTitle] = useState("");

  const dataFiltered = applyFilter({
    inputData: switchh === true ? historyDataForPatient : historyData,
    filterforspecialties: selectedTitle,
  });

  return (
    <>
      <div style={{ marginBottom: 10 }}>
        {curLangAr
          ? `التاريخ الطبي ل ${Entrance?.patient?.name_arabic}`
          : `${Entrance?.patient?.name_english} medical history`}
      </div>

      <Card>
        <Box sx={{ m: 2 }}>
          <Typography variant="" sx={{ color: 'text.secondary', mr: 3 }}>
            {t('TYPE')}{' '}
          </Typography>
          <Select
            sx={{
              width: 150,
              height: 35,
            }}
            value={selectedTitle}
            displayEmpty
            onChange={(e) => setSelectedTitle(e.target.value)}
          >
            <MenuItem value="" disabled sx={{ display: 'none' }}>{t('All')}</MenuItem>
            {Title.map((type, index) => (
              <MenuItem key={index} value={type}>
                {t(type)}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{t('Date')}</TableCell>
                <TableCell>{t('Name')}</TableCell>
                <TableCell>{t('Subject')}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>{t('Private')}</span>{' '}
                    <Switch value={switchh} onChange={() => setSwitch(!switchh)} />{' '}
                    <span>{t('Public')}</span>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataFiltered?.slice(0, itemsToShow).map(
                (historydata, i) =>
                  historydata?.status === 'active' && (
                    <TableRow key={i}>
                      <TableCell>{fDateTime(historydata?.actual_date)}</TableCell>
                      <TableCell>{historydata?.title}</TableCell>
                      <TableCell>
                        {curLangAr ? historydata?.sub_arabic : historydata?.sub_english}
                      </TableCell>
                      <TableCell sx={{ fontSize: 12, color: 'lightgray' }}>
                        {fTimeText(historydata?.created_at)}
                      </TableCell>
                    </TableRow>
                  )
              )}
            </TableBody>
          </Table>
          {dataFiltered?.length > itemsToShow && (
            <Button
              variant="contained"
              color="success"
              onClick={() => setItemsToShow(itemsToShow + itemsToShow)}
              sx={{ m: 2 }}
            >
              {t('Load More')}
            </Button>
          )}
        </TableContainer>
      </Card>
    </>
  );
}

function applyFilter({ inputData, filterforspecialties }) {
  if (!filterforspecialties) {
    return inputData;
  }
  return inputData.filter((item) => item.title === filterforspecialties);
}
