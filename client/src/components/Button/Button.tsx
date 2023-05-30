import React, { ReactNode } from 'react';
import { Button as ButtonMaterial } from '@mui/material';
import classNames from 'classnames';

import { styledButton } from './StyledButton';

export type TStyle = {
  color?: string;
  height?: number;
};

type TButton = {
  children?: ReactNode;
  disabled?: boolean;
  classname?: string;
  onClick?: () => void;
  style?: TStyle;
};

const Button = ({ children, disabled, classname, onClick, style }: TButton) => {
  return (
    <div className={classNames(classname)}>
      <ButtonMaterial
        variant="contained"
        disabled={disabled}
        sx={styledButton(style)}
        onClick={onClick}
        fullWidth
      >
        {children}
      </ButtonMaterial>
    </div>
  );
};

export default Button;
