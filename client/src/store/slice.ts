import { createSlice } from '@reduxjs/toolkit';
import { initialState } from './initialState';
import {
  clearErrorsUploadProject,
  clearServerErrorsRegister,
  clearServerErrorsLogin,
  registerUser,
  uploadProject,
  userSignIn,
  initElementsInProject,
} from './actions';
import { putTokenToStorage } from '../utils/putTokenToStorage/putTokenToStorage';
import { EStatusRequest } from './const';
import { INIT_PROJECT_ERROR } from '../const/errors';

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadProject.fulfilled, (state, { payload }) => {
        const { bucketKey, urn, projectId } = payload;
        state.project.bucketKey = bucketKey;
        state.project.urn = urn;
        state.project.projectId = projectId;
        state.project.status = EStatusRequest.SUCCESS;
      })
      .addCase(uploadProject.pending, (state) => {
        state.project.status = EStatusRequest.LOADING;
      })
      .addCase(uploadProject.rejected, (state, { payload }) => {
        state.project.uploadError = payload as string;
        state.project.status = EStatusRequest.FAILURE;
      })
      .addCase(initElementsInProject.fulfilled, (state) => {
        state.project.status = EStatusRequest.SUCCESS_INIT;
      })
      .addCase(initElementsInProject.pending, (state) => {
        state.project.status = EStatusRequest.LOADING;
        state.project.uploadError = null;
      })
      .addCase(initElementsInProject.rejected, (state) => {
        state.project.uploadError = INIT_PROJECT_ERROR;
        state.project.status = EStatusRequest.FAILURE;
      })
      .addCase(clearErrorsUploadProject, (state) => {
        state.project.uploadError = null;
      })
      .addDefaultCase((state) => state);
  },
});

export default slice.reducer;
