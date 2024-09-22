import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Document, StyleSheet } from '@react-pdf/renderer';

import { fDmPdf } from 'src/utils/format-time';

import { useLocales, useTranslate } from 'src/locales';

// ----------------------------------------------------------------------
// eslint-disable-next-line
const { currentLang } = useLocales();
const curLangAr = currentLang.value === 'ar';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

Font.register({
  family: 'IBMPlexSansArabic',
  fonts: [
    { src: '/fonts/IBMPlexSansArabic-Regular.ttf' },
    { src: '/fonts/IBMPlexSansArabic-Regular.ttf' },
  ],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        alignCenter: { textAlign: 'center' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 7 },
        mb40: { marginBottom: 35 },
        h1: { fontSize: 30, fontWeight: 800 },
        h2: { fontSize: 20, fontWeight: 800, color: 'red' },
        h3: { fontSize: 12, fontWeight: 800 },

        subtitle1: {
          fontSize: 10,
          fontWeight: 700,
          flex: 1,
          borderBottom: '1px dashed',
          textAlign: 'center',
        },

        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: curLangAr ? 'IBMPlexSansArabic' : 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          textAlign: curLangAr ? 'right' : '',
          padding: '24px 40px 40px 24px',
          direction: curLangAr ? 'rtl' : 'ltr',
        },
        footer: {
          left: 0,
          right: 0,
          bottom: 0,
          padding: 24,
          margin: 'auto',
          borderTopWidth: 1,
          borderStyle: 'solid',
          position: 'absolute',
          borderColor: '#DFE3E8',
        },

        tableRow: {
          padding: '8px 0',
          flexDirection: curLangAr ? 'row-reverse' : 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

export default function InstructionsPdf({ Instructions }) {
  const { t } = useTranslate();

  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={[styles.h1, styles.mb8, styles.alignCenter]}>{t('Instructions')}</Text>
        <View style={{ alignItems: 'flex-start', flexDirection: 'column' }}>
          <Text style={[styles.h2]}>{Instructions?.adjustable_documents?.title} </Text>
          <Text style={[styles.h3]}>{Instructions?.adjustable_documents?.topic} </Text>
        </View>
        <View style={[styles.footer, styles.mb40]}>
          <Text style={[styles.subtitle1, styles.mb8, styles.tableRow]}>
            {fDmPdf(Instructions?.created_at)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

InstructionsPdf.propTypes = {
  Instructions: PropTypes.object,
};
