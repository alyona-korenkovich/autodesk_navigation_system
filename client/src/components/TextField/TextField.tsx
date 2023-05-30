import React, { ChangeEvent, useRef, useState } from 'react';

import {
  FormHelperText,
  IconButton,
  InputAdornment,
  SxProps,
  TextField as TextFieldMaterial,
} from '@mui/material';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import {
  styledFormHelperTextAfter,
  styledFormHelperTextBefore,
  styledTextField,
} from './StyledTextField';

export enum ETextField {
  Text = 'text',
  Password = 'password',
}

type TTextField = {
  isError?: boolean;
  isPassword?: boolean;
  label?: string;
  value?: string | number;
  onChange?: (e?: ChangeEvent) => void;
  disabled?: boolean;
  type?: string;
  helperText?: string;
  placeholder?: string;
  isShowEye?: boolean;
  classNameContainer?: string;
  classNameInput?: string;
  name?: string;
  customStyle?: SxProps;
};

const TextField = ({
  disabled,
  isError,
  label,
  onChange,
  type,
  helperText,
  placeholder,
  isShowEye,
  classNameContainer,
  classNameInput,
  name,
  customStyle,
}: TTextField) => {
  const [isVisible, setVisible] = useState(false);
  const refType = useRef(type);

  const handleClickVisible = () => {
    setVisible((curValue) => {
      if (!curValue) {
        refType.current = ETextField.Text;
      } else {
        refType.current = ETextField.Password;
      }
      return !curValue;
    });
  };

  return (
    <div className={classNameContainer}>
      <FormHelperText sx={styledFormHelperTextBefore} disabled={disabled}>
        {label}
      </FormHelperText>
      <TextFieldMaterial
        name={name}
        fullWidth
        type={refType.current}
        error={isError}
        placeholder={placeholder}
        disabled={disabled}
        sx={
          isVisible
            ? styledTextField(isError)
            : ({ ...styledTextField(isError), ...customStyle } as SxProps)
        }
        size="small"
        onChange={onChange}
        InputProps={{
          endAdornment: isShowEye ? (
            <InputAdornment position="end">
              <IconButton onClick={handleClickVisible} disabled={disabled} edge="end">
                {isVisible ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ) : null,
          className: classNameInput,
        }}
      />
      <FormHelperText sx={styledFormHelperTextAfter(isError)} disabled={disabled}>
        {helperText}
      </FormHelperText>
    </div>
  );
};

export default TextField;
