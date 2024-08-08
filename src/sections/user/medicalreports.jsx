import * as React from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { convert } from 'html-to-text';
import {
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
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDateAndTime } from 'src/utils/format-time';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetPatintmedicalreports } from 'src/api/medical_repots';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from './imges/back2.png';
import Doclogo from '../../components/logo/doc.png';

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
    marginBottom:6
  },
  largeText: {
    fontSize: 15,
    marginBottom: 7,
    fontWeight: 'bold',
  },
  watermark: {
    position: 'absolute',
    top: '30%', // Adjust the vertical position as needed
    left: '25%', // Adjust the horizontal position as needed
    width: '50%', // Adjust width for desired size
    opacity: 0.3, // Set opacity to 30%
    zIndex: -1,
  },
});

const MedicalReportPDF = ({ report }) => {
  const sanitizedHtmlString = DOMPurify.sanitize(report?.description || '');
  const plainText = convert(sanitizedHtmlString, {
    wordwrap: 130,
  });
  const result = convert(plainText);

  return (
    <Document>
     <Page size={{ width: 595.28, height: 841.89 }} style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          {/* <PdfImage src={report?.unit_service?.company_logo} style={styles.headerImage} /> */}
          <PdfImage src="https://media.istockphoto.com/id/1321617070/vector/health-medical-logo.jpg?s=612x612&w=0&k=20&c=sus8vhG3c__vCdvOBLDhuf2vPUgIAudIAeUBApU_7Ew=" style={styles.headerImage} />
          <View>
            <Text style={styles.headerText}>Medical Report</Text>
            <Text style={styles.headerText}>test</Text>
            <Text style={styles.headerText}>trtg grtgr grth</Text>
            <Text style={styles.headerText}>5674567456747</Text>
            {/* <Text style={styles.headerText}>{report?.unit_service?.name_english}</Text>
            <Text style={styles.headerText}>{report?.unit_service?.address}</Text>
            <Text style={styles.headerText}>{report?.unit_service?.mobile_num}</Text> */}
          </View>
        </View>

        {/* Watermark Logo */}
        <PdfImage src={Doclogo} style={styles.watermark} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.largeText}>Patient Information</Text>
          <Text style={styles.text}>Name: {report?.patient?.name_english}</Text>
          <Text style={styles.text}>Age: {fDateAndTime(report?.patient?.birth_date)}</Text>
          <Text style={styles.largeText}>Report Details</Text>
          <Text style={styles.text}>{result}</Text>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>
          This is a system-generated report and does not require a signature.
        </Text>
      </Page>
    </Document>
  );
};

MedicalReportPDF.propTypes = {
  report: PropTypes.object,
};

export default function Medicalreports() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { medicalreportsdata } = useGetPatintmedicalreports(user?.patient?._id);

  return medicalreportsdata?.length > 0 ? (
    medicalreportsdata?.map((info, index) => (
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
        <Stack sx={{ p: 2, pb: 1, height: 150 }}>
          <Avatar
            alt={info?.name_english}
            src={user?.patient?.profile_picture}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
            {fDateAndTime(info?.created_at)}
          </Stack>
          <PDFDownloadLink
            style={styles.pdf}
            document={<MedicalReportPDF report={info} />}
            fileName={`${user?.patient?.name_english} MedicalReport.pdf`}
          >
            <Iconify style={styles.pdf2} icon="teenyicons:pdf-outline" />
          </PDFDownloadLink>
        </Stack>

        <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)' }} />

        <Box
          rowGap={1.5}
          display="grid"
          gridTemplateColumns="repeat(2, 1fr)"
          sx={{ p: 3, justifyContent: 'space-between' }}
        >
          {[
            {
              label: info?.department?.name_english,
              icon: <Iconify width={16} icon="teenyicons:hospital-solid" sx={{ flexShrink: 0 }} />,
            },
            {
              label: 'THE EMPLOYEE NAME',
              icon: <Iconify width={16} icon="mdi:doctor" sx={{ flexShrink: 0 }} />,
            },
            {
              label: `${user?.patient?.name_english} `,
              icon: <Iconify width={16} icon="fa:user" sx={{ flexShrink: 0 }} />,
            },
            {
              label: `ESG`,
              icon: (
                <Iconify width={16} icon="fa6-solid:file-prescription" sx={{ flexShrink: 0 }} />
              ),
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
