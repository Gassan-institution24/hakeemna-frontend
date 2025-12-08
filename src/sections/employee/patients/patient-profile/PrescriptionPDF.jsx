import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Page, View, Text, Image, Document, StyleSheet } from '@react-pdf/renderer';

import { fDate } from 'src/utils/format-time';

import { useLocales } from 'src/locales';

const formatTime = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${ampm}`;
};
const fixURL = (url) => {
    if (!url) return null;

    let newUrl = url.replace(/\\/g, "/");

    newUrl = newUrl.replace("https://localhost", "http://localhost");

    return newUrl;
};

const useStyles = () =>
    useMemo(
        () =>
            StyleSheet.create({
                page: {
                    paddingTop: 35,
                    paddingHorizontal: 40,
                    fontSize: 11,
                    backgroundColor: '#F7FAFF',
                    position: 'relative',
                },

                // HEADER
                title: {
                    fontSize: 22,
                    fontWeight: 900,
                    color: '#2a5d71',
                    marginBottom: 2,
                },

                subtitle: {
                    fontSize: 12,
                    color: '#2a5d71',
                    marginBottom: 8,
                },

                line: {
                    borderBottomWidth: 1,
                    borderColor: '#1f2c5b',
                    marginTop: 6,
                    marginBottom: 14,
                },

                // MAIN GRID
                row: {
                    flexDirection: 'row',
                    marginTop: 6,
                },

                leftCol: {
                    width: '38%',
                },

                rightCol: {
                    width: '62%',
                },

                // LEFT TITLES
                leftItemMain: {
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#2a5d71',
                    marginBottom: 12,
                },

                leftItem: {
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#2a5d71',
                    marginBottom: 9,
                },

                // RIGHT LABELS
                rightLabel: {
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: '#1f2c5b',
                    marginBottom: 10,
                },

                valueText: {
                    fontSize: 10.5,
                    fontWeight: 600,
                    color: '#000',
                },

                // MEDICINE SECTION
                medicineBlock: {
                    marginBottom: 14,
                    paddingBottom: 10,
                    borderBottomWidth: 1,
                    borderColor: '#D0D7E3',
                },

                medicineTitle: {
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#1f2c5b',
                    marginBottom: 5,
                },

                medicineField: {
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#2a5d71',
                    marginBottom: 3,
                },

                // DOCTOR COMMENT
                commentTitle: {
                    marginTop: 20,
                    fontSize: 13,
                    fontWeight: 700,
                    color: '#1f2c5b',
                },

                commentText: {
                    fontSize: 12,
                    color: '#000',
                    marginTop: 4,
                },

                // WATERMARK
                watermark: {
                    position: 'absolute',
                    top: 140,
                    left: 10,
                    width: 520,
                    opacity: 0.14,
                },

                // SIGNATURE & STAMP
                signStampContainer: {
                    position: 'absolute',
                    bottom: 115,
                    left: 80,
                    right: 80,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                },


                signStampLabel: {
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#1f2c5b',
                },

                // FOOTER
                footer: {
                    position: 'absolute',
                    bottom: 40,
                    left: 40,
                    right: 40,
                    borderTopWidth: 1,
                    borderColor: '#D0D7E3',
                    paddingTop: 10,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                },

                footerText: {
                    fontSize: 10,
                    fontWeight: 600,
                    color: '#2a5d71',
                    marginBottom: 4,
                },
                signImage: {
                    width: 120,
                    height: 80,
                    objectFit: "contain",
                },

                stampImage: {
                    width: 120,
                    height: 80,
                    objectFit: "contain",
                },

            }),
        []
    );

export default function PrescriptionPDF({ prescription }) {
    const styles = useStyles();
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    function calculateAge(birthDate) {
        if (birthDate) {
            const today = new Date();
            const dob = new Date(birthDate);

            const age = today.getFullYear() - dob.getFullYear();
            const months = today.getMonth() - dob.getMonth();

            if (age === 0) {
                return curLangAr ? `${months} شهر` : `${months} months`;
            }
            return curLangAr ? `${age} سنة` : `${age} years`;
        }
        return '';
    }
    const hasComments = prescription?.medicines?.some(
        (med) => med.Doctor_Comments && med.Doctor_Comments.trim() !== ""
    );

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                {/* WATERMARK */}
                <Image src="/favicon/512.png" style={styles.watermark} />

                {/* HEADER */}
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={styles.title}>Doctor Name: </Text>

                    <Text style={[styles.title, { fontSize: 20 }]}>
                        {prescription?.employee?.name_english || ''}
                    </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={styles.subtitle}>Major Name: </Text>

                    <Text style={[styles.subtitle, { fontSize: 12, fontWeight: 700 }]}>
                        {prescription?.employee?.speciality?.name_english || ''}
                    </Text>
                </View>

                <View style={styles.line} />

                {/* MAIN SECTION */}
                <View style={styles.row}>
                    <View style={styles.leftCol}>
                        <Text style={styles.leftItemMain}>Prescription</Text>
                        <Text style={styles.leftItem}>Patient Information</Text>
                        <Text style={styles.leftItem}>Report Details</Text>
                    </View>

                    <View style={styles.rightCol}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.rightLabel, { width: '50%' }]}>
                                Date of report:{' '}
                                <Text style={styles.valueText}>
                                    {prescription?.created_at ? fDate(prescription?.created_at, "dd MMM yyyy") : ''}
                                </Text>
                            </Text>

                            <Text style={[styles.rightLabel, { width: '50%' }]}>
                                Date of visit:{' '}
                                <Text style={styles.valueText}>
                                    {prescription?.created_at ? fDate(prescription?.created_at, "dd MMM yyyy") : ''}
                                </Text>
                            </Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 8 }}>
                            <Text style={[styles.rightLabel, { width: '50%' }]}>
                                Name:{' '}
                                <Text style={styles.valueText}>{prescription?.patient?.name_english || ''}</Text>
                            </Text>

                            <Text style={[styles.rightLabel, { width: '50%' }]}>
                                Age: <Text style={styles.valueText}>{calculateAge(prescription?.patient?.birth_date)}</Text>
                            </Text>

                        </View>
                    </View>
                </View>

                {/* MEDICINES SECTION */}
                <View style={{ marginTop: 25 }}>
                    {prescription?.medicines?.map((med, idx) => (
                        <View key={idx} style={styles.medicineBlock}>
                            <Text style={[styles.medicineTitle, { color: "#000" }]}>
                                {med.medicines?.trade_name || ''} {med.medicines?.concentration || ''}
                            </Text>

                            <Text style={[styles.medicineField, { color: "#000" }]}>
                                Frequency: {med.Frequency_per_day || ''}
                            </Text>

                            <Text style={[styles.medicineField, { color: "#000" }]}>
                                Start: {med.Start_time ? fDate(med.Start_time) : ''}
                            </Text>

                            <Text style={[styles.medicineField, { color: "#000" }]}>
                                End: {med.End_time ? fDate(med.End_time) : ''}
                            </Text>
                        </View>
                    ))}
                </View>


                {/* DOCTOR COMMENT */}
                {hasComments && (
                    <View>
                        <Text style={styles.commentTitle}>Doctor Comment</Text>

                        {prescription?.medicines?.map((med, idx) => (
                            med.Doctor_Comments ? (
                                <Text key={idx} style={styles.commentText}>
                                    {med.Doctor_Comments}
                                </Text>
                            ) : null
                        ))}
                    </View>
                )}


                {/* SIGNATURE & STAMP */}
                <View style={styles.signStampContainer}>

                    {/* SIGNATURE */}
                    <View style={{ alignItems: 'center' }}>
                        {prescription?.employee?.signature && (
                            <Image
                                src={fixURL(prescription.employee.signature)}
                                style={styles.signImage}
                            />
                        )}
                        <Text style={styles.signStampLabel}>SIGNATURE</Text>
                    </View>

                    {/* STAMP */}
                    <View style={{ alignItems: 'center' }}>
                        {prescription?.employee?.stamp && (
                            <Image
                                src={fixURL(prescription.employee.stamp)}
                                style={styles.stampImage}
                            />
                        )}
                        <Text style={styles.signStampLabel}>STAMP</Text>
                    </View>

                </View>


                {/* FOOTER */}
                <View style={styles.footer}>

                    {/* COLUMN 1 */}
                    <View>
                        <Text style={styles.footerText}>
                            Phone: {prescription?.unit_service?.phone || '---'}
                        </Text>

                        <Text style={styles.footerText}>
                            Working hours:
                            {formatTime(prescription?.unit_service?.work_start_time)} {' — '}
                            {formatTime(prescription?.unit_service?.work_end_time)}
                        </Text>

                    </View>

                    {/* COLUMN 2 */}
                    <View>
                        <Text style={styles.footerText}>
                            Email: {prescription?.unit_service?.email || '---'}
                        </Text>
                        {prescription?.unit_service?.mobile_num && (
                            <Text style={styles.footerText}>
                                Relative Phone No.: {prescription.unit_service.mobile_num}
                            </Text>
                        )}

                    </View>

                    {/* COLUMN 3 */}
                    <View>
                        <Text style={styles.footerText}>
                            Address: {prescription?.unit_service?.address || '---'}
                        </Text>
                    </View>

                </View>

            </Page>
        </Document>
    );
}

PrescriptionPDF.propTypes = {
    prescription: PropTypes.object,
};
