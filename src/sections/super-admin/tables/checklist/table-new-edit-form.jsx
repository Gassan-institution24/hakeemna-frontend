import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { Box, Button, Container, Divider, IconButton, MenuItem, Radio, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useGetSpecialties } from 'src/api';

import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { useSnackbar } from 'notistack';


// ----------------------------------------------------------------------

export default function NewEditForm({ currentRow }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar()

  console.log(currentRow,'dataaaaaaaaaaaaa')

  const ChecklistSchema = Yup.object().shape({
    title: Yup.string().nullable().required('title is required'),
    speciality: Yup.string().nullable(),
    description: Yup.string(),
    questions:
      Yup.array().of(
        Yup.object({
          question: Yup.string(),
          answer_way: Yup.string(),
          options: Yup.array().nullable(),
        })

      ),
  });

  const { specialtiesData } = useGetSpecialties()

  const defaultValues = useMemo(
    () => ({
      title: currentRow?.title || '',
      speciality: currentRow?.speciality || null,
      description: currentRow?.description || '',
      questions: currentRow?.questions || [
        {
          question: '',
          answer_way: 'Text',
          options: [''],
        },
      ],
    }),
    [currentRow]
  );

  const methods = useForm({
    resolver: yupResolver(ChecklistSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
  } = methods;

  const values = watch()

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });
  const handleAdd = () => {
    append({
      question: '',
      answer_way: '',
      options: [''],
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  const handleCreateAndSend = handleSubmit(async (data) => {
    console.log(data, 'dataaaaaaaaaaaaaaaaaaaaaa')
    try {
      if (currentRow) {
        await axiosInstance.patch(endpoints.checklist.one(currentRow._id), data)
        enqueueSnackbar('updated successfuly')
      } else {
        await axiosInstance.post(endpoints.checklist.all, data);
        enqueueSnackbar('created successfuly')
      }
      // reset();
      // router.push(paths.superadmin.tables.checklist.root);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' })
      console.error(error);
    }
  });

  return (
    <Container maxWidth="xl">
      <FormProvider methods={methods}>
        <Card>
          <Stack spacing={2} sx={{ width: 1, p: 3 }} alignItems='center'>
            <RHFTextField name='title' label='title' sx={{ width: { md: 0.6, xs: 1 } }} />
            <RHFSelect size='small' name='speciality' label='speciality' sx={{ width: { md: 0.3, xs: 1 } }}>
              {specialtiesData.map((one, idx) => (
                <MenuItem key={idx} value={one._id}>{one.name_english}</MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField size='small' name='description' label='description' sx={{ width: { md: 0.5, xs: 1 } }} />
          </Stack>
        </Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            questions:
          </Typography>
          <Stack spacing={4}>
            {fields.map((item, index) => (
              <Card sx={{ p: 3 }}>
                <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
                  <Stack
                    spacing={2}
                    sx={{ width: 1 }}
                  >
                    <Stack
                      direction={{ xs: 'column', md: 'row' }}
                      justifyContent="space-between"
                      spacing={2}
                      sx={{ width: 1 }}
                    >
                      <RHFTextField
                        size="small"
                        name={`questions[${index}].question`}
                        label="question"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: 1 }}
                      />
                      <RHFSelect
                        name={`questions[${index}].answer_way`}
                        size="small"
                        label="answer_way"
                        InputLabelProps={{ shrink: true }}
                        sx={{ width: { md: 0.5, xs: 1 } }}
                      >
                        {['Text', 'Yes No', 'Options'].map((one) => (
                          <MenuItem
                            key={one}
                            value={one}
                          >
                            {one}
                          </MenuItem>
                        ))}
                      </RHFSelect>
                      <Button size="small" color="error" onClick={() => handleRemove(index)}>
                        <Iconify icon="solar:trash-bin-trash-bold" />
                      </Button>
                    </Stack>
                    {values.questions[index].answer_way === 'Options' && <Stack
                      justifyContent='flex-end'
                      alignItems='start'
                      spacing={1}
                      sx={{ width: 0.8 }}
                    >
                      <QuestionOptions index={index} />
                    </Stack>
                    }
                  </Stack>
                </Stack>
              </Card>
            ))}
          </Stack>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          <Stack
            spacing={3}
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-end', md: 'center' }}
          >
            <Button
              size="small"
              color="primary"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleAdd}
              sx={{ flexShrink: 0 }}
            >
              Add Item
            </Button>
          </Stack>
        </Box>

        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 1 }}>

          <LoadingButton
            variant="contained"
            loading={isSubmitting}
            onClick={handleCreateAndSend}
          >
            {currentRow ? 'Update' : 'Create'}
          </LoadingButton>
        </Stack>
      </FormProvider>
    </Container>
  );
}

NewEditForm.propTypes = {
  currentRow: PropTypes.object,
};


function QuestionOptions({ index }) {
  const { control, setValue, watch } = useFormContext();
  const values = watch()

  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions[${index}].options`,
  });

  const handleAdd = () => {
    append(' ');
  };

  const handleRemove = (idx) => {
    remove(idx);
  };

  return (
    <>
      {fields.map((item, idx) => (
        <Stack direction='row' alignItems='center'>
          <Radio disabled />
          <RHFTextField size='small' variant='standard' name={`questions[${index}].options[${idx}]`} />
          <Stack direction='row'>
            <IconButton size="small" color="error" onClick={() => handleRemove(idx)}>
              <Iconify icon="ic:round-close" />
            </IconButton>
          </Stack>
        </Stack>
      ))}
      <Button color="primary" size="small" sx={{ fontSize: 12 }} onClick={handleAdd}>
        <Iconify icon="ph:plus-bold" />
        add option
      </Button>

    </>
  )
}
QuestionOptions.propTypes = {
  index: PropTypes.number,
};