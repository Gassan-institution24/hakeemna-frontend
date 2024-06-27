import { useState } from 'react';

import {
  Box,
  Card,
  Paper,
  Button,
  Switch,
  TableRow,
  TableCell,
  TableBody,
  Table,
  TableHead,
  TextField,
  TableContainer,
} from '@mui/material';

import { useParams } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import {
  useGetPatientHistoryData,
  useGetOneEntranceManagement,
  useGetPatientHistoryDataInSu,
} from 'src/api';
import { fMonth, fTimeText } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export default function History() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { id } = useParams();
  const { Entrance } = useGetOneEntranceManagement(id);
  const { historyDataForPatient } = useGetPatientHistoryData(Entrance?.patient?._id);
  const { historyData } = useGetPatientHistoryDataInSu(
    Entrance?.patient?._id,
    Entrance?.service_unit?._id
  );
  const [filterforspecialties, setFilterforspecialties] = useState();
  const [switchh, setSwitch] = useState(false);
  const [itemsToShow, setItemsToShow] = useState(2);

  const dataFiltered = applyFilter({
    inputData: switchh === true ? historyDataForPatient : historyData,
    filterforspecialties,
  });
  return (
    <>
      <>
        {`${Entrance?.patient?.name_english} medical history`}
        <br />
        <Box>
          <TextField
            onChange={(e) => setFilterforspecialties(e.target.value)}
            variant="outlined"
            size="small"
            placeholder="Search details"
            sx={{ ml: 2, mb: 2 }}
          />
        </Box>
      </>

      <Card>
        <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>{t('Date')}</TableCell>
                <TableCell>{t('Name')}</TableCell>
                <TableCell>{t('Subject')}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span>Private</span>{' '}
                    <Switch value={switchh} onChange={() => setSwitch(!switchh)} />{' '}
                    <span>Public</span>
                  </Box>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataFiltered?.slice(0, itemsToShow).map(
                (historydata, i) =>
                  historydata?.status === 'active' && (
                    <TableRow key={i}>
                      <TableCell>{fMonth(historydata?.actual_date)}</TableCell>
                      <TableCell>
                        {curLangAr ? historydata?.name_arabic : historydata?.name_english}
                      </TableCell>
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
function normalizeArabicText(text) {
  // Normalize Arabic text by replacing 'أ' with 'ا'
  return text.replace(/أ/g, 'ا');
}

function applyFilter({ inputData, filterforspecialties }) {
  if (!filterforspecialties) {
    return inputData;
  }

  // Normalize the search term for comparison
  const normalizedSearchTerm = normalizeArabicText(filterforspecialties.toLowerCase());

  inputData = inputData?.filter((data) => {
    const normalizedDataNameEnglish = normalizeArabicText(data?.name_english.toLowerCase());
    const normalizedDataNameArabic = normalizeArabicText(data?.name_arabic.toLowerCase());
    const normalizedDataSubArabic = normalizeArabicText(data?.sub_english.toLowerCase());
    const normalizedDataSubEnglish = normalizeArabicText(data?.sub_arabic.toLowerCase());
    return (
      normalizedDataNameEnglish.includes(normalizedSearchTerm) ||
      normalizedDataNameArabic.includes(normalizedSearchTerm) ||
      normalizedDataSubArabic.includes(normalizedSearchTerm) ||
      normalizedDataSubEnglish.includes(normalizedSearchTerm) ||
      data?._id === filterforspecialties ||
      JSON.stringify(data.code) === filterforspecialties
    );
  });

  return inputData;
}
