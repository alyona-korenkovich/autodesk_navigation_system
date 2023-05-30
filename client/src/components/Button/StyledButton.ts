import { TStyle } from './Button';

export const styledButton = (style: TStyle) => ({
  backgroundColor: 'var(--red-color)',
  height: style?.height || 40,
  letterSpacing: 1,
  borderRadius: '35px',
  fontFamily: 'var(--medium-font-family)',
  boxShadow: 'none',
  transition: 'none',

  '&:hover': {
    backgroundColor: 'var(--hover-red-color)',
    boxShadow: 'none',
  },

  '&:disabled': {
    backgroundColor: 'var(--disabled-color)',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});
