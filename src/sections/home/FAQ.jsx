import * as React from 'react';

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

import { useLocales, useTranslate } from 'src/locales';

import Image from 'src/components/image/image';

import Arrow from './test.png';
import Arrow2 from './test2.png';

export default function FAQ() {
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';
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
                  في حكيمنا هدفنا هو توفير جميع سب الراحة من خلال تسهيل كامل الاجرائاء الطبية لذلك
                  توفيرها من قبل المستخدم يساعدنا في تحقي هذا الهدف
                </Typography>
              </AccordionDetails>
            </Accordion>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: 'success.main' }} />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                <Typography>test</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>test</Typography>
              </AccordionDetails>
            </Accordion>
          </Card>
        </Box>

        <Box sx={{ width: { md: '35%', xs: '100%' }, p: 3, order: { xs: 2, md: 1 } }}>
          <Typography variant="h4" sx={{ color: 'lightgray', fontWeight: 100 }}>
            {t('cant find what are you looking for ?')}
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
            <TextField placeholder={t('your question')} sx={{ mb: 2 }} />
            <Button
              variant="contaained"
              sx={{ bgcolor: 'success.main', color: 'white', display: 'block' }}
            >
              {t('SEND')}
            </Button>
          </Box>
        </Box>
      </Card>
    </Stack>
  );
}
