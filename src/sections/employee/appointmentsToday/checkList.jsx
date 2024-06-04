import * as Yup from 'yup';
import { enqueueSnackbar } from 'notistack';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Button, Divider, TextField } from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useGetlocalCheckListData } from 'src/api/check_listQ';

import FormProvider from 'src/components/hook-form/form-provider';

export default function TestPage() {
  const localListData = useGetlocalCheckListData();
  // console.log(localListData);

  const onSubmit = async (submitdata) => {
    try {
      await axiosInstance.post('/api/answersandquestiones', submitdata);
      enqueueSnackbar('New question created successfully', { variant: 'success' });
      reset();
    } catch (error) {
      console.error(error.message);
    }
  };

  const questionSchema = Yup.object().shape({
    question: Yup.string(),
    answer: Yup.mixed(),
  });

  const defaultValues = {
    // question: '',
    // answer: '',
  };

  //   question
  // answer

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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {localListData?.localListData?.map((info, i) => (
        <Box key={i} sx={{ display: 'block' }}>
          {info?.answer_way === 'Text' && (
            <>
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
              <Divider />
            </>
          )}
        </Box>
      ))}

      <Button type="submit" loading={isSubmitting} variant="contained">
        Save
      </Button>
    </FormProvider>
  );
}
