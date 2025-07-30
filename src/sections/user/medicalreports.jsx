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

import { Box, Card, Stack, Avatar, Tooltip, Divider, Typography } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { fDmPdf, fDateAndTime } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetPatintmedicalreports } from 'src/api/medical_repots';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Back from './imges/back2.png';
import Doclogo from '../../components/logo/doc.png';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: '#fff',
    position: 'relative',
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
    bottom: 20,
    left: 20,
    right: 20,
    fontSize: 8,
    color: '#777',
    textAlign: 'center',
  },
  content: {
    marginTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120, // Space for signature section and footer
  },
  contentContinuation: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60, // Less padding for continuation pages
  },
  text: {
    fontSize: 13,
    marginBottom: 6,
    lineHeight: 1.4,
  },
  largeText: {
    fontSize: 15,
    marginBottom: 7,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginTop: 20,
    marginBottom: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  reportImage: {
    width: '100%',
    height: 'auto',
    maxHeight: 400,
    marginBottom: 10,
  },
  watermark: {
    position: 'absolute',
    top: '30%',
    left: '25%',
    width: '50%',
    opacity: 0.2,
    zIndex: -1,
  },
});

const MedicalReportPDF = ({ report }) => {
  console.log(report);
  const sanitizedHtmlString = DOMPurify.sanitize(report?.description || '');
  const plainText = convert(sanitizedHtmlString, {
    wordwrap: 130,
  });
  const result = convert(plainText);

  // Split content into pages
  const textPages = splitTextIntoPages(result, 1800);
  const imagePages = report?.file?.length > 0 ? distributeImages(report.file, 2) : [];
  const totalPages = textPages.length + imagePages.length;

  const renderHeader = () => (
    <View style={styles.header}>
      <PdfImage src={report?.unit_service?.company_logo} style={styles.headerImage} />
      <View>
        <Text style={styles.headerText}>Medical Report</Text>
        <Text style={styles.headerText}>{report?.unit_service?.name_english}</Text>
        <Text style={styles.headerText}>{report?.unit_service?.address}</Text>
        <Text style={styles.headerText}>{report?.unit_service?.phone}</Text>
      </View>
    </View>
  );

  const renderWatermark = () => (
    <PdfImage src={Doclogo} style={styles.watermark} />
  );

  const renderSignatureSection = () => (
    <View style={styles.signatureSection}>
      <View style={styles.signatureContainer}>
        {report?.employee?.signature && (
          <PdfImage src={report?.employee?.signature} style={styles.signatureImage} />
        )}
        <Text style={styles.signatureText}>Employee Signature</Text>
      </View>
      <View style={styles.signatureContainer}>
        {report?.employee?.stamp && (
          <PdfImage src={report?.employee?.stamp} style={styles.stampImage} />
        )}
        <Text style={styles.signatureText}>Official Stamp</Text>
      </View>
    </View>
  );

  const renderFooter = (pageNumber) => (
    <>
      <Text style={styles.footer}>Powered by hakeemna</Text>
      <Text style={styles.pageNumber}>Page {pageNumber} of {totalPages}</Text>
    </>
  );

  return (
    <Document>
      {/* First page with patient info and first part of content */}
      <Page size={{ width: 595.28, height: 841.89 }} style={styles.page}>
        {renderHeader()}
        {renderWatermark()}
        
        <View style={styles.content}>
          <Text style={styles.largeText}>Patient Information</Text>
          <Text style={styles.text}>Name: {report?.patient?.name_english}</Text>
          <Text style={styles.text}>Birth Date: {fDmPdf(report?.patient?.birth_date)}</Text>
          <Text style={styles.largeText}>Report Details</Text>
          <Text style={styles.text}>{textPages[0]}</Text>
        </View>

        {/* Images */}
        <View style={styles.image}>
          {report?.file?.map((file, index) => (
            <PdfImage key={index} src={file} style={styles.insideImage} />
          ))}
        </View>

        {/* Signature and Stamp Section */}
        <View style={styles.signatureSection}>
          <View style={styles.signatureContainer}>
            {report?.employee?.signature && (
              <PdfImage src={report.employee.signature} style={styles.signatureImage} />
            )}
            <Text style={styles.signatureText}>Employee Signature</Text>
          </View>

          <View style={styles.signatureContainer}>
            {report?.employee?.stamp && (
              <PdfImage src={report.employee.stamp} style={styles.stampImage} />
            )}
            <Text style={styles.signatureText}>Official Stamp</Text>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Made by hakeemna</Text>
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
  const [hoveredButtonId, setHoveredButtonId] = React.useState(null);
  const router = useRouter();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  
  const handleHover = (id) => {
    setHoveredButtonId(id);
  };
  
  const handleMouseOut = () => {
    setHoveredButtonId(null);
  };
  
  const handleViewClick = (id) => {
    router.push(paths.dashboard.user.medicalreportsview(id));
  };
  
  const { medicalreportsdata } = useGetPatintmedicalreports(user?.patient?._id);
  
  const formatTextWithLineBreaks = (text, id, limit = 20) => {
    if (!text) return '';

    const chunks = [];
    for (let i = 0; i < text.length; i += 100) {
      chunks.push(text.slice(i, i + 100));
    }

    let formattedText = chunks.join('<br />');

    if (text.length > limit) {
      formattedText = `${text.slice(
        0,
        limit
      )}... <a href="/dashboard/user/medicalreportsview/${id}" style="color:blue;">Read more</a>`;
    }

    return formattedText;
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
          <Typography
            dangerouslySetInnerHTML={{
              __html: formatTextWithLineBreaks(info?.description, info?._id),
            }}
            sx={{ fontSize: 13 }}
          />
        </Stack>
        <Stack sx={{ display: 'inline', m: 2, position: 'absolute', right: 0, top: 0 }}>
          <PDFDownloadLink
            style={styles.pdf}
            document={<MedicalReportPDF report={info} />}
            fileName={`${user?.patient?.name_english} MedicalReport.pdf`}
          >
            <Tooltip title={t('Download')}>
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
        <Divider sx={{ borderStyle: 'dashed', borderColor: 'rgba(128, 128, 128, 0.512)', mt: 5 }} />

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
              icon: <Iconify width={18} icon="mdi:doctor" sx={{ flexShrink: 0 }} />,
            },
            {
              label: curLangAr ? info?.unit_service?.name_arabic : info?.unit_service?.name_english,
              icon: <Iconify width={16} icon="teenyicons:hospital-solid" sx={{ flexShrink: 0 }} />,
            },
            info?.file?.length > 0 && {
              label: curLangAr ? (
                <span style={{ color: '#22C55E', fontWeight: 600 }}>يحتوي على ملف</span>
              ) : (
                <span style={{ color: '#22C55E', fontWeight: 600 }}>File inside</span>
              ),
              icon: (
                <Iconify width={20} icon="material-symbols:image-sharp" sx={{ flexShrink: 0 }} />
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