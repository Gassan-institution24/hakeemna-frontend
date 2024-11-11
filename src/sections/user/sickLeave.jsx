import * as React from 'react';
import DOMPurify from 'dompurify';
import PropTypes from 'prop-types';
import { convert } from 'html-to-text';
import {
  Page,
  Text,
  Font,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image as PdfImage,
} from '@react-pdf/renderer';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Tooltip } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import { fDmPdf, fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetPatintSickLeaves } from 'src/api/sickleave';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from './imges/back.png';
import Doclogo from '../../components/logo/doc.png';

Font.register({
  family: 'ArabicFont',
  src: '/fonts/IBMPlexSansArabic-Regular.ttf',
});

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
  textAR: {
    fontSize: 13,
    marginBottom: 6,
    fontFamily: 'ArabicFont',
  },
  largeText: {
    fontSize: 15,
    marginBottom: 7,
    fontWeight: 'bold',
  },
  image: {
    marginTop: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  insideImage: {
    width: '100%', // Make the image full width
    height: 'auto', // Maintain the aspect ratio
  },
  watermark: {
    position: 'absolute',
    top: '30%', // Adjust the vertical position as needed
    left: '25%', // Adjust the horizontal position as needed
    width: '50%', // Adjust width for desired size
    opacity: 0.2, // Set opacity to 30%
    zIndex: -1,
  },
});

const SickLeavePDF = ({ report }) => {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
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
          <PdfImage src={report?.unit_services?.company_logo} style={styles.headerImage} />
          <View>
            <Text style={styles.headerText}>Sick Leave</Text>
            <Text style={styles.headerText}>{report?.unit_services?.name_english}</Text>
            <Text style={styles.headerText}>{report?.unit_services?.address}</Text>
            <Text style={styles.headerText}>{report?.unit_services?.phone}</Text>
          </View>
        </View>

        {/* Watermark Logo */}
        <PdfImage src={Doclogo} style={styles.watermark} />

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.largeText}>Patient Information</Text>

          <Text style={styles.text}>
            Name: {curLangAr ? user?.patient?.name_arabic : user?.patient?.name_english}
          </Text>
          <Text style={styles.text}>
            {' '}
            from {fDmPdf(report?.Medical_sick_leave_start)} to{' '}
            {fDmPdf(report?.Medical_sick_leave_end)}
          </Text>
          <Text style={styles.largeText}>Report Details</Text>
          <Text style={styles.textAR}>{result}</Text>
        </View>
        {/* Footer */}
        <Text style={styles.footer}>Made by hakeemna</Text>
      </Page>
    </Document>
  );
};
SickLeavePDF.propTypes = {
  report: PropTypes.object,
};

export default function SickLeaves() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
  const { data } = useGetPatintSickLeaves(user?.patient?._id);

  function getPatientLabel() {
    if (curLangAr) {
      if (user?.patient?.gender === 'female') {
        return `السيدة ${user?.patient?.name_arabic}`;
      }
      return `السيد ${user?.patient?.name_arabic}`;
    }
    if (user?.patient?.gender === 'male') {
      return `mr. ${user?.patient?.name_english}`;
    }
    return `ms. ${user?.patient?.name_english}`;
  }

  return data?.length > 0 ? (
    data?.map((info, index) => (
      <Card
        key={index}
        sx={{
          backgroundImage: `url(${Back})`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(255, 255, 255, 0.800)',
          backgroundBlendMode: 'lighten',
          mb: 2,
        }}
      >
        <Stack sx={{ p: 2, pb: 1, height: 120 }}>
          <Avatar
            alt={info?.name_english}
            src={user?.patient?.profile_picture}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />

          <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
            {t('From')} {fDateAndTime(info?.Medical_sick_leave_start)} {t('To')}
            {fDateAndTime(info?.Medical_sick_leave_end)}
          </Stack>
          {/* <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
            {ConvertToHTML(info?.description)}
          </Stack> */}
        </Stack>
        <Stack sx={{ display: 'inline', m: 2, position: 'absolute', right: 0, top: 0 }}>
          <PDFDownloadLink
            style={styles.pdf}
            document={<SickLeavePDF report={info} />}
            fileName={`${user?.patient?.name_english} sickleave.pdf`}
          >
            <Tooltip title={t('Download')}>
              <Iconify
                icon="akar-icons:cloud-download"
                width={23}
                sx={{ color: 'info.main', mr: 2 }}
              />
            </Tooltip>
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
              label: getPatientLabel(curLangAr, user),
              icon: <Iconify width={16} icon="fa:user" sx={{ flexShrink: 0 }} />,
            },
            {
              label: curLangAr
                ? info?.unit_services?.name_arabic
                : info?.unit_services?.name_english,
              icon: <Iconify width={16} icon="teenyicons:hospital-solid" sx={{ flexShrink: 0 }} />,
            },
            {
              label: curLangAr
                ? `${info?.employee?.name_arabic} (${info?.employee?.speciality?.name_arabic}) `
                : `${info?.employee?.name_english} (${info?.employee?.speciality?.name_english})`,
              icon: <Iconify width={16} icon="mdi:doctor" sx={{ flexShrink: 0 }} />,
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
