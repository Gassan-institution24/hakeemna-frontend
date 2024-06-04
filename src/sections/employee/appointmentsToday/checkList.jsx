import * as Yup from 'yup';
import { useEffect } from 'react';
import { useParams } from 'react-router';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  Box,
  Button,
  Divider,
  Checkbox,
  TextField,
  FormGroup,
  Typography,
  FormControlLabel,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useGetOneEntranceManagement } from 'src/api';
import { useGetlocalCheckListData, useGetAllentranceCheckList } from 'src/api/check_listQ';

import FormProvider from 'src/components/hook-form/form-provider';

export default function TestPage() {
  const params = useParams();
  const { id } = params;
  const localListData = useGetlocalCheckListData();
  const { data, refetch } = useGetAllentranceCheckList(id);
  const { user } = useAuthContext();
  const { Entrance } = useGetOneEntranceManagement(id);

  const onSubmit = async (answers) => {
    try {
      await axiosInstance.post('/api/answersandquestiones', answers);
      enqueueSnackbar('New question created successfully', { variant: 'success' });
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
      {data?.map((answers, keyI) => (
        <Typography sx={{pt:2}} key={keyI}>
          {answers?.question?.question_english} : {answers?.answer}
        </Typography>
      ))}
<Divider/>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        {localListData?.localListData?.map((info, i) => (
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
                <Typography>{info?.question_english || info?.question?.question_english}</Typography>
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
          </Box>
        ))}
        <Button type="submit" disabled={isSubmitting} variant="contained">
          Save
        </Button>
      </FormProvider>
    </>
  );
}
