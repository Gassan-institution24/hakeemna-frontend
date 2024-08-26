import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Font, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';

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
        mb4: { marginBottom: 4 },
        mb8: { marginBottom: 8 },
        mb40: { marginBottom: 40 },
        h3: { fontSize: 16, fontWeight: 700 },
        h4: { fontSize: 13, fontWeight: 700 },
        body1: { fontSize: 10 },
        body2: { fontSize: 9 },
        subtitle1: { fontSize: 10, fontWeight: 700 },
        subtitle2: { fontSize: 9, fontWeight: 700 },
        alignRight: { textAlign: curLangAr ? 'left' : 'right' },
        page: {
          fontSize: 9,
          lineHeight: 1.6,
          fontFamily: curLangAr ? 'IBMPlexSansArabic' : 'Roboto',
          backgroundColor: '#FFFFFF',
          textTransform: 'capitalize',
          textAlign: curLangAr ? 'right' : '',
          padding: '40px 24px 120px 24px',
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
        table: {
          display: 'flex',
          width: 'auto',
          // flexDirection: curLangAr ? 'row-reverse' : 'row',
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

export default function InvoicePDF({ invoice, currentStatus }) {
  const {
    Provided_services,
    provided_products,
    Total_tax_Amount,
    dueDate,
    Total_discount_amount,
    Total_deduction_amount,
    stakeholder,
    patient,
    created_at,
    Total_Amount,
    unit_service,
    sequence_number,
    Subtotal_Amount,
  } = invoice;

  const { t } = useTranslate();

  const styles = useStyles();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.gridContainer, styles.mb40]}>
          <Image
            source={stakeholder?.company_logo ? stakeholder?.company_logo : '/logo/logo_single.svg'}
            style={{ width: 48, height: 48 }}
          />

          <View style={{ alignItems: 'flex-end', flexDirection: 'column' }}>
            <Text style={styles.h3}>{t(currentStatus)}</Text>
            <Text> {sequence_number} </Text>
          </View>
        </View>

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>{t('from')}</Text>
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
              <Text style={styles.body2}>{unit_service.phone}</Text>
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

        <View style={[styles.gridContainer, styles.mb40]}>
          <View style={styles.col6}>
            <Text style={[styles.subtitle2, styles.mb4]}>{t('date')}</Text>
            <Text style={styles.body2}>{fDate(created_at)}</Text>
          </View>
          {dueDate && (
            <View style={styles.col6}>
              <Text style={[styles.subtitle2, styles.mb4]}>{t('due date')}</Text>
              <Text style={styles.body2}>{fDate(dueDate)}</Text>
            </View>
          )}
        </View>

        <Text style={[styles.subtitle1, styles.mb8]}>{t('details')}</Text>

        <View style={styles.table}>
          <View>
            <View style={styles.tableRow}>
              <View style={styles.tableCell_1}>
                <Text style={styles.subtitle2}>#</Text>
              </View>

              <View style={styles.tableCell_2}>
                <Text style={styles.subtitle2}>{t('items')}</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>{t('quantity')}</Text>
              </View>

              <View style={styles.tableCell_3}>
                <Text style={styles.subtitle2}>{t('price per unit')}</Text>
              </View>

              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.subtitle2}>{t('total')}</Text>
              </View>
            </View>
          </View>

          <View>
            {Provided_services?.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.title}</Text>
                  <Text>
                    {curLangAr ? item.service_type?.name_arabic : item.service_type?.name_english}
                  </Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.quantity}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.price_per_unit}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item.income_amount)}</Text>
                </View>
              </View>
            ))}
            {provided_products?.map((item, index) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={styles.tableCell_1}>
                  <Text>{index + 1}</Text>
                </View>

                <View style={styles.tableCell_2}>
                  <Text style={styles.subtitle2}>{item.title}</Text>
                  <Text>{curLangAr ? item.product?.name_arabic : item.product?.name_english}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.quantity}</Text>
                </View>

                <View style={styles.tableCell_3}>
                  <Text>{item.price_per_unit}</Text>
                </View>

                <View style={[styles.tableCell_3, styles.alignRight]}>
                  <Text>{fCurrency(item.income_amount)}</Text>
                </View>
              </View>
            ))}

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>{t('subtotal')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(Subtotal_Amount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>{t('discount')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(-Total_discount_amount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>{t('deductions')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(Total_deduction_amount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text>{t('taxes')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text>{fCurrency(Total_tax_Amount)}</Text>
              </View>
            </View>

            <View style={[styles.tableRow, styles.noBorder]}>
              <View style={styles.tableCell_1} />
              <View style={styles.tableCell_2} />
              <View style={styles.tableCell_3} />
              <View style={styles.tableCell_3}>
                <Text style={styles.h4}>{t('total')}</Text>
              </View>
              <View style={[styles.tableCell_3, styles.alignRight]}>
                <Text style={styles.h4}>{fCurrency(Total_Amount)}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* <View style={[styles.gridContainer, styles.footer]} fixed>
          <View style={styles.col8}>
            <Text style={styles.subtitle2}>NOTES</Text>
            <Text>
              We appreciate your business. Should you need us to add VAT or extra notes let us know!
            </Text>
          </View>
          <View style={[styles.col4, styles.alignRight]}>
            <Text style={styles.subtitle2}>Have a Question?</Text>
            <Text>support@abcapp.com</Text>
          </View>
        </View> */}
      </Page>
    </Document>
  );
}

InvoicePDF.propTypes = {
  currentStatus: PropTypes.string,
  invoice: PropTypes.object,
};
