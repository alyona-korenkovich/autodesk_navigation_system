import { TOKEN } from '../../const/localStorage';

export const putTokenToStorage = (token: string) => {
  if (token) {
    window.localStorage.setItem(TOKEN, token);
  }
};
