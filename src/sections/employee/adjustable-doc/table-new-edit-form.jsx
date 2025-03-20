import * as Yup from 'yup';
import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFieldArray, useFormContext } from 'react-hook-form';

import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Radio, Button, MenuItem, Container, IconButton } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import axiosInstance, { endpoints } from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useLocales, useTranslate } from 'src/locales';

import Iconify from 'src/components/iconify';
import FormProvider, { RHFEditor, RHFSelect, RHFTextField } from 'src/components/hook-form';

// ----------------------------------------------------------------------

export default function NewEditForm({ currentRow }) {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();

  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const AdjustableSchema = Yup.object().shape({
    employee: Yup.string(),
    title: Yup.string().required(t('required field')),
    topic: Yup.string().required(t('required field')),
    applied: Yup.string(),
  });

  const defaultValues = useMemo(
    () => ({
      employee: currentRow?.employee || user?.employee?._id,
      title: currentRow?.title || '',
      topic: currentRow?.topic || '',
      applied: currentRow?.applied || '',
    }),
    [currentRow, user?.employee?._id]
  );

  const methods = useForm({
    resolver: yupResolver(AdjustableSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleCreateAndSend = handleSubmit(async (data) => {
    try {
      if (currentRow && currentRow.user_creation === user._id) {
        await axiosInstance.patch(endpoints.adjustabledocument.one(currentRow._id), data);
        enqueueSnackbar(t('updated successfuly'));
      } else {
        await axiosInstance.post(endpoints.adjustabledocument.all, data);
        enqueueSnackbar(t('created successfuly'));
      }
      reset();
      router.push(paths.employee.documents.adjustable.root);
    } catch (error) {
      enqueueSnackbar(curLangAr ? error.arabic_message || error.message : error.message, {
        variant: 'error',
      });
      console.error(error);
    }
  });

  return (
    <Container maxWidth="xl">
      <FormProvider methods={methods}>
        <Card sx={{ p: 5 }}>
          <Box
            rowGap={3}
            columnGap={2}
            display="grid"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <RHFTextField name="title" multiline label={t('title')} />
            <RHFSelect
              label={t('applied time')}
              fullWidth
              name="applied"
              PaperPropsSx={{ textTransform: 'capitalize' }}
              sx={{ mb: 3 }}
            >
              {['before', 'after']?.map((one, idx) => (
                <MenuItem lang="ar" value={one} key={idx}>
                  {t(one)}
                </MenuItem>
              ))}
            </RHFSelect>
          </Box>
          <RHFEditor name="topic" label={t('content')} />
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
