import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
  Card,
  Radio,
  Stack,
  Button,
  Divider,
  Checkbox,
  TextField,
  FormGroup,
  Typography,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { useAuthContext } from 'src/auth/hooks';
import { useGetCheckList, useGetMyCheckLists, useGetUSPatientCheckList } from 'src/api';

import FormProvider from 'src/components/hook-form/form-provider';

import { ProfilePaneHeader } from 'src/sections/shared/patient-profile/profile-pane';

export default function PatientCheckList({ patient }) {
  const { t } = useTranslate();
  const [thId, setTheId] = useState(null);
  const { user } = useAuthContext();
  const { CheckListData } = useGetMyCheckLists(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?._id
  );
  const { data } = useGetCheckList(thId);
  const { answer, refetch } = useGetUSPatientCheckList(patient?._id);


  const onSubmit = async (answers) => {
    try {
      await axiosInstance.post('/api/answersandquestiones', answers);
      enqueueSnackbar('New question created successfully', { variant: 'success' });
      reset();
      refetch();
    } catch (error) {
      console.error(error.message);
    }
  };

  const questionSchema = Yup.object().shape({
    question: Yup.string(),
    employee: Yup.string(),
    entrance: Yup.string(),
    patient: Yup.string(),
    answer: Yup.mixed(),
  });

  const defaultValues = {
    patient: patient?.patient?._id || patient?._id,
    unit_service_patient: patient?._id,
    employee: user?.employee?._id,
  };

  const methods = useForm({
    mode: 'all',
    resolver: yupResolver(questionSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset({
      patient: patient?.patient?._id || patient?._id,
      unit_service_patient: patient?._id,
      employee: user?.employee?._id,
    });
  }, [user, patient, reset]);

  const questionnaires = Array.isArray(CheckListData) ? CheckListData : [];
  const answers = Array.isArray(answer) ? answer : [];

  return (
    <Box>
      <ProfilePaneHeader
        icon="solar:checklist-minimalistic-bold-duotone"
        title={t('Questionnaires')}
        subtitle={t('Questions and assessments to evaluate the patient')}
        count={answers.length}
      />

      {/* Was a hard 70/30 flex split that never stacked, so on a phone the answer
          column was squeezed into a third of an already narrow screen. */}
      <Card>
        <Stack direction={{ xs: 'column', md: 'row' }} divider={<Divider flexItem />}>
          <Box sx={{ flex: 1, p: 2, minWidth: 0 }}>
            {questionnaires.length === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: 'text.disabled', py: 4, textAlign: 'center' }}
              >
                {t('No questionnaires available')}
              </Typography>
            ) : (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                {questionnaires.map((info) => {
                  const selected = info?._id === thId;
                  return (
                    // These used to be identical grey blobs with no selected
                    // state, so nothing said which form you were filling in.
                    <Button
                      key={info?._id}
                      size="small"
                      variant={selected ? 'contained' : 'outlined'}
                      color={selected ? 'primary' : 'inherit'}
                      onClick={() => setTheId(info?._id)}
                    >
                      {info?.title}
                    </Button>
                  );
                })}
              </Stack>
            )}

            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

            {!data ? (
              <Typography
                variant="body2"
                sx={{ color: 'text.disabled', py: 4, textAlign: 'center' }}
              >
                {t('Select a questionnaire to begin')}
              </Typography>
            ) : (
              <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1">{data?.title}</Typography>

                  {data?.description && (
                    <Typography
                      variant="body2"
                      sx={{
                        mt: 1,
                        p: 1.5,
                        borderRadius: 1,
                        color: 'text.secondary',
                        // Was #EDEFF2, which stayed pale grey in dark mode and
                        // put near-white body text on it.
                        bgcolor: 'background.neutral',
                      }}
                    >
                      {data.description}
                    </Typography>
                  )}
                </Box>

                <Stack gap={2}>
                  {data?.questions?.map((questions) => (
                    <Box key={questions?._id}>
                      {questions?.answer_way === 'Text' && (
                        <Controller
                          name={`answer_${questions?._id}`}
                          control={control}
                          render={({ field }) => (
                            <TextField {...field} fullWidth label={questions?.question} />
                          )}
                        />
                      )}

                      {questions?.answer_way === 'Options' && (
                        <Box>
                          <Typography variant="subtitle2">{questions?.question}</Typography>
                          <Controller
                            name={`answer_${questions?._id}`}
                            control={control}
                            render={({ field }) => (
                              <FormGroup>
                                {questions?.options?.map((option) => (
                                  <FormControlLabel
                                    key={option}
                                    control={
                                      <Checkbox
                                        checked={field.value?.includes(option) || false}
                                        onChange={(e) => {
                                          const valueArray = field.value || [];
                                          if (e.target.checked) {
                                            field.onChange([...valueArray, option]);
                                          } else {
                                            field.onChange(
                                              valueArray.filter((item) => item !== option)
                                            );
                                          }
                                        }}
                                      />
                                    }
                                    label={option}
                                  />
                                ))}
                              </FormGroup>
                            )}
                          />
                        </Box>
                      )}

                      {questions?.answer_way === 'Yes No' && (
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 1,
                            border: (theme) => `solid 1px ${theme.palette.divider}`,
                          }}
                        >
                          <Typography variant="subtitle2" sx={{ mb: 1 }}>
                            {questions?.question}
                          </Typography>
                          <Controller
                            name={`answer_${questions?._id}`}
                            control={control}
                            render={({ field }) => (
                              <RadioGroup {...field} row>
                                {/* Were hardcoded English in an app that ships
                                    Arabic. */}
                                <FormControlLabel
                                  value="Yes"
                                  control={<Radio />}
                                  label={t('Yes')}
                                />
                                <FormControlLabel value="No" control={<Radio />} label={t('No')} />
                              </RadioGroup>
                            )}
                          />
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>

                <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ mt: 3 }}>
                  {t('save')}
                </Button>
              </FormProvider>
            )}
          </Box>

          <Box sx={{ width: { xs: 1, md: 320 }, flexShrink: 0, p: 2 }}>
            <Typography variant="subtitle1" sx={{ mb: 1.5 }}>
              {t('Answers')}
            </Typography>

            {answers.length === 0 ? (
              <Typography variant="body2" sx={{ color: 'text.disabled' }}>
                {t('No answers recorded')}
              </Typography>
            ) : (
              <Stack gap={1.5}>
                {answers.map((answersAndQ) => (
                  <Box key={answersAndQ?._id}>
                    <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                      {answersAndQ?.question?.question}
                    </Typography>
                    <Typography variant="body2">{String(answersAndQ?.answer ?? '-')}</Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Box>
        </Stack>
      </Card>
    </Box>
  );
}
PatientCheckList.propTypes = {
  patient: PropTypes.object,
};
