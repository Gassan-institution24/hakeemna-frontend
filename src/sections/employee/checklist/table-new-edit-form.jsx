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

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';
import { useGetEmployeeActiveWorkGroups } from 'src/api';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFSelect, RHFCheckbox, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewEditForm({ currentRow }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const ChecklistSchema = Yup.object().shape({
    title: Yup.string().nullable().required('title is required'),
    // speciality: Yup.string().nullable(),
    description: Yup.string(),
    unit_service: Yup.string().nullable(),
    department: Yup.string().nullable(),
    work_group: Yup.string().nullable(),
    general: Yup.bool(),
    questions: Yup.array().of(
      Yup.object({
        question: Yup.string(),
        answer_way: Yup.string(),
        category: Yup.string(),
        options: Yup.array().nullable(),
      })
    ),
  });

  // const { specialtiesData } = useGetSpecialties();
  const { workGroupsData } = useGetEmployeeActiveWorkGroups(
    user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?._id
  );

  const defaultValues = useMemo(
    () => ({
      title: currentRow?.title || '',
      // speciality: currentRow?.speciality || null,
      unit_service: currentRow?.unit_service || null,
      department: currentRow?.department || null,
      work_group: currentRow?.work_group || null,
      general: currentRow?.general || false,
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
    setValue,
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
    reset({
      title: currentRow?.title || '',
      // speciality: currentRow?.speciality || null,
      unit_service:
        currentRow?.unit_service ||
        user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?.unit_service
          ?._id,
      department: currentRow?.department || null,
      work_group: currentRow?.work_group || null,
      general: currentRow?.general || false,
      description: currentRow?.description || '',
      questions: currentRow?.questions || [
        {
          question: '',
          answer_way: 'Text',
          category: '',
          options: [''],
        },
      ],
    });
  }, [currentRow, reset, user?.employee]);

  const handleRemove = (index) => {
    remove(index);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
  };

  const handleCreateAndSend = handleSubmit(async (data) => {
    try {
      if (currentRow && currentRow.user_creation === user._id) {
        await axiosInstance.patch(endpoints.checklist.one(currentRow._id), data);
        enqueueSnackbar(t('updated successfuly'));
      } else {
        delete data._id;
        const dataToCreate = {
          ...data,
          questions: data.questions.map((one) => ({
            question: one?.question,
            answer_way: one?.answer_way,
            options: one?.options,
          })),
          employee: user?.employee?.employee_engagements?.[user?.employee.selected_engagement]?._id,
        };
        await axiosInstance.post(endpoints.checklist.all, dataToCreate);
        enqueueSnackbar(t('created successfuly'));
      }
      reset();
      router.push(paths.employee.checklist.root);
    } catch (error) {
      enqueueSnackbar(error.message, { variant: 'error' });
      console.error(error);
    }
  });

  return (
    <Container maxWidth="xl">
      <FormProvider methods={methods}>
        <Card>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{ width: 1, p: 3 }}
            alignItems="center"
          >
            <Stack spacing={2} sx={{ width: 1 }} alignItems="center" justifyContent="flex-start">
              <RHFTextField name="title" label={t('title')} sx={{ width: { md: 0.8, xs: 1 } }} />
              <RHFTextField
                size="small"
                name="description"
                label={t('description')}
                sx={{ width: { md: 0.7, xs: 1 } }}
              />
            </Stack>

            <Stack
              sx={{ width: { md: 0.5, xs: 1 }, border: '0.5px dotted black', padding: 2 }}
              justifyContent="flex-end"
            >
              <Typography variant="caption" mb={2}>
                {t('availability and privacy')}:
              </Typography>
              <RHFCheckbox
                name="general"
                label={t('available for all hakeemna community')}
                onChange={() => setValue('general', !values.general)}
              />
              <RHFCheckbox
                name="unit_service"
                label={t('available for your unit of service employees')}
                onChange={() =>
                  setValue(
                    'unit_service',
                    values.unit_service
                      ? null
                      : user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                          ?.unit_service?._id
                  )
                }
              />
              {user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                ?.department && (
                <RHFCheckbox
                  name="department"
                  label={t('available for your department employees')}
                  onChange={() =>
                    setValue(
                      'department',
                      values.department
                        ? null
                        : user?.employee?.employee_engagements?.[user?.employee.selected_engagement]
                            ?.department?._id
                    )
                  }
                />
              )}

              <RHFSelect
                size="small"
                name="work_group"
                label={t('available for work group')}
                sx={{ width: { md: 1, xs: 1 }, mt: 2 }}
              >
                <MenuItem sx={{ textTransform: 'capitalize' }} value={null}>
                  {t('all')}
                </MenuItem>
                <Divider />
                {workGroupsData.map((one, idx) => (
                  <MenuItem key={idx} value={one._id}>
                    {curLangAr ? one.name_arabic : one.name_english}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Stack>
          </Stack>
        </Card>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
            {t('questions')}:
          </Typography>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable-questions">
              {(provided) => (
                <Stack spacing={4} {...provided.droppableProps} ref={provided.innerRef}>
                  {fields.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(providedd) => (
                        <Card
                          sx={{ p: 3 }}
                          ref={providedd.innerRef}
                          {...providedd.draggableProps}
                          {...providedd.dragHandleProps}
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
                                  label={t('question')}
                                  InputLabelProps={{ shrink: true }}
                                  sx={{ width: 1 }}
                                />
                                <RHFSelect
                                  name={`questions[${index}].answer_way`}
                                  size="small"
                                  label={t('answer way')}
                                  InputLabelProps={{ shrink: true }}
                                  sx={{ width: { md: 0.5, xs: 1 } }}
                                >
                                  {['Text', 'Yes No', 'Options'].map((one) => (
                                    <MenuItem key={one} value={one}>
                                      {t(one)}
                                    </MenuItem>
                                  ))}
                                </RHFSelect>
                                <RHFTextField
                                  size="small"
                                  name={`questions[${index}].category`}
                                  label={t('category')}
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
              {t('add item')}
            </Button>
          </Stack>
        </Box>

        <Stack justifyContent="flex-end" direction="row" spacing={2} sx={{ mt: 1 }}>
          <LoadingButton variant="contained" loading={isSubmitting} onClick={handleCreateAndSend}>
            {currentRow && currentRow.user_creation === user._id ? t('update') : t('add')}
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
  const { t } = useTranslate();

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
        {t('add option')}
      </Button>
    </>
  );
}
QuestionOptions.propTypes = {
  index: PropTypes.number,
};
