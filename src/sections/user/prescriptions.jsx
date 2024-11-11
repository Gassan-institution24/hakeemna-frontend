import React from 'react';
import PropTypes from 'prop-types';
import {
  Font,
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image as PdfImage,
} from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { Tooltip } from '@mui/material';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDmPdf, fDateAndTime } from 'src/utils/format-time';

import { useGetDrugs } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from './imges/back3.png';
import Doclogo from '../../components/logo/doc.png';

Font.register({
  family: 'ArabicFont',
  src: '/fonts/IBMPlexSansArabic-Regular.ttf',
});

// Define the styles with the new font
const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerImage: {
    width: 80,
    height: 80,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 10,
    marginBottom: 4,
  },
  footer: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    fontSize: 8,
    color: '#777',
    textAlign: 'center',
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 13,
    marginBottom: 6,
  },
  largeText: {
    fontSize: 15,
    marginBottom: 7,
    fontWeight: 'bold',
  },
  arabicText: {
    fontFamily: 'ArabicFont', // Apply Arabic font here
    fontSize: 13,
    marginBottom: 6,
  },
  image: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: '50%',
    opacity: 0.2,
    zIndex: -1,
  },
  table: {
    border: '2px solid gray',
    margin: 2,
  },
  insideTable: {
    margin: 2,
  },
});

const PrescriptionPDF = ({ report }) => (
  <Document>
    <Page size={{ width: 595.28, height: 841.89 }} style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerText}>Drug Report</Text>
          <Text style={styles.headerText}>{report?.unit_service?.name_english}</Text>
          <Text style={styles.headerText}>{report?.unit_service?.address}</Text>
          <Text style={styles.headerText}>{report?.unit_service?.phone}</Text>
        </View>
      </View>

      {/* Watermark Logo */}
      <PdfImage src={Doclogo} style={styles.watermark} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.largeText}>Patient Information</Text>
        <Text style={styles.text}>Name: {report?.patient?.name_english}</Text>
        <Text style={styles.text}>Age: {fDmPdf(report?.patient?.birth_date)}</Text>
        <Text style={styles.largeText}>Report Details</Text>

        {report?.medicines?.map((info, i) => (
          <View key={i} style={styles.table}>
            <View style={styles.insideTable}>
              {info?.medicines?.trade_name && (
                <>
                  <Text>Medicines</Text>
                  <Text style={styles.largeText}>{info.medicines.trade_name}</Text>
                  <Text style={{ borderBottom: '1px solid gray' }} />
                </>
              )}
            </View>
            <View style={styles.insideTable}>
              {info?.Start_time && (
                <>
                  <Text>Start Time</Text>
                  <Text style={styles.largeText}>{fDmPdf(info.Start_time)}</Text>
                  <Text style={{ borderBottom: '1px solid gray' }} />
                </>
              )}
            </View>
            <View style={styles.insideTable}>
              {info?.End_time && (
                <>
                  <Text>End Time</Text>
                  <Text style={styles.largeText}>{fDmPdf(info.End_time)}</Text>
                  <Text style={{ borderBottom: '1px solid gray' }} />
                </>
              )}
            </View>
            <View style={styles.insideTable}>
              {info?.Num_days && (
                <>
                  <Text>Num Days</Text>
                  <Text style={styles.largeText}>{info.Num_days}</Text>
                  <Text style={{ borderBottom: '1px solid gray' }} />
                </>
              )}
            </View>
            <View style={styles.insideTable}>
              {info?.Frequency_per_day && (
                <>
                  <Text>Frequency/Day</Text>
                  <Text style={styles.largeText}>{info.Frequency_per_day}</Text>
                  <Text style={{ borderBottom: '1px solid gray' }} />
                </>
              )}
            </View>
            <View style={styles.insideTable}>
              {info?.Doctor_Comments && (
                <>
                  <Text>Doctor Comments</Text>
                  <Text style={styles.arabicText}>{info.Doctor_Comments}</Text>
                  {/* Apply Arabic font style here */}
                </>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <Text style={styles.footer}>Made by hakeemna</Text>
    </Page>
  </Document>
);

PrescriptionPDF.propTypes = {
  report: PropTypes.object,
};


export default function Prescriptions() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const [hoveredButtonId, setHoveredButtonId] = React.useState(null);
  const router = useRouter();

  const handleHover = (id) => {
    setHoveredButtonId(id);
  };
  const handleMouseOut = () => {
    setHoveredButtonId(null);
  };
  const handleViewClick = (id) => {
    router.push(paths.dashboard.user.prescriptionview(id));
  };
  const { drugs } = useGetDrugs(user?.patient?._id);

  return drugs?.length > 0 ? (
    drugs?.map((info, index) => (
      <Card
        key={index}
        sx={{
          backgroundImage: `url(${Back})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(255, 255, 255, 0.800)',
          backgroundBlendMode: 'lighten',
        }}
      >
        <Stack sx={{ p: 2, pb: 1, height: 110 }}>
          <Avatar
            alt={info?.name_english}
            src={user?.patient?.profile_picture}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
            {fDateAndTime(info?.created_at)}
          </Stack>
          {info?.medicines?.map((medicine, ii) => (
            <Typography key={ii} sx={{ pt: 1 }}>
              - {medicine?.medicines?.trade_name}
            </Typography>
          ))}
        </Stack>
        <Stack sx={{ display: 'inline', m: 2, position: 'absolute', right: 0, top: 0 }}>
          <PDFDownloadLink
            document={<PrescriptionPDF report={info} />}
            fileName={`${user?.patient?.name_english} MedicalReport.pdf`}
          >
            <Tooltip title="Download">
              <Iconify
                icon="akar-icons:cloud-download"
                width={23}
                sx={{ color: 'info.main', mr: 2 }}
              />
            </Tooltip>
          </PDFDownloadLink>
          <Iconify
            icon={hoveredButtonId === info?._id ? 'emojione:eye' : 'tabler:eye-closed'}
            onMouseOver={() => handleHover(info?._id)}
            onMouseOut={handleMouseOut}
            onClick={() => handleViewClick(info?._id)}
            width={25}
          />
        </Stack>
        <Divider
          sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)', mt: 10 }}
        />

        <Box
          rowGap={1.5}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{ p: 3, justifyContent: 'space-between' }}
        >
          {[
            {
              label: curLangAr ? user?.patient?.name_arabic : user?.patient?.name_english,
              icon: <Iconify width={16} icon="fa:user" sx={{ flexShrink: 0 }} />,
            },
            {
              label: curLangAr ? info?.employee?.name_arabic : info?.employee?.name_english,
              icon: <Iconify width={16} icon="mdi:doctor" sx={{ flexShrink: 0 }} />,
            },
            {
              label: curLangAr ? info?.unit_service?.name_arabic : info?.unit_service?.name_english,
              icon: <Iconify width={16} icon="teenyicons:hospital-solid" sx={{ flexShrink: 0 }} />,
            },
          ].map((item, idx) => (
            <Stack
              key={idx}
              spacing={0.5}
              flexShrink={0}
              direction="row"
              alignItems="center"
              sx={{ color: 'black', minWidth: 0 }}
            >
              {item?.icon}
              <Typography variant="caption" noWrap>
                {item?.label}
              </Typography>
            </Stack>
          ))}
        </Box>
      </Card>
    ))
  ) : (
    <EmptyContent
      filled
      title={t('No Data')}
      sx={{
        py: 10,
      }}
    />
  );
}
