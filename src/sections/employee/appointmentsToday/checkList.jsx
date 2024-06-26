import * as Yup from 'yup';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
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

import { useAuthContext } from 'src/auth/hooks';
import { useGetOneEntranceManagement, useGetMyCheckLists } from 'src/api';

import FormProvider from 'src/components/hook-form/form-provider';

export default function TestPage() {
  const params = useParams();
  const { id } = params;

  const { user } = useAuthContext();
  const { Entrance } = useGetOneEntranceManagement(id);
  const { CheckListData, refetch } = useGetMyCheckLists(
    user?.employee?.employee_engagements?.[user.employee.selected_engagement]._id
  );
  console.log(CheckListData);
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
    <>
      {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', borderBottom: 0.5, mt: 2 }}>
        {data?.map((answers, keyI) => (
          <Box key={keyI} sx={{ width: 'calc(33.33% - 16px)', m: 1 }}>
            <Typography>
              {answers?.question?.question_english} : {answers?.answer}
            </Typography>
          </Box>
        ))}
      </Box> */}

      <Box sx={{ height: '400px', overflowY: 'auto' }}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          {CheckListData?.map((info, i) => (
            <Box key={i} sx={{ display: 'block' }}>
              {info?.answer_way === 'Text' && (
                <Controller
                  name={`answer_${info?._id}`}
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      sx={{ m: 2, width: '80%' }}
                      fullWidth
                      label={info?.question_english || info?.question?.question_english}
                    />
                  )}
                />
              )}
              {info?.answer_way === 'Check List' && (
                <Box sx={{ m: 2 }}>
                  <Typography>
                    {info?.question_english || info?.question?.question_english}
                  </Typography>
                  <Controller
                    name={`answer_${info?._id}`}
                    control={control}
                    render={({ field }) => (
                      <FormGroup>
                        {info?.options?.map((option, index) => (
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
                                    field.onChange(valueArray.filter((item) => item !== option));
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
              {info?.answer_way === 'Yes No' && (
                <Box sx={{ m: 2, border: 1, p: 2 }}>
                  <Typography sx={{ m: 2 }}>
                    {info?.question_english || info?.question?.question_english}
                  </Typography>
                  <Controller
                    name={`answer_${info?._id}`}
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
          {CheckListData ? (
            ""
          ) : (
            <Button type="submit" disabled={isSubmitting} variant="contained">
              Save
            </Button>
          )}
        </FormProvider>
      </Box>
    </>
  );
}
