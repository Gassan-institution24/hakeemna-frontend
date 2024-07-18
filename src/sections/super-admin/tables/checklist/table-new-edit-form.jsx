import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { useMemo, useEffect } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';
import { Draggable, Droppable, DragDropContext } from 'react-beautiful-dnd';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Radio,
  Button,
  Divider,
  MenuItem,
  Container,
  IconButton,
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useGetSpecialties } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewEditForm({ currentRow }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const ChecklistSchema = Yup.object().shape({
    title: Yup.string().nullable().required('title is required'),
    speciality: Yup.string().nullable(),
    description: Yup.string(),
    questions: Yup.array().of(
      Yup.object({
        question: Yup.string(),
        answer_way: Yup.string(),
        category: Yup.string(),
        options: Yup.array().nullable(),
      })
    ),
  });

  const { specialtiesData } = useGetSpecialties({ select: 'name_english' });

  const defaultValues = useMemo(
    () => ({
      title: currentRow?.title || '',
      speciality: currentRow?.speciality || null,
      description: currentRow?.description || '',
      questions: currentRow?.questions || [
        {
          question: '',
          answer_way: 'Text',
          category: '',
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

  const values = watch();

  const { fields, append, remove, move } = useFieldArray({
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

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const handleRemove = (index) => {
    remove(index);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const handleCreateAndSend = handleSubmit(async (data) => {
    try {
      if (currentRow) {
        await axiosInstance.patch(endpoints.checklist.one(currentRow._id), {
          ...data,
          general: true,
        });
        enqueueSnackbar('updated successfully');
      } else {
        await axiosInstance.post(endpoints.checklist.all, { ...data, general: true });
        enqueueSnackbar('created successfully');
      }
      reset();
      router.push(paths.superadmin.tables.checklist.root);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <Container maxWidth="xl">
      <FormProvider methods={methods}>
        <Card>
          <Stack spacing={2} sx={{ width: 1, p: 3 }} alignItems="center">
            <RHFTextField name="title" label="title" sx={{ width: { md: 0.6, xs: 1 } }} />
            <RHFSelect
              size="small"
              name="speciality"
              label="speciality"
              sx={{ width: { md: 0.3, xs: 1 } }}
            >
              {specialtiesData.map((one, idx) => (
                <MenuItem key={idx} value={one._id}>
                  {one.name_english}
                </MenuItem>
              ))}
            </RHFSelect>
            <RHFTextField
              size="small"
              name="description"
              label="description"
              sx={{ width: { md: 0.5, xs: 1 } }}
            />
          </Stack>
        </Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            questions:
          </Typography>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-questions">
              {(provided) => (
                <Stack spacing={4} {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provide) => (
                        <Card
                          sx={{ p: 3 }}
                          ref={provide.innerRef}
                          {...provide.draggableProps}
                          {...provide.dragHandleProps}
                        >
                          <Stack alignItems="flex-end" spacing={1.5}>
                            <Stack spacing={2} sx={{ width: 1 }}>
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
                                    <MenuItem key={one} value={one}>
                                      {one}
                                    </MenuItem>
                                  ))}
                                </RHFSelect>
                                <RHFTextField
                                  size="small"
                                  name={`questions[${index}].category`}
                                  label="category"
                                  InputLabelProps={{ shrink: true }}
                                  sx={{ width: { md: 0.5, xs: 1 } }}
                                />
                                <Button
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemove(index)}
                                >
                                  <Iconify icon="solar:trash-bin-trash-bold" />
                                </Button>
                              </Stack>
                              {values.questions[index].answer_way === 'Options' && (
                                <Stack
                                  justifyContent="flex-end"
                                  alignItems="start"
                                  spacing={1}
                                  sx={{ width: 0.8 }}
                                >
                                  <QuestionOptions index={index} />
                                </Stack>
                              )}
                            </Stack>
                          </Stack>
                        </Card>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>

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
          <LoadingButton variant="contained" loading={isSubmitting} onClick={handleCreateAndSend}>
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
  const { control } = useFormContext();

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
        <Stack key={item.id} direction="row" alignItems="center">
          <Radio disabled />
          <RHFTextField
            size="small"
            variant="standard"
            name={`questions[${index}].options[${idx}]`}
          />
          <Stack direction="row">
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
  );
}
QuestionOptions.propTypes = {
  index: PropTypes.number,
};
