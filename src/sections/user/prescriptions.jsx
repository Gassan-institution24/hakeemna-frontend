import React, { useState, useEffect, useCallback } from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image as PdfImage,
} from '@react-pdf/renderer';

import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';

import { fDateAndTime } from 'src/utils/format-time';

import { useGetDrugs } from 'src/api';
import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';

import Iconify from 'src/components/iconify';

import Doclogo from '../../components/logo/doc.png';

export default function Prescriptions() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { user } = useAuthContext();
  const { t } = useTranslate();
  const { drugs } = useGetDrugs(user?.patient?._id);
  // console.log(drugs);
  function calculateAge(birthDate) {
    if (birthDate) {
      const today = new Date();
      const dob = new Date(birthDate);

      const age = today.getFullYear() - dob.getFullYear();
      if (age === 0) {
        return `${today.getMonth() - dob.getMonth()} months`;
      }
      return `${age} years`;
    }
    return '';
  }
  function calculateDuration(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const difference = end.getTime() - start.getTime();
    const daysDifference = Math.ceil(difference / (1000 * 3600 * 24));

    return daysDifference;
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 3600000);

    return () => clearInterval(intervalId);
  }, []);

  const styles = StyleSheet.create({
    icon: {
      color: 'blue',
      position: 'relative',
      top: '3px',
    },
    image: {
      width: '80px',
      height: '80px',
    },
    imgItem: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      fontSize: '15px',
    },
    departmentInfo: {
      textAlign: 'center',
      fontSize: 12,
      position: 'relative',
      top: '-10px',
      gap: 20,
    },
    page: {
      backgroundColor: 'aliceblue',
      border: 1,
    },
    gridContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      fontSize: '14px',
      position: 'relative',
      bottom: '-40px',
    },
    gridBody: {
      borderTop: 1,
      padding: '10px',
      gap: '10px',
      height: '100%',
      position: 'relative',
      top: '40px',
    },
    table: {
      display: 'table',
      width: 'auto',
      borderStyle: 'solid',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
    },
    tableRow: {
      margin: 'auto',
      flexDirection: 'row',
    },
    tableCol: {
      width: '25%',
      borderStyle: 'solid',
      borderWidth: 1,
      borderLeftWidth: 0,
      borderTopWidth: 0,
    },
    tableCell: {
      margin: 'auto',
      marginTop: 5,
      fontSize: 10,
      padding: 1,
    },
  });

  const PrescriptionPDF = useCallback(
    () => (
      <Document>
        <Page size="A4" style={styles.page}>
          {user?.patient.medicines.map((med, idx) => (
            <View key={idx}>
              <View style={styles.imgItem}>
                <PdfImage src={Doclogo} style={styles.image} />
                <Text>DOCTORNA HOSPITAL</Text>
                <PdfImage src={Doclogo} style={styles.image} />
              </View>
              <View style={styles.departmentInfo}>
                <Text>DR: Doctor Name</Text>
                <Text>Al Waha_cercle at0349</Text>
                <Text>+962776088372</Text>
              </View>
              <View style={styles.gridContainer}>
                <Text>Name: {user.userName}</Text>
                <Text>Age: {calculateAge(user?.patient.birth_date)}</Text>
                <Text>Date: {fDateAndTime(currentDate)}</Text>
              </View>
              <View style={styles.gridBody}>
                <View style={styles.table}>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>Name</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>Dose</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>Frequently</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>Duration</Text>
                    </View>
                  </View>
                  <View style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{med.medicines.trade_name}</Text>
                    </View>
                    {/* <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{med.dose}</Text>
                    </View> */}
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{med.Frequency_per_day}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>
                        {calculateDuration(med.Start_time, med.End_time)} Days
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </Page>
      </Document>
    ),
    [styles, currentDate, user]
  );

  return (
    <div>
      {drugs?.map((med, idx) => (
        <List key={idx} sx={{ bgcolor: 'aliceblue', mb:2 }}>
          <ListItem sx={{ mb: 1 }}>
            <ListItemAvatar sx={{ display: { xs: 'none', md: 'inline' } }}>
              <Avatar>
                <Iconify icon="streamline-emojis:pill" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t('Name')} secondary={med.medicines?.trade_name} sx={{ ml: 2 }} />
            {/* <ListItemText primary={t('Dose')} secondary={med?.dose} /> */}
            <ListItemText primary={t('Frequently')} secondary={med?.Frequency_per_day} />
            <ListItemText
              primary={t('Start Date')}
              secondary={fDateAndTime(med?.Start_time)}
              sx={{ display: { xs: 'none', md: 'inline' } }}
            />
            <ListItemText
              primary={t('End Date')}
              secondary={fDateAndTime(med?.End_time)}
              sx={{ display: { xs: 'none', md: 'inline' } }}
            />
            <PDFDownloadLink
              document={<PrescriptionPDF medicines={[med]} />}
              fileName={`${user?.patient?.name_english} prescription.pdf`}
            >
              {({ loading }) =>
                loading ? (
                  t('Loading document...')
                ) : (
                  <Iconify
                    icon="teenyicons:pdf-outline"
                    sx={{
                      color: { xs: 'green', md: 'blue' },
                      height: { xs: '25px', md: '25px' },
                      width: { xs: '25px', md: '25px' },
                      position: { md: 'relative' },
                      top: { md: '6px' },
                    }}
                  />
                )
              }
            </PDFDownloadLink>
          </ListItem>
        </List>
      ))}
    </div>
  );
}
