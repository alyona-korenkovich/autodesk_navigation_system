export type TCommonInitialState = {
  userName: string;
  userEmail: string;
  id: string;
  role: string;
  token: string;
  isAuth: false;
  errorsRegisterValidation: {
    email?: string;
    name?: string;
    password?: string;
  };
  project: {
    bucketKey?: string;
    projectId?: string;
    uploadError?: string;
    urn?: string;
    status?: string;
  };
  errorsLoginValidation: {
    email?: string;
    password?: string;
  };
};
