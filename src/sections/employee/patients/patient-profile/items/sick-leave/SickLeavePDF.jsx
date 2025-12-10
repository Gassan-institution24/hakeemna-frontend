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
                    marginBottom: 6,
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

export default function SickLeavePDF({ sickleave }) {
    const styles = useStyles();
    const { currentLang } = useLocales();
    const curLangAr = currentLang.value === 'ar';

    function cleanDescription(encoded) {
        if (!encoded) return "";

        // decode HTML entities
        const txt = document.createElement("textarea");
        txt.innerHTML = encoded;
        const decoded1 = txt.value;
        txt.innerHTML = decoded1;
        const decoded2 = txt.value;

        // remove HTML tags manually — because React-PDF does NOT support HTML
        return decoded2.replace(/<\/?[^>]+(>|$)/g, "");
    }

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
    return (
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* WATERMARK */}
                    <Image src="/favicon/512.png" style={styles.watermark} />
    
                    {/* HEADER */}
                    <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                        <Text style={styles.title}>Doctor Name: </Text>
    
                        <Text style={[styles.title, { fontSize: 20 }]}>
                        {sickleave?.employee?.name_english || ''}
                        </Text>
                    </View>
    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={styles.subtitle}>Major Name: </Text>
    
                        <Text style={[styles.subtitle, { fontSize: 12, fontWeight: 700 }]}>
                        {sickleave?.employee?.speciality?.name_english || ''}
                        </Text>
                    </View>
    
                    <View style={styles.line} />
    
                    {/* MAIN SECTION */}
                    <View style={styles.row}>
                        <View style={styles.leftCol}>
                        <Text style={styles.leftItemMain}>Sick Leave report </Text>
                            <Text style={styles.leftItem}>Patient Information</Text>
                            <Text style={styles.leftItem}>Report Details</Text>
                        </View>
    
                        <View style={styles.rightCol}>
                            <View style={{ flexDirection: 'row' }}>
                                <Text style={[styles.rightLabel, { width: '50%' }]}>
                                    Date of report:{' '}
                                    <Text style={styles.valueText}>
                                    {sickleave?.created_at ? fDate(sickleave?.created_at, "dd MMM yyyy") : ''}
                                    </Text>
                                </Text>
    
                                <Text style={[styles.rightLabel, { width: '50%' }]}>
                                    Date of visit:{' '}
                                    <Text style={styles.valueText}>
                                    {sickleave?.created_at ? fDate(sickleave?.created_at, "dd MMM yyyy") : ''}
                                    </Text>
                                </Text>
                            </View>
    
                            <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                <Text style={[styles.rightLabel, { width: '50%' }]}>
                                    Name:{' '}
                                <Text style={styles.valueText}>{sickleave?.patient?.name_english || ''}</Text>
                                </Text>
    
                                <Text style={[styles.rightLabel, { width: '50%' }]}>
                                Age: <Text style={styles.valueText}>{calculateAge(sickleave?.patient?.birth_date)}</Text>
                                </Text>
    
                            </View>
                        </View>
                    </View>
    
                {/* SICK LEAVE DETAILS */}
                <View style={{ marginTop: 25 }}>

                    <Text style={{ fontSize: 14, fontWeight: 700, color: '#1f2c5b', marginBottom: 10 }}>
                        Sick Leave Details
                    </Text>

                    {/* START DATE */}
                    <Text style={{ fontSize: 12, marginBottom: 4 }}>
                        Start of Sick Leave:
                        <Text style={{ fontWeight: 600 }}> {fDate(sickleave?.Medical_sick_leave_start, "dd MMM yyyy")}</Text>
                    </Text>

                    {/* END DATE */}
                    <Text style={{ fontSize: 12, marginBottom: 10 }}>
                        End of Sick Leave:
                        <Text style={{ fontWeight: 600 }}> {fDate(sickleave?.Medical_sick_leave_end, "dd MMM yyyy")}</Text>
                    </Text>

                    {/* DESCRIPTION — ONLY IF EXISTS */}
                    {sickleave?.description && sickleave.description.trim() !== "" && (
                        <>
                            <Text style={{ fontSize: 13, fontWeight: 700, color: '#1f2c5b', marginBottom: 4 }}>
                                Doctor Note:
                            </Text>

                            <Text style={{ fontSize: 12, lineHeight: 1.5 }}>
                                {cleanDescription(sickleave.description)}
                            </Text>

                        </>
                    )}

                </View>

                    
                    
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab eaque ipsam impedit, fugit pariatur illum eius magnam, ipsa explicabo minima expedita ut eligendi porro facere nesciunt. Ex quidem eos odit.
                   
                    {/* SIGNATURE & STAMP */}
                    <View style={styles.signStampContainer}>
    
                        {/* SIGNATURE */}
                        <View style={{ alignItems: 'center' }}>
                        {sickleave?.employee?.signature && (
                                <Image
                                src={sickleave.employee.signature.replace(/\\/g, '/')}
                                    style={styles.signImage}
                                />
                            )}
                            <Text style={styles.signStampLabel}>SIGNATURE</Text>
                        </View>
    
                        {/* STAMP */}
                        <View style={{ alignItems: 'center' }}>
                        {sickleave?.employee?.stamp && (
                                <Image
                                src={sickleave.employee.stamp.replace(/\\/g, '/')}
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
                            Phone: {sickleave?.unit_services?.phone || '---'}
                            </Text>
    
                            <Text style={styles.footerText}>
                                Working hours:
                            {formatTime(sickleave?.unit_services?.work_start_time)} {' — '}
                            {formatTime(sickleave?.unit_services?.work_end_time)}
                            </Text>
    
                        </View>
    
                        {/* COLUMN 2 */}
                        <View>
                            <Text style={styles.footerText}>
                            Email: {sickleave?.unit_services?.email || '---'}
                            </Text>
                        {sickleave?.unit_services?.mobile_num && (
                                <Text style={styles.footerText}>
                                Relative Phone No.: {sickleave.unit_services.mobile_num}
                                </Text>
                            )}
                            
                        </View>
    
                        {/* COLUMN 3 */}
                        <View>
                            <Text style={styles.footerText}>
                            Address: {sickleave?.unit_services?.address || '---'}
                            </Text>
                        </View>
    
                    </View>
    
                </Page>
            </Document>
        );
}
SickLeavePDF.propTypes = {
    sickleave: PropTypes.object,
};
