import React from 'react';

type TInput = {
  onChange?: (target: HTMLInputElement) => void;
  type?: string;
  className?: string;
  disabled?: boolean;
  [key: string]: boolean | string | Function;
};

const Input = ({ onChange, type, disabled, ...props }: TInput) => {
  const changeHandler = ({ target }: { target: HTMLInputElement }) => {
    onChange(target);
  };
  return <input onChange={changeHandler} type={type} disabled={disabled} {...props} />;
};

export default Input;
