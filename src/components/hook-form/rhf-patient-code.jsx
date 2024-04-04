import PropTypes from 'prop-types';
import { Controller, useFormContext } from 'react-hook-form';
import React, { useRef } from 'react';
import { TextField } from '@mui/material';

export default function RHFCode({ name, ...other }) {
  const { control } = useFormContext();
  const inputRefs = useRef([]);

  const handleChange = (index, value) => {
    const nextIndex = index < 2 ? index + 1 : index; // Index of the next input
    if (value.length === 3 && inputRefs.current[nextIndex]) {
      inputRefs.current[nextIndex].focus(); // Focus on the next input field
    }
  };

  return (
    <div>
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <TextField
            type="text"
            {...field}
            autoFocus
            maxLength={3}
            onChange={(e) => {
              field.onChange(e);
              handleChange(0, e.target.value);
            }}
            ref={(ref) => {
              inputRefs.current.push(ref);
            }}
            {...other}
          />
        )}
      />
      <Controller
        name={`${name}-unlimited`}
        control={control}
        render={({ field }) => (
          <TextField
            type="text"
            {...field}
            onChange={(e) => {
              field.onChange(e);
              handleChange(1, e.target.value);
            }}
            ref={(ref) => {
              inputRefs.current.push(ref);
            }}
            {...other}
          />
        )}
      />
    </div>
  );
}

RHFCode.propTypes = {
  name: PropTypes.string,
};
