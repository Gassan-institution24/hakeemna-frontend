import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import {
  Page,
  Text,
  View,
  Document,
  PDFDownloadLink,
  StyleSheet,
  Image as PdfImage,
} from '@react-pdf/renderer';
import Iconify from 'src/components/iconify';
import { useAuthContext } from 'src/auth/hooks';
import { fDate } from 'src/utils/format-time';
import Doclogo from '../../components/logo/doc.png';

export default function Prescriptions() {
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
    page: {
      backgroundColor: 'aliceblue',
      border: 1,
    },

    gridContainer: {
      border: 1,
      display: 'grid',
      gridTemplateColumns:'auto auto',
      padding: '10px',
      gap:'10px',
      marginBottom: 10,
      alignItems: 'center',
      fontSize: 12,
    },
    gridContainer2: {
      border: 1,
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: 10,
      marginBottom: 10,
      padding: 10,
      fontSize: 12,
    },
    gridFooter: {
      border: 1,
      display: 'grid',
      gridTemplateColumns: '1fr',
      gap: 10,
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 10,
      paddingRight: 10,
      fontSize: 12,
    },
  });

  const PrescriptionPDF = () => (
    <Document>
      <Page size="A4" style={styles.page}>
        {user.patient.medicines.map((med) => (
          <View key={med.id}>
            <View style={styles.gridContainer}>
             <PdfImage src={Doclogo} style={styles.image} />
              <Text>Patient Name: {user.userName}</Text>
              <Text>Doctor Name: doctor</Text>
              <Text>Doctor Name: doctor</Text>
              <Text>Doctor Name: doctor</Text>
              <Text>Doctor Name: doctor</Text>
            </View>
            <View style={styles.gridContainer2}>
              <Text>Patient Name: {user.userName}</Text>
              <Text>Doctor Name: doctor</Text>
              <Text>Doctor Name: doctor</Text>
              <Text>Doctor Name: doctor</Text>
              <Text>Doctor Name: doctor</Text>
            </View>
            <View style={styles.gridFooter}>
              <Text>Patient Name: {user.userName}</Text>
              <Text>Doctor Name: doctor</Text>
              <Text>Doctor Name: doctor</Text>
              <Text>Doctor Name: doctor</Text>
              <Text>Doctor Name: doctor</Text>
            </View>
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
              {({ loading }) =>
                loading ? 'Loading document...' : <Iconify icon="teenyicons:pdf-outline" />
              }
            </PDFDownloadLink>
          </ListItem>
        </List>
      ))}
    </div>
  );
}
