import { TCommonInitialState } from './types';
import { createSelector } from '@reduxjs/toolkit';

export const getCommon = (state: { common: TCommonInitialState }) => state?.common;

export const getProject = createSelector(getCommon, (common) => common?.project);

export const getToken = createSelector(getCommon, (common) => common?.token);

export const getUploadError = createSelector(getCommon, (common) => common?.project?.uploadError);

export const getStatusProject = createSelector(getCommon, (common) => common?.project?.status);

export const getUrnProject = createSelector(getProject, (project) => project?.urn);
