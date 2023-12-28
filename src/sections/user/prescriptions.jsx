import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Page, Text, View, Document, PDFDownloadLink, StyleSheet } from '@react-pdf/renderer';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import { fDate } from 'src/utils/format-time';

export default function Prescriptions() {
  const { user } = useAuthContext();
  const styles = StyleSheet.create({
    document: {
      fontFamily: 'Arial',
      fontSize: 15,
    },
    page: {
      flexDirection: 'column',
      alignItems: 'flex-start',
      padding: 20,
    },
    view: {
      marginBottom: 10,
      border: 1,
      padding: 10,
      backgroundColor: 'aliceblue',
    },
    text: {
      marginBottom: 5,
    },
    icon: {
      color: 'blue',
      fontWeight: 600,
      fontSize: 24, 
    },
  });
  const PrescriptionPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {user.patient.medicines.map((med) => (
          <View key={med.id} style={styles.view}>
            <Text style={styles.text}>Name: {med.medicine.trade_name}</Text>
            <Text style={styles.text}>Dose: {med.dose}</Text>
            <Text style={styles.text}>Frequently: {med.frequently}</Text>
            <Text style={styles.text}>Start Date: {fDate(med.startdate)}</Text>
            <Text style={styles.text}>End Date: {fDate(med.enddate)}</Text>
          </View>
        ))}
      </Page>
    </Document>
  );

  return (
    <div>
      {user.patient.medicines.map((med) => (
        <List key={med.id} sx={{ bgcolor: 'aliceblue' }}>
          <ListItem sx={{ mb: 1 }}>
            <ListItemAvatar>
              <Avatar>
                <Iconify icon="streamline-emojis:pill" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary="Name" secondary={med.medicine.trade_name} sx={{ ml: 2 }} />
            <ListItemText primary="Dose" secondary={med.dose} />
            <ListItemText primary="Frequently" secondary={med.frequently} />
            <ListItemText primary="Start Date" secondary={fDate(med.startdate)} />
            <ListItemText primary="End Date" secondary={fDate(med.enddate)} />
            <PDFDownloadLink
              document={<PrescriptionPDF medicines={[med]} />}
              fileName={`${user.patient.first_name} prescription.pdf`}
            >
              {({ loading }) => (loading ? 'Loading document...' : <Iconify icon='teenyicons:pdf-outline' style={styles.icon}/>)}
            </PDFDownloadLink>
          </ListItem>
        </List>
      ))}
    </div>
  );
}
