import * as React from 'react';
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
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';

import { fDate } from 'src/utils/format-time';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import EmptyContent from 'src/components/empty-content/empty-content';

import Doclogo from '../../components/logo/doc.png';

export default function Medicalreports() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { user } = useAuthContext();
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
      textalign: 'center',
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

  const PrescriptionPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {user?.patient.Mediacalreports.map((info) => (
          <View>
            <View style={styles.gridContainer}>
              <PdfImage src={Doclogo} style={styles.image} />
              <Text style={styles.text3}>{info.department?.name_english}</Text>
              <Text style={styles.text4}>Al Waha_cercle at0349</Text>
              <Text style={styles.text4}>+962776088372</Text>
            </View>
            <View style={styles.gridBody}>
              <Text style={styles.text}>Medical Report</Text>
              <Text style={styles.text2}>
                Name: {user?.patient?.first_name} {user?.patient?.last_name}
              </Text>
              <Text style={styles.text2}>Age: {fDate(user?.patient.birth_date)}</Text>
              <Text style={styles.text2}>ID no: {user?.patient?.identification_num}</Text>
            </View>
            <View style={styles.gridFooter}>
              <Text>{info?.description}</Text>
              <PdfImage src={Doclogo} style={styles.department} />
              <PdfImage src={Doclogo} style={styles.doctor} />
            </View>
          </View>
        ))}
      </Page>
    </Document>
  );
  // console.log(user?.patient);
  return user?.patient.Mediacalreports?.length > 0 ? (
    user?.patient.Mediacalreports.map((info) => (
      <Card
        sx={{
          backgroundImage: `url(https://mawthook.com/wp-content/uploads/2020/07/%D8%AA%D8%B1%D8%AC%D9%85%D8%A9-%D8%A7%D9%84%D9%85%D8%B5%D8%B7%D9%84%D8%AD%D8%A7%D8%AA-%D8%A7%D9%84%D8%B7%D8%A8%D9%8A%D8%A9.jpg)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundColor: 'rgba(255, 255, 255, 0.800)',
          backgroundBlendMode: 'lighten',
        }}
      >
        <Stack sx={{ p: 2, pb: 1, height: 150 }}>
          <Avatar
            alt={info?.name_english}
            src={Avatar}
            variant="rounded"
            sx={{ width: 48, height: 48, mb: 2 }}
          />
          <ListItemText
            primary={<Link color="black">{info?.department?.name_english}</Link>}
            primaryTypographyProps={{
              typography: 'subtitle1',
            }}
            secondaryTypographyProps={{
              mt: 1,
              component: 'span',
              typography: 'caption',
              color: 'text.disabled',
            }}
          />

          <Stack spacing={0.5} direction="row" alignItems="center" sx={{ typography: 'caption' }}>
            {fDate(info?.created_at)}
          </Stack>
          <PDFDownloadLink
            style={styles.pdf}
            document={<PrescriptionPDF medicines={[info]} />}
            fileName={`${user?.patient?.first_name} MediacalReport.pdf`}
          >
            {({ loading }) =>
              loading ? (
                'Loading document...'
              ) : (
                <Iconify style={styles.pdf2} icon="teenyicons:pdf-outline" />
              )
            }
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
              // info.patient.Mediacalreports?.employee
              label: 'THE EMPLOYEE NAME',
              icon: <Iconify width={16} icon="mdi:doctor" sx={{ flexShrink: 0 }} />,
            },
            {
              label: `${user?.patient?.first_name} ${user?.patient?.last_name}`,
              icon: <Iconify width={16} icon="fa:user" sx={{ flexShrink: 0 }} />,
            },
            {
              label: `ESG`,
              icon: (
                <Iconify width={16} icon="fa6-solid:file-prescription" sx={{ flexShrink: 0 }} />
              ),
            },
          ].map((item) => (
            <Stack
              key={item.label}
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
