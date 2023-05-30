export const styledTextField = (error: boolean) => ({
  '& .MuiOutlinedInput-root': {
    fontFamily: 'var(--main-font-family)',
    '& fieldset': {
      fontColor: 'var(--text-input-color)',
      borderColor: 'var(--normal-grey-color)',
      borderRadius: '6px',
    },
    '&.Mui-focused fieldset': {
      border: `1px solid ${error ? 'var(--error-color)' : 'var(--active-grey-color)'}`,
    },
    '&.Mui-disabled fieldset': {
      backgroundColor: 'rgba(201, 201, 201, .29)',
    },
    '&.Mui-error': {
      borderColor: 'var(--error-color)',
    },
  },
});

export const styledFormHelperTextBefore = {
  fontSize: 14,
  fontFamily: 'var(--medium-font-family)',
  color: 'var(--active-grey-color)',
  '&.Mui-disabled': {
    fontColor: 'var(--normal-grey-color)',
  },
};

export const styledFormHelperTextAfter = (isError: boolean) => ({
  fontSize: 13,
  fontFamily: 'var(--main-font-family)',
  color: isError ? 'var(--error-color)' : 'var(--active-grey-color)',
  '&.Mui-disabled': {
    fontColor: 'var(--normal-grey-color)',
  },
});
