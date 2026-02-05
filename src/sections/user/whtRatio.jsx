import { m } from 'framer-motion';
import React, { useState, useCallback } from 'react';

import {
  List,
  Stack,
  Alert,
  Button,
  Divider,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';

import { useLocales } from 'src/locales';

import { varFade, MotionViewport } from 'src/components/animate';

export default function WhtRatio() {
  const { currentLang } = useLocales();
  const curLangAr = currentLang.value === 'ar';

  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [result, setResult] = useState(null);

  const getClassification = (ratio) => {
    if (ratio <= 0.34)
      return {
        label: curLangAr ? 'نحيف جدًا' : 'Extremely Slim',
        color: '#1976d2',
        tips: {
          exercise: curLangAr
            ? 'التركيز على تمارين المقاومة لزيادة الكتلة العضلية'
            : 'Focus on resistance training to build muscle mass',
          nutrition: curLangAr
            ? 'زيادة السعرات الحرارية بشكل صحي (بروتين، نشويات معقدة)'
            : 'Increase calories healthily (protein, complex carbs)',
          lifestyle: curLangAr
            ? 'تناول وجبات منتظمة وعدم إهمال الإفطار'
            : 'Eat regularly and don’t skip breakfast',
        },
      };

    if (ratio <= 0.42)
      return {
        label: curLangAr ? 'نحيف' : 'Slim',
        color: '#2e7d32',
        tips: {
          exercise: curLangAr
            ? 'تمارين مقاومة خفيفة مع كارديو معتدل'
            : 'Light resistance with moderate cardio',
          nutrition: curLangAr
            ? 'نظام غذائي متوازن مع زيادة بسيطة بالسعرات'
            : 'Balanced diet with slight calorie surplus',
          lifestyle: curLangAr ? 'المحافظة على نمط حياة نشط' : 'Maintain an active lifestyle',
        },
      };

    if (ratio <= 0.52)
      return {
        label: curLangAr ? 'صحي' : 'Healthy',
        color: 'green',
        tips: {
          exercise: curLangAr
            ? 'الاستمرار على تمارين كارديو والمقاومة'
            : 'Continue cardio and resistance training',
          nutrition: curLangAr ? 'الاستمرار على نظام غذائي متوازن' : 'Maintain a balanced diet',
          lifestyle: curLangAr
            ? 'تجنب الخمول وحافظ على نشاطك اليومي'
            : 'Avoid inactivity and stay active daily',
        },
      };

    if (ratio <= 0.57)
      return {
        label: curLangAr ? 'زيادة وزن' : 'Overweight',
        color: 'orange',
        tips: {
          exercise: curLangAr
            ? 'تمارين كارديو يومية مع مقاومة خفيفة'
            : 'Daily cardio with light resistance training',
          nutrition: curLangAr
            ? 'تقليل السكريات والدهون وزيادة البروتين'
            : 'Reduce sugar and fat, increase protein',
          lifestyle: curLangAr
            ? 'تقليل الجلوس الطويل والنوم الجيد'
            : 'Reduce prolonged sitting and sleep well',
        },
      };

    if (ratio <= 0.62)
      return {
        label: curLangAr ? 'زيادة وزن كبيرة' : 'Very Overweight',
        color: 'orangered',
        tips: {
          exercise: curLangAr
            ? 'تمارين كارديو يومية مع مقاومة خفيفة'
            : 'Daily cardio with light resistance training',
          nutrition: curLangAr
            ? 'تقليل السعرات والابتعاد عن الوجبات السريعة'
            : 'Reduce calories and avoid fast food',
          lifestyle: curLangAr ? 'الالتزام بروتين يومي صحي' : 'Stick to a healthy daily routine',
        },
        medicalAdvice: curLangAr
          ? ' يُفضل مراجعة طبيب لتقليل مخاطر السكري وأمراض القلب'
          : ' Doctor consultation recommended',
      };

    return {
      label: curLangAr ? 'سمنة' : 'Obese',
      color: 'red',
      tips: {
         exercise: curLangAr
            ? 'تمارين كارديو يومية مع مقاومة خفيفة'
            : 'Daily cardio with light resistance training',
        nutrition: curLangAr
          ? 'نظام غذائي علاجي وتقليل الدهون الحشوية'
          : 'Therapeutic diet to reduce visceral fat',
        lifestyle: curLangAr ? 'تغيير نمط الحياة بشكل جذري' : 'Major lifestyle changes required',
      },
      medicalAdvice: curLangAr
        ? ' يُنصح بمراجعة طبيب مختص بشكل عاجل'
        : ' Urgent specialist consultation advised',
    };
  };

  const calculate = useCallback(() => {
    if (!waist || !height) return;

    const w = Number(waist);
    const h = Number(height);

    const ratio = w / h;
    const targetWaist = h * 0.5;
    const diffWaist = w > targetWaist ? w - targetWaist : 0;

    setResult({
      ratio,
      targetWaist,
      diffWaist,
      classification: getClassification(ratio),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waist, height]);

  return (
    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} component={MotionViewport}>
      {/* Inputs */}
      <Stack
        spacing={3}
        sx={{
          bgcolor: 'background.paper',
          boxShadow: 7,
          borderRadius: 2,
          p: 4,
          width: { xs: '100%', md: 380 },
        }}
      >
        <m.div variants={varFade().inUp}>
          <Typography variant="h5">
            {curLangAr ? 'حساب نسبة الخصر إلى الطول' : 'Waist to Height Ratio'}
          </Typography>
        </m.div>

        <TextField
          fullWidth
          type="number"
          value={waist}
          onChange={(e) => setWaist(e.target.value)}
          label={curLangAr ? 'محيط الخصر (سم)' : 'Waist (cm)'}
        />

        <TextField
          fullWidth
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          label={curLangAr ? 'الطول (سم)' : 'Height (cm)'}
        />

        <Button size="large" type="submit" variant="contained" onClick={calculate}>
          {curLangAr ? 'احسب' : 'Calculate'}
        </Button>
      </Stack>

      {/* Report */}
      <Stack
        spacing={2}
        sx={{
          bgcolor: '#f9fafb',
          border: '1px solid #e0e0e0',
          borderRadius: 2,
          p: 4,
          width: { xs: '100%', md: 420 },
          minHeight: 300,
        }}
      >
        <Typography variant="h6" fontWeight={600}>
          {curLangAr ? 'نشرة التحليل الطبي' : 'Medical Analysis Report'}
        </Typography>

        <Divider />

        {!result && (
          <Typography color="text.secondary">
            {curLangAr
              ? 'أدخل البيانات واضغط احسب لعرض التقرير'
              : 'Enter data and press calculate to view the report'}
          </Typography>
        )}

        {result && (
          <>
            <Typography>
              {curLangAr ? 'النسبة:' : 'Ratio:'} <strong>{result.ratio.toFixed(2)}</strong>
            </Typography>

            <Typography sx={{ color: result.classification.color, fontWeight: 600 }}>
              {curLangAr ? 'التصنيف:' : 'Classification:'} {result.classification.label}
            </Typography>

            <Typography variant="body2">
              {curLangAr ? 'الخصر الصحي:' : 'Target waist:'} {result.targetWaist.toFixed(1)}{' '}
              {curLangAr ? 'سم' : 'cm'}
            </Typography>

            <Typography variant="body2">
              {curLangAr
                ? `المطلوب تقليل: ${result.diffWaist.toFixed(1)} سم`
                : `Required reduction: ${result.diffWaist.toFixed(1)} cm`}
            </Typography>

            <Divider />

            <Typography fontWeight={600}>
              {curLangAr ? 'إرشادات صحية:' : 'Health Guidelines'}
            </Typography>

            <List
              sx={{
                listStyleType: 'disc',
                pl: 4,
                '& .MuiListItem-root': {
                  display: 'list-item',
                },
              }}
            >
              <ListItem>{result.classification.tips.exercise}</ListItem>

              <ListItem>{result.classification.tips.nutrition}</ListItem>

              <ListItem>{result.classification.tips.lifestyle}</ListItem>
            </List>

            {result.classification.medicalAdvice && (
              <Alert severity="warning">{result.classification.medicalAdvice}</Alert>
            )}
            <Divider sx={{ my: 2 }} />

            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {curLangAr
                ? 'هذا التقرير لغرض التوعية الصحية فقط ولا يُغني عن الاستشارة الطبية أو التشخيص من قبل طبيب مختص.'
                : 'This report is for health awareness purposes only and does not replace professional medical advice or diagnosis.'}
            </Typography>
          </>
        )}
      </Stack>
    </Stack>
  );
}
