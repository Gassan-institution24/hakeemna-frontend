import * as React from 'react';
import { enqueueSnackbar } from 'notistack';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Card,
  Button,
  TextField,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useTranslate } from 'src/locales';

export default function FAQ() {
  const { t } = useTranslate();
  const [data, setData] = React.useState('');

  const onSubmit = async () => {
    try {
      await axiosInstance.post('/api/faq', { body: data });
      enqueueSnackbar(t('Your inquiry has been submitted successfully'), {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(t('Something went wrong, please try again later'), {
        variant: 'error',
      });
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#E4F6F2',
        p: 8,
        borderRadius: 2,
        maxWidth: 800,
        mx: 'auto',
        my: '30px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#1F2C5C',
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3 }}>
        {t('الأٔسئلة الشائعة')}
      </Typography>
      <Card sx={{ backgroundColor: 'white', boxShadow: 1 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
            <Typography sx={{ fontWeight: 'bold', color: '#1F2C5C' }}>
              ما هي الغايات من طلب معلوماتي الشخصية
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              في حكيمنا هدفنا هو توفير جميع سبل الراحة من خلال تسهيل كامل الاجرائات الطبية، لذلك
              توفيرها من قبل المستخدم يساعدنا في تحقيق هذا الهدف.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
            <Typography sx={{ fontWeight: 'bold', color: '#1F2C5C' }}>
              ما هي المعلومات الطبية التي يمكنني رفعها وتخزينها على منصة حكيمنا؟
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              يمكنك رفع وتخزين جميع معلوماتك الطبية المهمة، بما في ذلك:
              <ul>
                <li>الصور الطبية مثل الأشعة السينية أو الرنين المغناطيسي.</li>
                <li>نتائج التحاليل والفحوصات الطبية.</li>
                <li>التقارير الطبية من الأطباء والمستشفيات.</li>
                <li>أي مستندات أخرى تتعلق بتاريخك الصحي.</li>
              </ul>
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Card>

      <Box sx={{ mt: 4, textAlign: 'center', borderTop: 'dashed 2px #63BFAD', width: '100%' }}>
        <Typography variant="h6" sx={{ mb: 1, mt: 2 }}>
          لم تتمكن من العثور على ما تبحث عنه؟
        </Typography>
        <Typography sx={{ color: 'gray', mb: 2 }}>نحن هنا للإجابة على استفساراتك.</Typography>
        <TextField
          fullWidth
          onChange={(e) => setData(e.target.value)}
          placeholder="اكتب سؤالك..."
          sx={{ backgroundColor: 'white', borderRadius: 1, mb: 2 }}
        />
        <Button
          variant="contained"
          sx={{ backgroundColor: '#001F3F', color: 'white', px: 4 }}
          onClick={onSubmit}
        >
          إرسال
        </Button>
      </Box>
    </Box>
  );
}
