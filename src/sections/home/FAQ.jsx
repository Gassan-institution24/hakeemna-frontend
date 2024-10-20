import * as React from 'react';
import { enqueueSnackbar } from 'notistack';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Box,
  Card,
  Stack,
  Button,
  TextField,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import axiosInstance from 'src/utils/axios';

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image/image';

import Arrow from './test.png';
import Arrow2 from './test2.png';

export default function FAQ() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
  const [data, setData] = React.useState('');

  const onSubmit = async () => {
    try {
      await axiosInstance.post('/api/faq', { body: data });

      enqueueSnackbar('Hakeemna is always here to help you, thanks for your efforts', {
        variant: 'success',
      });
    } catch (error) {
      if (error?.response?.status !== 401) {
        enqueueSnackbar('Something went wrong, please try again later', { variant: 'error' });
      }
    }
  };

  return (
    <Stack sx={{ p: 5 }}>
      <Card sx={{ display: { md: 'flex', xs: 'block' } }}>
        <Box
          sx={{
            p: 2,
            order: { xs: 1, md: 2 },
          }}
        >
          <Typography variant="h2" component="h2" sx={{ mb: 3 }}>
            {t('frequently asked questions')}
          </Typography>
          <Card sx={{ bgcolor: 'rgba(128, 128, 128, 0.1)' }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'success.main' }} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>ما هي الغايات من طلب معلوماتي الشخصية</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  في حكيمنا هدفنا هو توفير جميع سبل الراحة من خلال تسهيل كامل الاجرائات الطبية, لذلك
                  توفيرها من قبل المستخدم يساعدنا في تحقيق هذا الهدف
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'success.main' }} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>
                  ما هي المعلومات الطبية التي يمكنني رفعها وتخزينها على منصة حكيمنا؟
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  على منصة حكيمنا، يمكنك رفع وتخزين جميع معلوماتك الطبية المهمة، بما في ذلك:
                  <br /> الصور الطبية مثل الأشعة السينية أو الرنين المغناطيسي. <br />
                  نتائج التحاليل والفحوصات الطبية.
                  <br />
                  التقارير الطبية من الأطباء والمستشفيات.
                  <br />
                  أي مستندات أخرى تتعلق بتاريخك الصحي.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Box>

        <Box sx={{ width: { md: '35%', xs: '100%' }, p: 3, order: { xs: 2, md: 1 } }}>
          <Typography variant="h4" sx={{ color: 'lightgray', fontWeight: 100 }}>
            {t('cant find what you are looking for?')}
          </Typography>
          <Box sx={{ display: 'inline-flex' }}>
            <Typography
              variant="h6"
              sx={{ fontWeight: 100, fontSize: { md: 20, xs: 15 }, mb: { md: 0, xs: 2 } }}
            >
              {t('we would like to hear from you')}
            </Typography>
            <Image
              src={curLangAr ? Arrow2 : Arrow}
              sx={{
                zIndex: -1,
                ml: curLangAr ? -3 : -5,
                transform: curLangAr ? 'rotate(50deg)' : 'rotate(-17deg)',
                display: { md: 'block', xs: 'none' },
              }}
            />
          </Box>
          <Box>
            <TextField
              onChange={(e) => setData(e.target.value)}
              name="body"
              placeholder={t('your question')}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              sx={{ bgcolor: 'success.main', color: 'white', display: 'block' }}
              type="submit"
              onClick={onSubmit}
            >
              {t('SEND')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Stack>
  );
}
