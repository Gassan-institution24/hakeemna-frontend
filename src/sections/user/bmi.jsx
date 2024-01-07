import React, { useState, useCallback } from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { m } from 'framer-motion';
import { varFade, MotionViewport } from 'src/components/animate';

export default function Bmi() {
  const [height, setHeight] = useState(null);
  const [weight, setWeight] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('');

  const handleHeightChange = useCallback((e) => {
    setHeight(e.target.value);
  }, []);

  const handleWeightChange = useCallback((e) => {
    setWeight(e.target.value);
  }, []);

  const calculate = useCallback(() => {
    const bmi = weight / ((height / 100) ** 2);
    setResult(bmi);
  }, [height, weight]);

  return (
    <Stack
      component={MotionViewport}
      spacing={3}
      sx={{
        bgcolor: 'background.paper',
        boxShadow: 7,
        borderRadius: 2,
        p: 5,
        width: { xs: 340, md: 400 }
      }}
    >
      <m.div variants={varFade().inUp}>
        <Typography variant="h5">Calculate Your BMI</Typography>
      </m.div>

      <Stack spacing={3}>
        <m.div variants={varFade().inUp}>
          <TextField fullWidth label="Height" value={height} onChange={handleHeightChange} />
        </m.div>
        <m.div variants={varFade().inUp}>
          <TextField fullWidth label="Weight" value={weight} onChange={handleWeightChange} />
        </m.div>
      </Stack>

      <m.div variants={varFade().inUp}>
        <Button size="large" type="submit" variant="contained" onClick={calculate}>
          Calculate
        </Button>
      </m.div>

    {result !== null && (
  <m.div variants={varFade().inUp}>
    {result.toFixed(2) >= 18.5 && result.toFixed(2) < 24.9 && (
      <Typography variant="body1" style={{ color: 'green' }}>
        {result.toFixed(2)} Normal weight
      </Typography>
    )}
    {result.toFixed(2) >= 24.9 && result.toFixed(2) < 29.9 && (
      <Typography variant="body1" style={{ color: 'orange' }}>
        {result.toFixed(2)} Overweight
      </Typography>
    )}
    {result.toFixed(2) >= 29.9 && (
      <Typography variant="body1" style={{ color: 'red' }}>
        {result.toFixed(2)} Obese
      </Typography>
    )}
    {result.toFixed(2) < 18.5 && (
      <Typography variant="body1" style={{ color: 'red' }}>
        {result.toFixed(2)} Underweight
      </Typography>
    )}
  </m.div>
)}
    </Stack>
  );
}
