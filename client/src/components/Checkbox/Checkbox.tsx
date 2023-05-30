import { Checkbox as CheckboxMaterial, FormControlLabel } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { StyledCheckboxDefault, StyledForm } from './StyledCheckbox';

import styles from './Checkbox.module.scss';

type TCheckbox = {
  label?: string;
  defaultChecked?: boolean;
  disabled?: boolean;
  classNameContainer?: string;
  size?: 'small' | 'medium';
  name?: string;
  value?: boolean;
  onChange?: (e: ChangeEvent) => void;
};

const Checkbox = ({
  label,
  defaultChecked,
  disabled,
  classNameContainer,
  size,
  name,
  value,
  onChange,
}: TCheckbox) => {
  const checkboxElement = (
    <CheckboxMaterial
      size={size}
      name={name}
      defaultChecked={defaultChecked}
      value={value}
      onChange={onChange}
      sx={StyledCheckboxDefault}
    />
  );

  const labelElement = <div className={styles.label}>{label}</div>;
  return (
    <div className={classNameContainer}>
      <FormControlLabel
        control={checkboxElement}
        label={labelElement}
        disabled={disabled}
        sx={StyledForm}
      />
    </div>
  );
};

export default Checkbox;
