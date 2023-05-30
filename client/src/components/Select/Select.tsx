import React from 'react';
import { FormControl, InputLabel, Select as SelectMui, SxProps } from '@mui/material';

const StyleSelect = {
  background: '#DCDCDC',
  lineHeight: '130%',
  borderRadius: '12px',
  color: '#070707',

  '& .MuiOutlinedInput-notchedOutline': {
    border: '0 none',
  },
};

const Select = ({ children, inputLabel, customStyle, ...props }: any) => {
  return (
    <>
      <FormControl size="small">
        {inputLabel && <InputLabel>{inputLabel}</InputLabel>}
        <SelectMui sx={{ ...StyleSelect, ...customStyle } as SxProps} {...props}>
          {children}
        </SelectMui>
      </FormControl>
    </>
  );
};

export default Select;
