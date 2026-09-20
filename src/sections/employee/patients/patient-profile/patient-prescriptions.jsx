import React from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

import {
  Box,
  Table,
  Tooltip,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  IconButton,
} from '@mui/material';

import { fDate } from 'src/utils/format-time';
import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetPrescription } from 'src/api';
import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import ProfilePane from 'src/sections/shared/patient-profile/profile-pane';
import RecordCard, { RecordGrid } from 'src/sections/shared/patient-profile/record-card';

import PdfPreviewDialogPrescriptionPDF from './prescription-pdf';
import PrescriptionUpload from './items/presecription/prescription-upload';

export default function PatientPrescriptions({ patient }) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const { enqueueSnackbar } = useSnackbar();

  const { user } = useAuthContext();
  const { prescriptionData, loading, error, refetch } = useGetPrescription({
    unit_service:
      user?.employee?.employee_engagements?.[user.employee.selected_engagement]?.unit_service?._id,
    patient: patient?.patient?._id,
    unit_service_patient: patient?._id,
    populate: { path: 'medicines', populate: 'medicines' },
  });

  const [showAdd, setShowAdd] = React.useState(false);
  const [openPreview, setOpenPreview] = React.useState(false);
  const [selectedReport, setSelectedReport] = React.useState(null);

  const rows = Array.isArray(prescriptionData) ? prescriptionData : [];

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(endpoints.prescription.one(id));
      enqueueSnackbar(`${t('prescription')} ${t('deleted successfully')}`);
      refetch();
    } catch (e) {
      enqueueSnackbar(curLangAr ? e.arabic_message || e.message : e.message, { variant: 'error' });
    }
  };

  const openPdfDialog = (report) => {
    setSelectedReport(report);
    setOpenPreview(true);
  };

  return (
    <>
      <ProfilePane
        icon="solar:pills-bold-duotone"
        title={t('Prescriptions')}
        count={rows.length}
        loading={loading}
        error={error}
        isEmpty={!rows.length}
        emptyTitle={t('No prescriptions')}
        emptyDescription={t('Prescriptions issued to this patient appear here.')}
        addLabel={t('New Prescription')}
        adding={showAdd}
        onToggleAdd={() => setShowAdd((open) => !open)}
        form={
          <PrescriptionUpload
            patient={patient}
            refetch={() => {
              setShowAdd(false);
              refetch();
            }}
          />
        }
      >
        <RecordGrid min={520}>
          {rows.map((one) => {
            const medicines = Array.isArray(one.medicines) ? one.medicines : [];

            return (
              <RecordCard
                key={one._id}
                icon="solar:pills-bold-duotone"
                title={fDate(one.created_at)}
                badge={
                  /* The count belongs on the card: it is the one fact you want
                     before deciding whether to open the print view. */
                  <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                    {`${medicines.length} ${t('medicines')}`}
                  </Typography>
                }
                actions={
                  <>
                    {/* Re-keyed on language so the PDF button re-renders when the
                        document direction changes. */}
                    <Box key={currentLang.value}>
                      <Tooltip title={t('Print')}>
                        <IconButton color="primary" onClick={() => openPdfDialog(one)}>
                          <Iconify icon="solar:printer-minimalistic-bold" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Tooltip title={t('delete')}>
                      <IconButton color="error" onClick={() => handleDelete(one?._id)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </IconButton>
                    </Tooltip>
                  </>
                }
              >

                {/* Was a four-column CSS grid of loose Typography, whose header row
                    showed even for a prescription with no medicines and whose rows
                    were unkeyed fragments. A real table keeps columns aligned when
                    a trade name wraps, and disappears when there is nothing in it. */}
                {medicines.length > 0 && (
                  <Scrollbar>
                    <Table size="small" sx={{ minWidth: 560 }}>
                      <TableHead>
                        <TableRow>
                          <TableCell>{t('trade name')}</TableCell>
                          <TableCell>{t('frequently')}</TableCell>
                          <TableCell>{t('start date')}</TableCell>
                          <TableCell>{t('end date')}</TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {medicines.map((medicine, index) => (
                          <TableRow key={medicine?._id || index}>
                            <TableCell>
                              {[medicine?.medicines?.trade_name, medicine?.medicines?.concentration]
                                .filter(Boolean)
                                .join(' - ') || '-'}
                            </TableCell>
                            <TableCell>{medicine?.Frequency_per_day || '-'}</TableCell>
                            <TableCell>
                              {medicine?.Start_time ? fDate(medicine.Start_time) : '-'}
                            </TableCell>
                            <TableCell>
                              {medicine?.End_time ? fDate(medicine.End_time) : '-'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Scrollbar>
                )}
              </RecordCard>
            );
          })}
        </RecordGrid>
      </ProfilePane>

      <PdfPreviewDialogPrescriptionPDF
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        report={selectedReport}
      />
    </>
  );
}
PatientPrescriptions.propTypes = { patient: PropTypes.object };
