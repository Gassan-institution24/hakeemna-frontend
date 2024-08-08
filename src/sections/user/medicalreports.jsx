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

export default function Medicalreports() {
  const { t } = useTranslate();
  const { user } = useAuthContext();
  const { medicalreportsdata } = useGetPatintmedicalreports(user?.patient?._id);

  const styles = StyleSheet.create({
    icon: {
      color: 'blue',
      position: 'relative',
      top: '3px',
    },
    image: {
      width: '100px',
      height: '100px',
    },
    department: {
      width: '80px',
      height: '80px',
      position: 'relative',
      left: '60px',
      top: '135px',
    },
    doctor: {
      width: '80px',
      height: '80px',
      position: 'relative',
      right: '-410px',
      top: '50px',
    },
    page: {
      backgroundColor: 'aliceblue',
      border: 1,
    },
    text: {
      textAlign: 'center',
      fontSize: 15,
    },
    text2: {
      fontSize: 12,
    },
    text3: {
      fontSize: 12,
    },
    text4: {
      fontSize: 10,
    },
    gridContainer: {
      padding: '10px',
      gap: '10px',
      marginBottom: 10,
      alignItems: 'center',
      fontSize: 12,
      height: '40%',
      borderBottom: 1,
    },
    gridBody: {
      fontSize: 12,
      gap: 20,
      padding: 10,
      position: 'relative',
      top: '-11px',
      height: '50%',
      borderBottom: 1,
    },
    gridFooter: {
      fontSize: 12,
      padding: '10px',
      position: 'relative',
      top: '-12px',
      height: '100%',
    },
    pdf: {
      position: 'absolute',
      top: 30,
      right: 15,
      zIndex: 999,
    },
    pdf2: {
      width: 30,
      height: 30,
    },
  });


  const PrescriptionPDF = React.useCallback(
    ({ report }) => {
      // Sanitize the HTML string
      const sanitizedHtmlString = DOMPurify.sanitize(report?.description || '');

      // Convert sanitized HTML to plain text
      const plainText = convert(sanitizedHtmlString, {
        wordwrap: 130
      });
      const result = convert(plainText)

      return (
        <Document>
          <Page size="A4" style={styles.page}>
            <View>
              <View style={styles.gridContainer}>
                <PdfImage src={Doclogo} style={styles.image} />
                <Text style={styles.text3}>{report.department?.name_english}</Text>
                <Text style={styles.text4}>Al Waha_cercle at0349</Text>
                <Text style={styles.text4}>+962776088372</Text>
              </View>
              <View style={styles.gridBody}>
                <Text style={styles.text}>Medical Report</Text>
                {/* <Text style={styles.text2}>Name: {patient?.name_english}</Text> */}
                {/* <Text style={styles.text2}>Age: {fDateAndTime(patient?.birth_date)}</Text> */}
                {/* <Text style={styles.text2}>ID no: {patient?.identification_num}</Text> */}
              </View>
              <View style={styles.gridFooter}>
                <Text style={styles.text}>{result}</Text>
                <PdfImage src={Doclogo} style={styles.department} />
                <PdfImage src={Doclogo} style={styles.doctor} />
              </View>
            </View>
          </Page>
        </Document>
      );
    },
    [styles]
  );

  PrescriptionPDF.propTypes = {
    report: PropTypes.object,
  };

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
            document={<PrescriptionPDF report={info} />}
            fileName={`${user?.patient?.name_english} MediacalReport.pdf`}
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
