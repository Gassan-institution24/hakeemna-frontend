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
    user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id
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
      unit_service: currentRow?.unit_service || user?.employee?.employee_engagements[user?.employee.selected_engagement]
        ?.unit_service?._id,
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
          employee: user?.employee?.employee_engagements[user?.employee.selected_engagement]?._id,
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
            spacing={2}
            sx={{ width: 1, p: 3 }}
            alignItems="center"
          >
            <RHFTextField name="title" multiline label="tiltle" />
            <RHFTextField name="topic" multiline label="topic" />
            <RHFSelect
              label={t('applied Time')}
              fullWidth
              name="applied"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 2 }}
            >
              {['before', 'after']?.map((one, idx) => (
                <MenuItem lang="ar" value={one} key={idx} sx={{ mb: 1 }}>
                  {one}
                </MenuItem>
              ))}
            </RHFSelect>
          </Stack>
        </Card>

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
