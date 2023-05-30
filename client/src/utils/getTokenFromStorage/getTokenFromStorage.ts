import { TOKEN } from '../../const/localStorage';

export const getTokenFromStorage = localStorage.getItem(TOKEN) ? localStorage.getItem(TOKEN) : '';
