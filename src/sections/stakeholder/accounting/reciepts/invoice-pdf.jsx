import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import { NumberToText } from 'src/utils/number-to-words';

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
        col4: { width: '25%' },
        col8: { width: '75%' },
        col6: { width: '50%' },
        flex1: { flex: 1 },
        alignCenter: { textAlign: 'center' },
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 7 },
        mb40: { marginBottom: 35 },
        h2: { fontSize: 20, fontWeight: 800 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: {
          fontSize: 10,
          fontWeight: 700,
          flex: 1,
          borderBottom: '1px dashed',
          textAlign: 'center',
        },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        alignRight: { textAlign: curLangAr ? 'left' : 'right' },
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
        gridContainer: {
          justifyContent: 'space-between',
          flexDirection: curLangAr ? 'row-reverse' : 'row',
        },
        flexContainer: {
          alignItems: 'center',
          flexDirection: curLangAr ? 'row-reverse' : 'row',
        },
        table: {
          display: 'flex',
          width: 'auto',
        },
        tableRow: {
          padding: '8px 0',
          flexDirection: curLangAr ? 'row-reverse' : 'row',
          borderBottomWidth: 1,
          borderStyle: 'solid',
          borderColor: '#DFE3E8',
        },
        noBorder: {
          paddingTop: 8,
          paddingBottom: 0,
          borderBottomWidth: 0,
        },
        tableCell_1: {
          width: '5%',
        },
        tableCell_2: {
          width: '50%',
          paddingRight: 16,
        },
        tableCell_3: {
          width: '15%',
        },
      }),
    []
  );

// ----------------------------------------------------------------------

export default function InvoicePDF({ invoice, currentStatus, paidAmount }) {
  const { patient, stakeholder, created_at, unit_service, sequence_number } = invoice;

  const { t } = useTranslate();

  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <Text style={[styles.h2, styles.mb8, styles.alignCenter]}>{t('receipt voucher')}</Text>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image
            source={stakeholder?.company_logo ? stakeholder?.company_logo : '/logo/logo_single.svg'}
            style={{ width: 48, height: 48 }}
          />

          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text> {sequence_number} </Text>
            <Text style={styles.h3}>{fCurrency(invoice?.payment_amount)}</Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>{t('date')}</Text>
            <Text style={styles.body2}>{fDate(created_at)}</Text>
          </View>
        </View>

        <View />

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>{t('to')}</Text>
            <Text style={styles.body2}>
              {curLangAr ? stakeholder.name_arabic : stakeholder.name_english}
            </Text>
            <Text style={styles.body2}>{stakeholder.address}</Text>
            <Text style={styles.body2}>{stakeholder.phone}</Text>
          </View>

          {unit_service && (
            <View style={styles.col6}>
              <Text style={[styles.subtitle2, styles.mb4]}>{t('to')}</Text>
              <Text style={styles.body2}>
                {curLangAr ? unit_service.name_arabic : unit_service.name_english}
              </Text>
              <Text style={styles.body2}>{unit_service.address}</Text>
              <Text style={styles.body2}>{unit_service.mobile_num1}</Text>
            </View>
          )}

          {patient && (
            <View style={styles.col6}>
              <Text style={[styles.subtitle2, styles.mb4]}>{t('to')}</Text>
              <Text style={styles.body2}>
                {curLangAr ? patient.name_arabic : patient.name_english}
              </Text>
              <Text style={styles.body2}>{patient.address}</Text>
              <Text style={styles.body2}>{patient.mobile_num1}</Text>
            </View>
          )}
        </View>
        <View style={[styles.flexContainer, styles.mb8]}>
          <Text style={[styles.body1, styles.mb8]}>{t('we have recieved from mr./m/s')}:</Text>
          <Text style={[styles.subtitle1, styles.mb8, styles.tableRow]}>
            {curLangAr
              ? patient?.name_arabic || unit_service?.name_arabic
              : patient?.name_english || unit_service?.name_english}
          </Text>
        </View>
        <View style={[styles.flexContainer, styles.mb8]}>
          <Text style={[styles.body1, styles.mb8]}>{t('the sum of')}:</Text>
          <Text style={[styles.subtitle1, styles.mb8, styles.tableRow]}>
            {fCurrency(invoice?.payment_amount)} {NumberToText(invoice?.payment_amount)}
          </Text>
        </View>
        <View style={[styles.flexContainer, styles.mb8]}>
          <Text style={[styles.body1, styles.mb8]}>{t('for the economic movement number')}:</Text>
          <Text style={[styles.subtitle1, styles.mb8, styles.tableRow]}>
            {invoice?.economic_movement?.sequence_number}-{fDate(invoice?.created_at, 'yyyy')}
          </Text>
        </View>
        <View style={[styles.flexContainer, styles.mb8]}>
          <View style={[styles.flexContainer, styles.mb8, styles.flex1]}>
            <Text style={[styles.body1, styles.mb8]}>{t('total economic movement amount')}:</Text>
            <Text style={[styles.subtitle1, styles.mb8, styles.tableRow]}>
              {fCurrency(invoice?.economic_movement?.Total_Amount)}
            </Text>
          </View>
          <View style={[styles.flexContainer, styles.mb8, styles.flex1]}>
            <Text style={[styles.body1, styles.mb8]}>{t('total paid amount')}:</Text>
            <Text style={[styles.subtitle1, styles.mb8, styles.tableRow]}>
              {fCurrency(paidAmount)}
            </Text>
          </View>
        </View>
        <View style={[styles.flexContainer, styles.mb40]}>
          <Text style={[styles.body1, styles.mb8]}>{t('remaind amount')}:</Text>
          <Text style={[styles.subtitle1, styles.mb8, styles.tableRow]}>
            {fCurrency(invoice.economic_movement.Total_Amount - paidAmount)}
          </Text>
        </View>
      </Page>
    </Document>
  );
}

InvoicePDF.propTypes = {
  currentStatus: PropTypes.string,
  invoice: PropTypes.object,
  paidAmount: PropTypes.number,
};
