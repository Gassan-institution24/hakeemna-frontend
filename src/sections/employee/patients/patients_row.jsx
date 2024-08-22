import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';

import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import {
  useGetAppointmentTypes,
  useGetUSActiveWorkGroups,
  useGetUSActiveWorkShifts,
} from 'src/api';

// ----------------------------------------------------------------------

export default function USPatientsTableRow({ row, selected }) {
  const { _id, file_code, work_group, patient, name_english, name_arabic } = row;
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const router = useRouter();
  const { user } = useAuthContext();

  const { appointmenttypesData } = useGetAppointmentTypes();

  const { workGroupsData } = useGetUSActiveWorkGroups(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service?._id
  );
  const { workShiftsData } = useGetUSActiveWorkShifts(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service._id
  );

  const renderPrimary = (
    <TableRow hover selected={selected}>
      <TableCell align="center">
        {patient?.nationality?.code ? String(patient?.nationality?.code).padStart(3, '0') : ''}-{patient?.sequence_number}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(paths.employee.patients.info(_id))}
        align="center"
      >
        {name_english || patient?.name_english}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(paths.employee.patients.info(_id))}
        align="center"
      >
        {name_arabic || patient?.name_arabic}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(paths.employee.patients.info(_id))}
        align="center"
      >
        {curLangAr ? work_group?.name_arabic : work_group?.name_english}
      </TableCell>
      <TableCell
        sx={{
          cursor: 'pointer',
          color: '#3F54EB',
        }}
        onClick={() => router.push(paths.employee.patients.info(_id))}
        align="center"
      >
        {file_code}
      </TableCell>
    </TableRow>
  );

  const NewUserSchema = Yup.object().shape({
    note: Yup.string(),
    work_shift: Yup.string().required(t('required field')),
    work_group: Yup.string().required(t('required field')),
    service_types: Yup.array(),
    appointment_type: Yup.string().required(t('required field')),
    start_time: Yup.date().required(t('required field')),
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
      appointment_type: appointmenttypesData?.[0]?._id,
      start_time: new Date(),
      work_group: workGroupsData?.[0]?._id,
      work_shift: workShiftsData.filter((one) => {
        const currentDate = new Date();

        const startTime = new Date(currentDate);
        startTime.setHours(
          new Date(one.start_time).getHours(),
          new Date(one.start_time).getMinutes(),
          0,
          0
        );

        const endTime = new Date(currentDate);
        endTime.setHours(
          new Date(one.end_time).getHours(),
          new Date(one.end_time).getMinutes(),
          0,
          0
        );
        if (startTime.getTime() <= endTime.getTime()) {
          return (
            currentDate.getTime() >= startTime.getTime() &&
            currentDate.getTime() < endTime.getTime()
          );
        }
        // If the shift crosses midnight
        const endTimeNextDay = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
        return (
          currentDate.getTime() >= startTime.getTime() ||
          currentDate.getTime() < endTimeNextDay.getTime()
        );
      })?.[0]?._id,
      service_types: [],
    }),
    [workGroupsData, workShiftsData, appointmenttypesData]
  );

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(NewUserSchema),
    defaultValues,
  });

  const { reset } = methods;

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <>
      {renderPrimary}
    </>
  );
}

USPatientsTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
};
