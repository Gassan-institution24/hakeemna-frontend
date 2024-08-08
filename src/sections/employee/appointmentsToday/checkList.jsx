import * as Yup from 'yup';
import { useParams } from 'react-router';
import { enqueueSnackbar } from 'notistack';
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
  Card,
  Radio,
  Button,
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
import {
  useGetCheckList,
  useGetMyCheckLists,
  useGetAllentranceCheckList,
  useGetOneEntranceManagement,
} from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider from 'src/components/hook-form/form-provider';

export default function CheckList() {
  const params = useParams();
  const { id } = params;
  const { t } = useTranslate();
  const [thId, setTheId] = useState(null);
  const { user } = useAuthContext();
  const { Entrance } = useGetOneEntranceManagement(id, { populate: 'all' });
  const { CheckListData } = useGetMyCheckLists(
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
  );
  const { data } = useGetCheckList(thId);
  const { answer, refetch } = useGetAllentranceCheckList(id);

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
    patient: Entrance?.patient?._id,
    employee: user?.employee?._id,
    entrance: id,
  };

  const methods = useForm({
    mode: 'onTouched',
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
      patient: Entrance?.patient?._id,
      employee: user?.employee?._id,
      entrance: Entrance?._id,
    });
  }, [user, Entrance, reset]);

  return (
    <Card sx={{ mt: 3 }}>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ width: '70%', p: 2 }}>
          <Box sx={{ height: '400px', overflowY: 'auto' }}>
            <Box sx={{ display: 'flex' }}>
              {CheckListData?.map((info, index) => (
                <Button key={index} sx={{ mt: 2, ml: 2 }} onClick={() => setTheId(info?._id)}>
                  {info?.title}{' '}
                  <Iconify icon="lets-icons:arhive-import" sx={{ ml: 2 }} width={21} />
                </Button>
              ))}
            </Box>

            <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
              <Box sx={{ m: 3 }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', borderBottom: 0.5, mt: 2, mb: 2 }}>
                  <Typography>{data?.title}</Typography>
                  {data && (
                    <Typography
                      sx={{ p: 1, bgcolor: 'lightgray', color: 'white', width: '100%', mt: 2 }}
                    >
                      {data?.description}
                    </Typography>
                  )}
                </Box>
                {data?.questions?.map((questions, ii) => (
                  <Box key={ii} sx={{ display: 'block' }}>
                    {questions?.answer_way === 'Text' && (
                      <Controller
                        name={`answer_${questions?._id}`}
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            sx={{ m: 2, width: '80%' }}
                            fullWidth
                            label={questions?.question}
                          />
                        )}
                      />
                    )}
                    {questions?.answer_way === 'Options' && (
                      <Box sx={{ m: 2 }}>
                        <Typography>{questions?.question}</Typography>
                        <Controller
                          name={`answer_${questions?._id}`}
                          control={control}
                          render={({ field }) => (
                            <FormGroup>
                              {questions?.options?.map((option, index) => (
                                <FormControlLabel
                                  key={index}
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
                      <Box sx={{ m: 2, border: 1, p: 2 }}>
                        <Typography sx={{ m: 2 }}>{questions?.question}</Typography>
                        <Controller
                          name={`answer_${questions?._id}`}
                          control={control}
                          render={({ field }) => (
                            <RadioGroup {...field}>
                              <FormControlLabel value="Yes" control={<Radio />} label="Yes" />
                              <FormControlLabel value="No" control={<Radio />} label="No" />
                            </RadioGroup>
                          )}
                        />
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>

              {data && (
                <Button type="submit" disabled={isSubmitting} variant="contained" sx={{ m: 3 }}>
                  {t('save')}
                </Button>
              )}
            </FormProvider>
          </Box>
        </Box>
        <Box sx={{ width: '30%', p: 2, borderLeft: 1, borderColor: 'divider' }}>
          <Typography sx={{ textAlign: 'center', mb: 2 }} variant="h4">
            {t('Answers')}
          </Typography>

          {answer?.map((answersAndQ, index) => (
            <Typography key={index}>
              {answersAndQ?.question?.question}:{' '}
              <span style={{ fontSize: 13 }}>{answersAndQ?.answer}</span>
            </Typography>
          ))}
        </Box>
      </Box>
    </Card>
  );
}
