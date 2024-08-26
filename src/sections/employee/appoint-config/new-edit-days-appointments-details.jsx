import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import { RHFSelect, RHFCheckbox, RHFTimePicker } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewEditDayAppointmentsDetails({
  ParentIndex,
  open,
  appointmenttypesData,
  setAppointmentsNum,
}) {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const { control, setValue, watch } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `days_details[${ParentIndex}].appointments`,
  });

  const values = watch();

  const handleAdd = () => {
    const defaultItem = {
      appointment_type: null,
      start_time: null,
      price: null,
      online_available: true,
      service_types: [],
    };
    const existingData = values.days_details[ParentIndex].appointments
      ? values.days_details[ParentIndex].appointments[
          values.days_details[ParentIndex].appointments.length - 1
        ]
      : null;
    const start_time = new Date(
      existingData ? existingData?.start_time : values.days_details[ParentIndex].work_start_time
    );
    if (existingData) {
      start_time.setMinutes(start_time.getMinutes() + values.appointment_time);
    }

    const newItem = {
      ...defaultItem,
      ...existingData,
      start_time,
    };
    append(newItem);
    setAppointmentsNum((prev) => ({ ...prev, [ParentIndex]: prev[ParentIndex] + 1 }));
  };

  const handleRemove = (index) => {
    remove(index);
    setAppointmentsNum((prev) => ({ ...prev, [ParentIndex]: prev[ParentIndex] - 1 }));
  };
  return (
    // <Dialog maxWidth="sm" open={open}>
    <Collapse in={open} timeout="auto" unmountOnExit sx={{ bgcolor: 'background.neutral' }}>
      <Box sx={{ px: 2, pb: 0 }}>
        {values.days_details[ParentIndex]?.appointments?.length > 0 && (
          <Typography variant="p" sx={{ color: 'text.disabled', mb: 3, fontSize: 14 }}>
            {t('appointments')}:
          </Typography>
        )}

        <Stack
          sx={{ mt: 3 }}
          divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />}
          spacing={3}
          alignItems="flex-end"
        >
          {fields.map((item, index) => (
            <Stack
              key={index}
              alignItems="center"
              flexWrap="wrap"
              spacing={1.5}
              sx={{ width: '80%' }}
            >
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ width: '100%' }}>
                <RHFSelect
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  name={`days_details[${ParentIndex}].appointments[${index}].appointment_type`}
                  label={t('appointment type')}
                >
                  {appointmenttypesData?.map((option, idx) => (
                    <MenuItem lang="ar" key={idx} value={option._id}>
                      {curLangAr ? option?.name_arabic : option?.name_english}
                    </MenuItem>
                  ))}
                </RHFSelect>
                <RHFTimePicker
                  name={`days_details[${ParentIndex}].appointments[${index}].start_time`}
                  label={t('start time')}
                  slotProps={{
                    textField: {
                      size: 'small',
                      fullWidth: true,
                    },
                  }}
                />
                <RHFCheckbox
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  name={`days_details[${ParentIndex}].appointments[${index}].online_available`}
                  onChange={() =>
                    setValue(
                      `days_details[${ParentIndex}].appointments[${index}].online_available`,
                      !watch(`days_details[${ParentIndex}].appointments[${index}].online_available`)
                    )
                  }
                  label={<Typography sx={{ fontSize: 12 }}>{t('online avaliable')}</Typography>}
                />
                <IconButton
                  size="small"
                  color="error"
                  sx={{ justifySelf: { xs: 'flex-end' }, alignSelf: { xs: 'flex-end' }, width: 35 }}
                  onClick={() => handleRemove(index)}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </Stack>
            </Stack>
          ))}
        </Stack>

        <Divider
          sx={{
            mt: values.days_details[ParentIndex]?.appointments?.length > 0 ? 3 : 0,
            mb: 1,
            borderStyle: 'dashed',
          }}
        />

        <Stack
          spacing={3}
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-end', md: 'center' }}
        >
          <Button
            size="small"
            color="primary"
            startIcon={<Iconify icon="tdesign:plus" />}
            sx={{ padding: 1 }}
            onClick={handleAdd}
            // sx={{ flexShrink: 0 }}
          >
            {curLangAr ? 'إضافة مواعيد بالتفصيل' : 'Add Detailed Appointment'}
          </Button>
        </Stack>
      </Box>
    </Collapse>
    // </Dialog>
  );
}
NewEditDayAppointmentsDetails.propTypes = {
  ParentIndex: PropTypes.number,
  open: PropTypes.bool,
  appointmenttypesData: PropTypes.array,
  setAppointmentsNum: PropTypes.func,
};
