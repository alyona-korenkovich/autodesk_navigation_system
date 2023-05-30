import { TCommonInitialState } from './types';
import { getTokenFromStorage } from '../utils/getTokenFromStorage/getTokenFromStorage';

export const initialState: TCommonInitialState = {
  userName: '',
  userEmail: '',
  id: '',
  role: '',
  token: getTokenFromStorage,
  isAuth: false,
  errorsRegisterValidation: null,
  project: {
    bucketKey: '',
    projectId: '',
    uploadError: '',
    status: '',
    urn: '',
  },
  errorsLoginValidation: null,
};
